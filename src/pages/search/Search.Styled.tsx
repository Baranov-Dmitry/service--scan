import { DatePicker, InputNumber, Select, Input } from "antd"
import styled, { css } from "styled-components"

export const RedStar = styled.span<{ isError?: number }>`
  ${p => p.isError === 1 && css`
    color: #FF5959;
  `}
`

export const InputContainer = styled.div`
  width: 242px;
`

export const ErrorSearch = styled.div`
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

export const TextUnderButton = styled.div`
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

export const ButtonSubmit = styled.button`
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

export const CheckBoxContainer = styled.div`
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

export const DatePickerStyled = styled(DatePicker) <{ error: boolean }>`
  width: 177px;
  height: 43px;

  ${p => p.error && css`
    border-color:#FF5959;
  `}

  @media (max-width: 550px) {
    width: 100%;
  }
`

export const DatePickerContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  
  @media (max-width: 550px) {
    flex-direction: column;
  }
`

export const InputNumberStyled = styled(InputNumber)`
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

export const SelectStyled = styled(Select)`
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

export const InputStyled = styled(Input) <{ iserror: number }>`
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

export const InputsContainer = styled.div`
  padding-top: 9px;
  padding-left: 4px;
`

export const Label = styled.label`
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

export const SearchLeftTitle = styled.div`
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

export const SearchLeftText = styled.div`
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

export const SearchLeftForm = styled.form`
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

export const SearchRight = styled.div`
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

export const SearchLeft = styled.div`
  width: 872px;

  @media (max-width: 900px) {
    width: 100%;
  }
`

export const SearchContainer = styled.div`
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