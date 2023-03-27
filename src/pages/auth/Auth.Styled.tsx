import { Tabs } from "antd"
import styled from "styled-components"
import { GREEN, IMAGEPATH } from "../../constants/valiables"

export const TabsAuthStyled = styled(Tabs)`
  & .ant-tabs-nav-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  & .ant-tabs-tab {
    flex: 1 1 auto;
  }

  & .ant-tabs-tab-active .ant-tabs-tab-btn button{
    color: ${GREEN};
  }

  & .ant-tabs-tab-btn {
    width: 100%;
  }

  & .ant-tabs-ink-bar {
    background-color: ${GREEN};
  }
`

export const ButtonSwitch = styled.button`
  background-color: initial;
  text-align: center;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.02em;
  border: none;
  text-align: center;
  width: 100%;
  color: #C7C7C7;
  text-align: center;
  width: 100%;
  
  &:hover {
    cursor: pointer;
  }
`

export const AuthFormContainer = styled.div`
  width: 431px;
  /* width: 350px; */
  box-sizing: border-box;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  padding: 25px;
  position: relative;
  @media (max-width: 500px) {
    margin-left: 0;
    margin-top: 0;
    width: 100%;
    padding: 15px;
    margin-bottom: 30px;
  }
`

export const LockAbs = styled.div`
  position: absolute;
  left: -50px;
  top: -65px;
  width: 75px;
  height: 92px;
  background-image: url(${IMAGEPATH + "Lock.svg"});

  @media (max-width: 500px) {
    left: 85px;
    top: -76px;
  }
`

export const AuthPhoto = styled.div`
  width: 322px;
  height: 343px;
  background-image: url(${IMAGEPATH + "Characters.svg"});
  margin-left: 112px;
  margin-top: 16px;

  @media (max-width: 1350px) {
    margin-left: 0;
    margin-top: 0;
  }

  @media (max-width: 500px) {
    order: 3;
  }
`

export const AuthTitle = styled.h1`
  max-width: 750px;
  margin: 0;
  font-family: 'Ferry';
  font-style: normal;
  font-weight: 900;
  font-size: 40px;
  line-height: 48px;
  letter-spacing: 0.02em;
  color: #000000;

  @media (max-width: 1350px) {
    max-width: unset;
    width: 100%;
    display: block;
    flex-wrap: wrap;
    text-align: center;
    font-size: 30px;
    line-height: 26px;
    letter-spacing: 0.02em;
    margin-bottom: 40px;
  }

  @media (max-width: 1000px) {
    max-width: unset;
    width: 100%;
    display: block;
    flex-wrap: wrap;
    text-align: center;
    font-size: 25px;
    line-height: 26px;
    letter-spacing: 0.02em;
  }

  @media (max-width: 700px) {
    max-width: unset;
    width: 100%;
    display: block;
    flex-wrap: wrap;
    text-align: center;
    font-size: 22px;
    line-height: 26px;
    letter-spacing: 0.02em;
    margin-bottom: 0;
  }
  @media (max-width: 500px) {
    text-align: left;
    margin-bottom: 120px;
  }
`

export const AutchContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 510px;
  width: 1320px;
  margin: 46px auto 0;

  @media (max-width: 1350px) {
    flex-direction: row;
    justify-content: center;
    gap: 50px;
    width: 100%;
    height: auto;
  }

  @media (max-width: 500px) {
    gap: 0;
    margin-top: 22px;
  }
`