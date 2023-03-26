import { Carousel, Col, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import SeatchCarousel from '../../components/carousels/SeatchCarousel'
import { Loading } from '../../components/header/Header'
import ResultItem from '../../components/ResultItem/ResultItem'
import { IMAGEPATH } from '../../constants/valiables'
import { useAppSelector } from '../../store/hooks'
import { SearchState } from '../search/Search'

interface AnalyticsIntervalPoint {
  date: string
  value: number
}

export interface AnalyticsHistogramData {
  data: AnalyticsIntervalPoint[]
  histogramType: "totalDocuments" | "riskFactors"
}

interface SearchResultItem {
  encodedId: string
  influence: number
  similarCount: number
}

export interface ScanDoc {
  ok: {
    schemaVersion: string
    id: string
    version: number
    issueDate: string
    url: string
    source: DocumentSource
    dedupClusterId: string
    title: DocumentTitle
    content: DocumentContent
    attributes: DocumentAttributes
    language: "Russian" | "other" | "unknown"
  }
}

interface Fail {
  fail: {
    errorCode: string
    errorMessage: string
  }
}

// interface DocumentAuthor {
//   name: string
// }

interface DocumentSource {
  id: number
  name: string
  categoryId: number
  levelId: number
  groupId: number
}

interface DocumentTitle {
  text: string,
  markup: string
}

interface DocumentContent {
  markup: string
}

interface DocumentAttributes {
  isTechNews: boolean
  isAnnouncement: boolean
  isDigest: boolean
  wordCount: number
}

const Result = () => {

  const accessToken = useAppSelector(state => state.auth.accessToken)
  // const [isLoading, setIsloading] = useState(false)
  const [histogramData, setHistogramData] = useState<AnalyticsHistogramData[] | null>(null)
  const [objectSearch, setObjectSearch] = useState<SearchResultItem[] | null>(null)
  const [posts, setPosts] = useState<{ posts: Array<ScanDoc | Fail>, lastLoadedPost: number }>({
    posts: [],
    lastLoadedPost: 0
  })

  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  const searchState = location.state as SearchState | undefined

  const isActiveLoadMore = posts.posts.length === 0 || objectSearch?.length === posts.lastLoadedPost ? false : true

  const url = "https://gateway.scan-interfax.ru/api/v1/"

  const POSTSPERLOAD = 10

  const count = objectSearch === null ? "считаем" : objectSearch.length

  const loadHistogram = async (body: {}) => {

    try {

      const [responseHistogram, responseObjectSearch] = await Promise.all([
        fetchUrl(url + "objectsearch/histograms", body, accessToken),
        fetchUrl(url + "objectsearch", body, accessToken)
      ])

      // const responseHistogram = await fetchUrl(url + "objectsearch/histograms", body, accessToken)
      // const responseObjectSearch = await fetchUrl(url + "objectsearch", body, accessToken)

      if (!responseHistogram.ok || !responseObjectSearch.ok) {
        throw new Error("Something went wrong");
      }

      const [histogramData, objectSearchData]: [
        { data: AnalyticsHistogramData[] },
        { items: SearchResultItem[], mappings: any }
      ] = await Promise.all([
        responseHistogram.json(),
        responseObjectSearch.json()
      ])

      // const histogramData = await responseHistogram.json() as { data: AnalyticsHistogramData[] }
      // const data = await responseObjectSearch.json() as { items: SearchResultItem[], mappings: any }
      setHistogramData(histogramData.data)
      setObjectSearch(objectSearchData.items.slice(1, 50))

    } catch (error) {

      console.log("Error: ", error)

    }
  }

  const loadMorePosts = async () => {
    if (!objectSearch || posts.lastLoadedPost === objectSearch.length) {
      console.log("Note: Cannot load more posts objectSearch empty or all loaded")
      return
    }

    setIsLoadingMore(prev => !prev)

    const start = posts.lastLoadedPost
    const end = (posts.lastLoadedPost + POSTSPERLOAD) < objectSearch.length ? posts.lastLoadedPost + POSTSPERLOAD : objectSearch.length

    const ids = {
      ids: objectSearch.slice(start, end).map(obj => obj.encodedId)
    }

    try {

      const responce = await fetchUrl(url + "documents", ids, accessToken)

      if (responce.ok) {

        const data = await responce.json() as Array<ScanDoc>
        setPosts(prev => ({ posts: [...prev.posts, ...data], lastLoadedPost: end }))

      } else {
        throw new Error("Something went wrong with loading new posts");
      }

    } catch (error) {
      console.log("Error: ", error)
    }

    setIsLoadingMore(prev => !prev)

  }

  useEffect(() => {
    if (!accessToken) return
    if (!searchState) {
      // brouserRouter ругаеться если редиректить в теле компонента
      navigate("/search")
      return
    }

    const body = {
      issueDateInterval: {
        startDate: searchState.dates.startDate,
        endDate: searchState.dates.endDate
      },
      searchContext: {
        targetSearchEntitiesContext: {
          targetSearchEntities: [
            {
              type: "company",
              sparkId: null,
              entityId: null,
              inn: searchState.inn.text,
              maxFullness: searchState.maxFullness,
              inBusinessNews: searchState.inBusinessNews === false ? null : true
            }
          ],
          onlyMainRole: searchState.onlyMainRole,
          tonality: searchState.tonality,
          onlyWithRiskFactors: searchState.onlyWithRiskFactors,
          riskFactors: {
            and: [],
            or: [],
            not: []
          },
          themes: {
            "and": [],
            "or": [],
            "not": []
          }
        },
        themesFilter: {
          "and": [],
          "or": [],
          "not": []
        }
      },
      searchArea: {
        includedSources: [],
        excludedSources: [],
        includedSourceGroups: [],
        excludedSourceGroups: []
      },
      attributeFilters: {
        excludeTechNews: !searchState.excludeTechNews,
        excludeAnnouncements: !searchState.excludeAnnouncements,
        excludeDigests: !searchState.excludeDigests
      },
      similarMode: "duplicates",
      limit: searchState.limit,
      sortType: "sourceInfluence",
      sortDirectionType: "desc",
      intervalType: "month",
      histogramTypes: [
        "totalDocuments",
        "riskFactors"
      ]
    }

    loadHistogram(body)

    return () => {
      // нужно отменить запрос если пользователь ушел со страницы
    }

  }, [])

  useEffect(() => {

    if (objectSearch === null || objectSearch.length === 0) return
    loadMorePosts()

    return () => {
      // нужно отменить запрос если пользователь ушел со страницы
    }

  }, [objectSearch?.length])

  return (
    <ResultContainer>
      <ResultTextLogoContainer>
        <ResultText>
          <ResultTextTitle>Ищем. Скоро <br /> будут результаты</ResultTextTitle>
          <ResultTextTitleSmall>Поиск может занять некоторое время, <br /> просим сохранять терпение.</ResultTextTitleSmall>
        </ResultText>
        <ResultLogo />
      </ResultTextLogoContainer>

      <ResultTimeline>
        <ResultTimelineTitle>Общая сводка</ResultTimelineTitle>
        <ResultTimelineDetails>Найдено {count} вариантов</ResultTimelineDetails>
        <ResultCarusel>
          <ResultCaruselDetails>
            <span>Период</span>
            <span>Всего</span>
            <span>Риски</span>
          </ResultCaruselDetails>
          <ResultCaruselWrap>
            {
              histogramData === null
                ? <ResultCaruselLoading>
                  <Loading />
                  <span>Загружаем данные</span>
                </ResultCaruselLoading>
                : histogramData[0] === undefined
                  ? <Row justify="center" align="middle" style={{ width: "100%" }}>
                    Постов не найдено
                  </Row>
                  : <SeatchCarousel histogram={histogramData} />
            }
          </ResultCaruselWrap>

        </ResultCarusel>
      </ResultTimeline>

      <ResultListWrap>
        <ResultListTitle>Список документов</ResultListTitle>
        <ResultList>

          {
            posts.posts.map(post => {
              if (post.hasOwnProperty("ok")) {
                const typedPost = post as ScanDoc
                return <ResultItem key={typedPost.ok.id} typedPost={typedPost} />
              } else {
                // fail post
                return null
              }
            })
          }

        </ResultList>

        {isActiveLoadMore && <ButtonLoadMore onClick={loadMorePosts}>{isLoadingMore ? <Loading /> : "Показать больше"}</ButtonLoadMore>}

      </ResultListWrap>
    </ResultContainer>
  )
}



const fetchUrl = (url: string, body: {}, accessToken: string) => {
  return fetch(url, {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken,
    },
    body: JSON.stringify(body)
  })
}

