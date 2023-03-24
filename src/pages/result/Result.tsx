import { Col, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Loading } from '../../components/header/Header'
import { IMAGEPATH } from '../../constants/valiables'
import { useAppSelector } from '../../store/hooks'
import { SearchState } from '../search/Search'

interface AnalyticsIntervalPoint {
  date: string
  value: number
}

interface AnalyticsHistogramData {
  data: AnalyticsIntervalPoint[]
  histogramType: "totalDocuments" | "riskFactors"
}

interface SearchResultItem {
  encodedId: string
  influence: number
  similarCount: number
}

interface ScanDoc {
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

// const body = {
//   "issueDateInterval": {
//     "startDate": "2022-08-31",
//     "endDate": "2022-08-31"
//   },
//   "searchContext": {
//     "targetSearchEntitiesContext": {
//       "targetSearchEntities": [
//         {
//           "type": "company",
//           "sparkId": null,
//           "entityId": null,
//           "inn": 7710137066,
//           "maxFullness": true,
//           "inBusinessNews": null
//         }
//       ],
//       "onlyMainRole": true,
//       "tonality": "any",
//       "onlyWithRiskFactors": false,
//       "riskFactors": {
//         "and": [],
//         "or": [],
//         "not": []
//       },
//       "themes": {
//         "and": [],
//         "or": [],
//         "not": []
//       }
//     },
//     "themesFilter": {
//       "and": [],
//       "or": [],
//       "not": []
//     }
//   },
//   "searchArea": {
//     "includedSources": [],
//     "excludedSources": [],
//     "includedSourceGroups": [],
//     "excludedSourceGroups": []
//   },
//   "attributeFilters": {
//     "excludeTechNews": true,
//     "excludeAnnouncements": true,
//     "excludeDigests": true
//   },
//   "similarMode": "duplicates",
//   "limit": 1000,
//   "sortType": "sourceInfluence",
//   "sortDirectionType": "desc",
//   "intervalType": "month",
//   "histogramTypes": [
//     "totalDocuments",
//     "riskFactors"
//   ]
// }

const Result = () => {

  const accessToken = useAppSelector(state => state.auth.accessToken)
  // const [isLoading, setIsloading] = useState(false)
  const [histogramData, setHistogramData] = useState<AnalyticsHistogramData[] | null>(null)
  const [objectSearch, setObjectSearch] = useState<SearchResultItem[] | null>(null)
  const [posts, setPosts] = useState<{ posts: Array<ScanDoc | Fail>, lastLoadedPost: number }>({
    posts: [],
    lastLoadedPost: 0
  })

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
            {histogramData === null
              ? <ResultCaruselLoading>
                <Loading />
                <span>Загружаем данные</span>
              </ResultCaruselLoading>
              : histogramData[0] === undefined
                ? <Row justify="center" align="middle" style={{ width: "100%" }}>
                  Постов не найдено
                </Row>
                : histogramData[0].data.map((dataFild, index) => {
                  const date = new Date(dataFild.date).toLocaleDateString("en-US")
                  // date.replaceAll("/", ".")
                  return (<ResultCaruselItem key={dataFild.date}>
                    <span>{date.replaceAll("/", ".")}</span>
                    <span>{dataFild.value}</span>
                    <span>{histogramData[1].data[index].value}</span>
                  </ResultCaruselItem>)
                })}

          </ResultCaruselWrap>

        </ResultCarusel>
      </ResultTimeline>

      <ResultListWrap>
        <ResultListTitle>Список документов</ResultListTitle>
        <ResultList>

          {posts.posts.map(post => {
            if (post.hasOwnProperty("ok")) {
              const typedPost = post as ScanDoc
              return <ResultPostItem key={typedPost.ok.id} typedPost={typedPost} />
            } else {
              // fail post
              return null
            }
          })}

        </ResultList>

        {isActiveLoadMore && <ButtonLoadMore onClick={loadMorePosts}>Показать больше</ButtonLoadMore>}

      </ResultListWrap>
    </ResultContainer>
  )
}

const ResultPostItem = React.memo(({ typedPost }: { typedPost: ScanDoc }) => {

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(typedPost.ok.content.markup, "text/xml").documentElement.textContent ?? '';

  return (
    <ResultItem>
      <ResultItemDetails>
        <span>{new Date(typedPost.ok.issueDate).toLocaleDateString()}</span>
        <span>{typedPost.ok.source.name}</span>
      </ResultItemDetails>
      <ResultItemTitle>{typedPost.ok.title.text}</ResultItemTitle>
      <ResultItemTitleButton>
        {
          typedPost.ok.attributes.isAnnouncement ? "Сводки новостей" : ""
            + typedPost.ok.attributes.isDigest ? "Анонс или календарь событий" : ""
              + typedPost.ok.attributes.isTechNews ? "Технические новости" : ""
        }
      </ResultItemTitleButton>
      <ResultItemImage image="11.png" />
      <ResultItemText dangerouslySetInnerHTML={{ __html: xmlDoc }}></ResultItemText>
      <Row justify="space-between" align="bottom" style={{ marginTop: "30px" }}>
        <ResultItemButton to={typedPost.ok.url} target="_blank">Читать в источнике</ResultItemButton>
        <WordCount>{typedPost.ok.attributes.wordCount} слова</WordCount>
      </Row>
    </ResultItem>
  )
})

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

const WordCount = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.02em;

  color: #949494;
`

const ResultCaruselLoading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

  & div {
    width: 50px;
    height: 50px;
    background-size: 100%;
  }

  & span {
    font-size: 18px;
  }
`

const ResultItemImage = styled.div<{ image: string }>`
  width: 100%;
  height: 158px;
  background: url(${p => IMAGEPATH + p.image});
  border-radius: 10px;
  background-size: 100%;
  margin-bottom: 20px;
`

const ResultItemText = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.02em;

  & img {
    max-width: 100%;
  }

  color: rgba(0,0,0,0.5);

  & p {
    margin: 20px 0;
  }
`

const ResultItemTitleButton = styled.div`
  padding: 0 14px;
  height: 22px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.02em;
  color: #000000;
  background: #FFB64F;
  border-radius: 5px;
  align-self: flex-start;
  margin: 14px 0;
  display: flex;
  align-items: center;
`

const ResultItemTitle = styled.h4`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 26px;
  line-height: 31px;
  letter-spacing: 0.02em;
  color: #000000;
  margin: 14px 0 0 0;
`

const ResultItemDetails = styled.div`
  display: flex;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.02em;
  text-decoration-line: underline;
  color: #949494;

  & span:first-child {
    margin-right: 10px;
  }
`

const ResultItem = styled.div`
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 20px 30px 30px 30px;
  width: calc(50% - 15px);
  box-sizing: border-box;
  overflow: hidden;
`

const ResultList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  flex-wrap: wrap;
`

const ResultItemButton = styled(Link)`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.02em;
  color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;

  width: 223px;
  height: 46px;
  background: #7CE3E1;
  border-radius: 5px;

  border: none;
  

  &:hover {
    cursor: pointer;
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
  width: calc(100% - 70px);
  display: flex;
`

const ResultCaruselDetails = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #029491;

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
`

const ResultCarusel = styled.div`
  display: flex;
  margin: 26px 35px 20px;
  border: 2px solid #029491;
  border-radius: 10px;
  box-sizing: border-box;
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
`

const ResultTextTitleSmall = styled.h4`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.015em;

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
`

const ResultTextLogoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  margin-bottom: -46px;
`

const ResultText = styled.div`
  
`

const ResultContainer = styled.div`
  width: 1320px;
  margin: 0 auto
`

export default Result