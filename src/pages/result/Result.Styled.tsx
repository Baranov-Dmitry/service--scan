import styled from "styled-components"
import { IMAGEPATH } from "../../constants/valiables"

export const ResultCaruselLoading = styled.div`
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

export const ResultList = styled.div`
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

export const ButtonLoadMore = styled.button`
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

export const ResultListTitle = styled.h4`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 26px;
  line-height: 31px;
  letter-spacing: 0.02em;
  color: #000000;
`

export const ResultListWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;

`

export const ResultCaruselWrap = styled.div`
  width: calc(100% - 136px);

  @media (max-width: 500px) {
    width: 100%;
  }
`

export const ResultCaruselDetails = styled.div`
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

export const ResultCarusel = styled.div`
  display: flex;
  margin: 26px 35px 20px;
  border: 2px solid #029491;
  border-radius: 10px;
  box-sizing: border-box;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`

export const ResultTimelineDetails = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: 0.02em;
  color: #949494;
  margin-bottom: 15px;


`

export const ResultTimelineTitle = styled.h2`
  font-family: 'Ferry';
  font-style: normal;
  font-weight: 900;
  font-size: 30px;
  line-height: 36px;
  letter-spacing: 0.02em;
  margin-bottom: 21px;
`

export const ResultTimeline = styled.div`
  margin-top: -10px;
`

export const ResultLogo = styled.div`
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

export const ResultTextTitleSmall = styled.h4`
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

export const ResultTextTitle = styled.h1`
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

export const ResultTextLogoContainer = styled.div`
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

export const ResultContainer = styled.div`
  max-width: 1320px;
  margin: 0 auto
`