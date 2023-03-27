import { Checkbox, DatePicker, Input, InputNumber, Select } from 'antd';
import React, { useId, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components';
import { compareDates, validateInn } from '../../constants/helperFunctions';
import dayjs from 'dayjs'
import { debounce } from "lodash";
import { CSSTransition } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';

type SelectTonality = "any" | "negative" | "positive"

export interface SearchState {
  dates: {
    startDate: string
    startDateError: boolean
    endDate: string
    endDateError: boolean
  },
  inn: {
    text: string
    error: boolean
  },
  tonality: SelectTonality
  limit: number
  isCountErr: boolean
  inBusinessNews: boolean
  maxFullness: boolean
  onlyMainRole: boolean
  onlyWithRiskFactors: boolean
  excludeTechNews: boolean
  excludeAnnouncements: boolean
  excludeDigests: boolean
}

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

    navigate("/result", { state: search })

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

const RedStar = styled.span<{ isError?: number }>`
  ${p => p.isError === 1 && css`
    color: #FF5959;
  `}
`

const InputContainer = styled.div`
  width: 242px;
`

const ErrorSearch = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0.01em;
  color: #FF5959;
  width: 100%;
  text-align: center;
  margin-top: 7px;
`

const TextUnderButton = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0.03em;
  color: #949494;
  margin-top: 133px;
  margin-left: 100px;

  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
    margin-top: 40px;
    margin-left: 0;
  }
`

const ButtonSubmit = styled.button`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  line-height: 27px;
  letter-spacing: 0.03em;
  color: #FFFFFF;

  width: 305px;
  height: 59px;
  background: rgba(89, 112, 255, 1);
  border-radius: 5px;
  border: none;

  margin-bottom: 10px;

  &:disabled {
    background: rgba(89, 112, 255, 0.5);
  }
  
`

const CheckBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;
  margin-top: 43px;

  & .ant-checkbox-wrapper+.ant-checkbox-wrapper {
    margin-inline-start: 0;
  }

  & .ant-checkbox+span {
    padding-inline-start: 17px;
    font-size: 18px;
    font-size: 18px;
    line-height: 22px;
    letter-spacing: 0.03em;
  }

  & .ant-checkbox-inner {
    width: 20px;
    height: 20px;
  }
`

const DatePickerStyled = styled(DatePicker) <{ error: boolean }>`
  width: 177px;
  height: 43px;

  ${p => p.error && css`
    border-color:#FF5959;
  `}

  @media (max-width: 550px) {
    width: 100%;
  }
`

const DatePickerContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  
  @media (max-width: 550px) {
    flex-direction: column;
  }
`

const InputNumberStyled = styled(InputNumber)`
  width: 242px;
  height: 43px;

  & .ant-input-number-input {
    height: 43px;
    text-align: center;
  }

  @media (max-width: 550px) {
    width: 100%;
  }
`

const SelectStyled = styled(Select)`
  width: 242px;
  height: 43px;
  &.ant-select .ant-select-selector {
    width: 100%;
    height: 43px;
    padding: 5px 11px;
  }

  @media (max-width: 550px) {
    width: 100%;
  }
`

const InputStyled = styled(Input) <{ iserror: number }>`
  width: 242px;
  text-align: center;
  padding: 8.5px 11px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 550px) {
    width: 100%;
  }

  ${p => p.iserror === 1 && css`
    border-color: #FF5959;
    box-shadow: 0px 0px 20px rgba(255, 89, 89, 0.2);
  `}
`

const InputsContainer = styled.div`
  padding-top: 9px;
  padding-left: 4px;
`

const Label = styled.label`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: 0.03em;
  color: #000000;
  padding: 30px 0 20px 0;
  display: block;
`

const SearchLeftTitle = styled.div`
  font-family: 'Ferry';
  font-style: normal;
  font-weight: 900;
  font-size: 40px;
  line-height: 48px;
  letter-spacing: 0.03em;
  color: #000000;
  margin-bottom: 28px;

  @media (max-width: 900px) {
    text-align: center;
    font-weight: 900;
    font-size: 28px;
    line-height: 34px;
    letter-spacing: 0.01em;
  }
`

const SearchLeftText = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.024em;
  color: #000000;
  padding-left: 6px;

  @media (max-width: 900px) {
    & span {
      font-style: normal;
      font-weight: 400;
      font-size: 18px;
      line-height: 22px;
      text-align: center;
      display: block
    }
  }

  @media (max-width: 550px) {
    br {
      display: none;
    }
  }
  
`

const SearchLeftForm = styled.form`
    width: 100%;
    box-shadow: 0px 0px 20px rgba(0,0,0,0.2);
    border-radius: 10px;
    padding: 0 40px 20px 40px;
    box-sizing: border-box;
    margin-top: 37px;
    display: flex;
    flex-direction: row;
    gap: 10px;

    @media (max-width: 900px) {
      flex-direction: column;
      width: 465px;
      margin: 30px auto 0;
    }

    @media (max-width: 550px) {
      width: 335px;
      padding: 0 14px 14px 14px;
    }
    
`

const SearchRight = styled.div`
  margin-top: 66px;
  width: 512px;
  height: 689px;
  background-repeat: no-repeat;
  background-image: url(./images/SearchPhoto.svg);
  background-position: top left;

  @media (max-width: 900px) {
    margin-top: 40px;
    height: 475px;
    background-position: bottom left;
  }

  @media (max-width: 550px) {
    background-size: 100% auto;
    width: 330px;
    height: 310px;
    margin-top: 20px;
  }
`

const SearchLeft = styled.div`
  width: 872px;

  @media (max-width: 900px) {
    width: 100%;
  }
`

const SearchContainer = styled.div`
  width: 1335px;
  margin: 46px auto 0;
  display: flex;
  gap: 13px;

  @media (max-width: 1360px) {
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  @media (max-width: 900px) {
    margin-top: 20px;
  }
`

export default Search