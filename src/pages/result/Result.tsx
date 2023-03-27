import React, { useEffect, useState } from 'react'
import { Row } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import SeatchCarousel from '../../components/carousels/ResultCarousel'
import { Loading } from '../../components/header/Header.Styled'
import ResultItem from '../../components/ResultItem/ResultItem'
import { countUsagePlus } from '../../redusers/authSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { SearchState } from '../search/Search'
import { ButtonLoadMore, ResultCarusel, ResultCaruselDetails, ResultCaruselLoading, ResultCaruselWrap, ResultContainer, ResultList, ResultListTitle, ResultListWrap, ResultLogo, ResultTextLogoContainer, ResultTextTitle, ResultTextTitleSmall, ResultTimeline, ResultTimelineDetails, ResultTimelineTitle } from './Result.Styled'

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
  const dispatch = useAppDispatch()

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
      dispatch(countUsagePlus())

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
        <div>
          <ResultTextTitle>Ищем. Скоро <br /> будут результаты</ResultTextTitle>
          <ResultTextTitleSmall>Поиск может занять некоторое время, <br /> просим сохранять терпение.</ResultTextTitleSmall>
        </div>
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

export default Result