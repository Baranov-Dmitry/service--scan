import { Checkbox } from 'antd';
import React, { useId, useMemo, useRef, useState } from 'react'
import { compareDates, validateInn } from '../../constants/helperFunctions';
import dayjs from 'dayjs'
import { debounce } from "lodash";
import { CSSTransition } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';
import {
  SearchContainer, SearchLeft, SearchLeftText, SearchLeftTitle, SearchLeftForm,
  InputsContainer, InputContainer, Label, RedStar, InputStyled, ErrorSearch, SelectStyled,
  InputNumberStyled, DatePickerContainer, DatePickerStyled, CheckBoxContainer,
  TextUnderButton, ButtonSubmit, SearchRight
} from './Search.Styled';
import { SearchState, SelectTonality } from '../../models/SearchState';

const Search = () => {

  const id = useId()
  const navigate = useNavigate()
  const [search, setSearch] = useState<SearchState>({
    dates: {
      startDate: "",
      startDateError: false,
      endDate: "",
      endDateError: false,
    },
    inn: {
      text: "",
      error: false
    },
    tonality: "any",
    limit: 0,
    isCountErr: false,

    inBusinessNews: false,
    maxFullness: false,
    onlyMainRole: false,
    onlyWithRiskFactors: false,
    excludeTechNews: false,
    excludeAnnouncements: false,
    excludeDigests: false,
  })

  const refINN = useRef<HTMLDivElement>(null)
  const refDateError = useRef<HTMLDivElement>(null)
  const refCountError = useRef<HTMLDivElement>(null)

  const isSubmitDisabled = () => {
    return search.dates.endDateError || search.dates.endDate === ""
      || search.dates.startDateError || search.dates.endDate === ""
      || search.inn.error || search.inn.text === ""
      || search.isCountErr || search.limit === 0
  }

  const isActiveSubmit = isSubmitDisabled()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isSubmitDisabled()) {
      return
    }

    const body = {
      issueDateInterval: {
        startDate: search.dates.startDate,
        endDate: search.dates.endDate
      },
      searchContext: {
        targetSearchEntitiesContext: {
          targetSearchEntities: [
            {
              type: "company",
              sparkId: null,
              entityId: null,
              inn: search.inn.text,
              maxFullness: search.maxFullness,
              inBusinessNews: search.inBusinessNews === false ? null : true
            }
          ],
          onlyMainRole: search.onlyMainRole,
          tonality: search.tonality,
          onlyWithRiskFactors: search.onlyWithRiskFactors,
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
        excludeTechNews: !search.excludeTechNews,
        excludeAnnouncements: !search.excludeAnnouncements,
        excludeDigests: !search.excludeDigests
      },
      similarMode: "duplicates",
      limit: search.limit,
      sortType: "sourceInfluence",
      sortDirectionType: "desc",
      intervalType: "month",
      histogramTypes: [
        "totalDocuments",
        "riskFactors"
      ]
    }

    navigate("/result", { state: body })
  }

  const handleInn = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(prev => ({ ...prev, inn: { text: e.target.value, error: !validateInn(e.target.value, { code: 0, message: "" }) } }))
  }

  const debounceHandleInn = useMemo(
    () => debounce(handleInn, 300)
    , [])

  const handleSelect = (value: unknown) => {
    setSearch(prev => ({ ...prev, tonality: value as SelectTonality }))
  }

  const onChangeStart: (date: dayjs.Dayjs | null, dateString: string) => void = (date, dateString) => {

    const compareWithNow = compareDates(dayjs(new Date()).format('YYYY-MM-DD'), dateString)
    const compareWithEnd = search.dates.endDate !== "" ? compareDates(search.dates.endDate, dateString) : ""

    if (compareWithNow !== "second" && (compareWithEnd === "" || compareWithEnd !== "second")) {

      const compareEnd = search.dates.endDate !== ""
        ? (compareDates(dayjs(new Date()).format('YYYY-MM-DD'), search.dates.endDate) === "second"
          || compareDates(search.dates.endDate, dateString) === "second")
        : false

      setSearch(prev => ({
        ...prev,
        dates: {
          startDate: dateString,
          startDateError: false, // search.date.endDate !== "" ? Date.now() > new Date(search.date.endDate).getTime() : false
          endDate: prev.dates.endDate,
          endDateError: compareEnd
        }
      }))

    } else {

      setSearch(prev => ({
        ...prev,
        dates: {
          startDate: dateString,
          startDateError: true,
          endDate: prev.dates.endDate,
          endDateError: prev.dates.endDateError
        }
      }))

    }

  }

  const onChangeEnd: (date: dayjs.Dayjs | null, dateString: string) => void = (date, dateString) => {

    const compareWithNow = compareDates(dayjs(new Date()).format('YYYY-MM-DD'), dateString)
    const compareWithStart = search.dates.startDate !== "" ? compareDates(dateString, search.dates.startDate) : ""

    if (compareWithNow !== "second" && (compareWithStart === "" || compareWithStart !== "second")) {

      const compareStart = search.dates.startDate !== ""
        ? (compareDates(dayjs(new Date()).format('YYYY-MM-DD'), search.dates.startDate) === "second"
          || compareDates(dateString, search.dates.startDate) === "second")
        : false

      setSearch(prev => ({
        ...prev,
        dates: {
          startDate: prev.dates.startDate,
          startDateError: compareStart, // search.date.endDate !== "" ? Date.now() > new Date(search.date.endDate).getTime() : false
          endDate: dateString,
          endDateError: false
        }
      }))

    } else {

      setSearch(prev => ({
        ...prev,
        dates: {
          startDate: prev.dates.startDate,
          startDateError: prev.dates.startDateError,
          endDate: dateString,
          endDateError: true
        }
      }))

    }

  }

  return (
    <SearchContainer>
      <SearchLeft>
        <SearchLeftText>
          <SearchLeftTitle>Найдите необходимые <br /> данные в пару кликов.</SearchLeftTitle>
          <span>Задайте параметры поиска. <br /> Чем больше заполните, тем точнее поиск</span>
        </SearchLeftText>
        <SearchLeftForm onSubmit={handleSubmit}>
          <InputsContainer>

            <InputContainer>
              <Label htmlFor={id + "INN"}>ИНН компании <RedStar isError={search.inn.error ? 1 : 0}>*</RedStar></Label>
              <InputStyled
                onChange={debounceHandleInn}
                size='large' id={id + "INN"}
                placeholder='10 цифр'
                iserror={search.inn.error ? 1 : 0} />
              <CSSTransition nodeRef={refINN} in={search.inn.error} timeout={200} classNames="my-node" unmountOnExit>
                <ErrorSearch ref={refINN}>Введите корректные данные</ErrorSearch>
              </CSSTransition>
            </InputContainer>

            <InputContainer>
              <Label htmlFor={id + "Key"}>Тональность</Label>
              <SelectStyled
                id={id + "Key"}
                defaultValue="any"
                onSelect={handleSelect}
                options={[
                  { value: 'any', label: 'Любая' },
                  { value: 'positive', label: 'Позитивная' },
                  { value: 'negative', label: 'Негативная' },
                ]}
              />
            </InputContainer>

            <InputContainer>
              <Label htmlFor={id + "Count"}>Количество документов в выдаче *</Label>
              <InputNumberStyled
                id={id + "Count"}
                min={1} max={1000}
                keyboard={true} placeholder='От 1 до 1000'
                onChange={value => {
                  if (typeof value === 'number') {
                    setSearch(prev => ({ ...prev, limit: value, isCountErr: false }))
                  } else {
                    setSearch(prev => ({ ...prev, isCountErr: true }))
                  }
                }}
              />
              <CSSTransition nodeRef={refCountError} in={search.isCountErr} timeout={200} classNames="my-node" unmountOnExit>
                <ErrorSearch ref={refCountError}>Обязательное поле</ErrorSearch>
              </CSSTransition>
            </InputContainer>

            <Label htmlFor={id + "RangeStart"}>Диапазон поиска *</Label>
            <DatePickerContainer>
              <DatePickerStyled
                id={id + "startDate"}
                placeholder='Дата начала'
                onChange={onChangeStart}
                error={search.dates.startDateError} />
              <DatePickerStyled
                id={id + "endDate"}
                placeholder='Дата конца'
                onChange={onChangeEnd}
                error={search.dates.endDateError} />
            </DatePickerContainer>
            <CSSTransition nodeRef={refDateError} in={(search.dates.startDateError || search.dates.endDateError)} timeout={200} classNames="my-node" unmountOnExit>
              <ErrorSearch ref={refDateError}>Введите корректные данные</ErrorSearch>
            </CSSTransition>

          </InputsContainer>
          <CheckBoxContainer>
            <Checkbox
              id={id + "maxFullness"}
              onChange={() => {
                setSearch(prev => ({ ...prev, maxFullness: !prev.maxFullness }))
              }}>
              Признак максимальной полноты
            </Checkbox>
            <Checkbox
              id={id + "inBusinessNews"}
              onChange={() => {
                setSearch(prev => ({ ...prev, inBusinessNews: !prev.inBusinessNews }))
              }}>
              Упоминания в бизнес-контексте
            </Checkbox>
            <Checkbox id={id + "onlyMainRole "}
              onChange={() => {
                setSearch(prev => ({ ...prev, onlyMainRole: !prev.onlyMainRole }))
              }}>
              Главная роль в публикации
            </Checkbox>
            <Checkbox
              id={id + "onlyWithRiskFactors"}
              onChange={() => {
                setSearch(prev => ({ ...prev, onlyWithRiskFactors: !prev.onlyWithRiskFactors }))
              }}>
              Публикации только с риск-факторами
            </Checkbox>
            <Checkbox
              id={id + "isTechNews"}
              onChange={() => {
                setSearch(prev => ({ ...prev, excludeTechNews: !prev.excludeTechNews }))
              }}>
              Включать технические новости рынков
            </Checkbox>
            <Checkbox
              id={id + "isAnnouncement"}
              onChange={() => {
                setSearch(prev => ({ ...prev, excludeAnnouncements: !prev.excludeAnnouncements }))
              }}>
              Включать анонсы и календари
            </Checkbox>
            <Checkbox
              id={id + "isDigest"}
              onChange={() => {
                setSearch(prev => ({ ...prev, excludeDigests: !prev.excludeDigests }))
              }}>
              Включать сводки новостей
            </Checkbox>
            <TextUnderButton>
              <ButtonSubmit type="submit" disabled={isActiveSubmit}>Поиск</ButtonSubmit>
              * Обязательные к заполнению поля
            </TextUnderButton>
          </CheckBoxContainer>
        </SearchLeftForm>
      </SearchLeft>
      <SearchRight />
    </SearchContainer >
  )
}

export default Search