const ResultCaruselLoading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  text-align: center;
  
  & div {
    width: 50px;
    height: 50px;
    background-size: 100%;
  }

  & span {
    font-size: 18px;
  }

  @media (max-width: 600px) {
    & span {
      display: none;
    }
  }
`



const ResultList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  flex-wrap: wrap;
  
  @media (max-width: 1300px) {
    gap: 20px;
  }

  @media (max-width: 900px) {
    flex-direction: column;
  }
`

const ButtonLoadMore = styled.button`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  line-height: 27px;
  letter-spacing: 0.04em;
  color: #FFFFFF;
  border: none;
  width: 305px;
  height: 59px;
  background: #5970FF;
  border-radius: 5px;
  margin-top: 30px;

  justify-content: center;
  display: flex;
  align-items: center;
`

const ResultListTitle = styled.h4`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 26px;
  line-height: 31px;
  letter-spacing: 0.02em;
  color: #000000;
`

const ResultListWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;

`

const ResultCaruselItem = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  position: relative;
  margin-right: 5px;

  span {
    padding: 17px 22px 12px 16px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
    letter-spacing: 0.02em;
    color: #000000;
  }

  span:last-child {
    padding: 11px 22px 19px 16px;
  }

  &::after {
    content: "";
    display: block;
    position: absolute;
    top: 15px;
    right: 0;
    width: 2px;
    height: calc(100% - 30px);
    background-color: rgba(148, 148, 148, 0.4);
  }

  
`

