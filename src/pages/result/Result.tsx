import React, { useEffect } from 'react'
import { Row } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import SeatchCarousel from '../../components/carousels/ResultCarousel'
import { Loading } from '../../components/header/Header.Styled'
import ResultItem from '../../components/ResultItem/ResultItem'
import { countUsagePlus } from '../../redusers/authSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { ButtonLoadMore, ResultCarusel, ResultCaruselDetails, ResultCaruselLoading, ResultCaruselWrap, ResultContainer, ResultList, ResultListTitle, ResultListWrap, ResultLogo, ResultTextLogoContainer, ResultTextTitle, ResultTextTitleSmall, ResultTimeline, ResultTimelineDetails, ResultTimelineTitle } from './Result.Styled'
import { getHistogramAsync, getPostsAsync } from '../../redusers/histogramSlice'
import { ScanDoc } from '../../models/Histogram'
import { SearchState } from '../../models/SearchState'

const Result = () => {

  const accessToken = useAppSelector(state => state.auth.accessToken)
  const [histogramData, objectSearch, posts, loadingPosts] = useAppSelector(state => ([
    state.histogram.histogramData,
    state.histogram.objectSearch,
    state.histogram.posts,
    state.histogram.loadingPosts
  ]))

  const dispatch = useAppDispatch()

  const location = useLocation()
  const navigate = useNavigate()

  const searchState = location.state as SearchState | undefined

  const isActiveLoadMore = posts.length !== 0 && loadingPosts !== "failed" && loadingPosts !== "succeeded" ? true : false

  const count = objectSearch === null ? "считаем" : objectSearch.length

  useEffect(() => {
    if (!accessToken) return
    if (!searchState) {
      // brouserRouter ругаеться если редиректить в теле компонента
      navigate("/search")
      return
    }

    dispatch(getHistogramAsync(searchState)).then(() => dispatch(getPostsAsync()))
    dispatch(countUsagePlus())

    return () => {
      // нужно отменить запрос если пользователь ушел со страницы
    }

  }, [])

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

          {posts.length === 0
            ? <div>Loading.....</div>
            : posts.map(post => {
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

        {isActiveLoadMore &&
          <ButtonLoadMore
            onClick={() => dispatch(getPostsAsync())}>
            {loadingPosts === "pending" ? <Loading /> : "Показать больше"}
          </ButtonLoadMore>}

      </ResultListWrap>
    </ResultContainer >
  )
}

export default Result