const ResultCaruselWrap = styled.div`
  width: calc(100% - 136px);

  @media (max-width: 500px) {
    width: 100%;
  }
`

const ResultCaruselDetails = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #029491;
  width: 130px;

  & span {
    padding: 17px 27px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 0.02em;
    color: #FFFFFF;
    padding: 16px 26px 8.5px;
  }

  & span:last-child {
    padding-bottom: 17px;
  }

  @media (max-width: 500px) {
    flex-direction: row;
    width: 100%;
    font-size: 18px;
    line-height: 22px;
    letter-spacing: 0.01em;
    height: 75px;
    align-self: center;
    border-radius: 10px 10px 0 0;
    margin-top: -2px;
    justify-content: center;

    & span {
      font-size: 18px;
      padding: 14px 16px 17.5px;
      line-height: 45px;
    }
  }

`

const ResultCarusel = styled.div`
  display: flex;
  margin: 26px 35px 20px;
  border: 2px solid #029491;
  border-radius: 10px;
  box-sizing: border-box;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`

const ResultTimelineDetails = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: 0.02em;
  color: #949494;
  margin-bottom: 15px;


`

const ResultTimelineTitle = styled.h2`
  font-family: 'Ferry';
  font-style: normal;
  font-weight: 900;
  font-size: 30px;
  line-height: 36px;
  letter-spacing: 0.02em;
  margin-bottom: 21px;
`

const ResultTimeline = styled.div`
  margin-top: -10px;
`

const ResultLogo = styled.div`
  width: 552px;
  height: 369px;
  background-image: url(${IMAGEPATH + "ResultLogo.svg"});
  
  margin-right: 45px;
  margin-top: 5px;

  background-size: 100%;
  background-repeat: no-repeat;

  @media (max-width: 1300px) {
    width: 400px;
    height: 289px;
    margin-right: 0;
  }

  @media (max-width: 500px) {
    width: 345px;
    height: 235px;
  }
  
`

const ResultTextTitleSmall = styled.h4`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.015em;

  @media (max-width: 850px) {
    font-size: 18px;
    line-height: 22px;
  }
`

const ResultTextTitle = styled.h1`
  font-family: 'Ferry';
  font-style: normal;
  font-weight: 900;
  font-size: 40px;
  line-height: 48px;
  letter-spacing: 0.05em;
  margin-top: 46px;
  margin-bottom: 40px;

  @media (max-width: 850px) {
    font-size: 28px;
    line-height: 34px;
    letter-spacing: 0.01em;
  }

  
`

const ResultTextLogoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  margin-bottom: -46px;

  @media (max-width: 850px) {
    flex-direction: column;
    align-items: center;
    margin-bottom: 0;
  }
`

const ResultText = styled.div`
  
`

const ResultContainer = styled.div`
  max-width: 1320px;
  margin: 0 auto
`

export default Result