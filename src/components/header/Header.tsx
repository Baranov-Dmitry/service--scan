import React, { useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import styled, { css } from 'styled-components'
import { GREEN, TURQUOISE } from '../../constants/valiables'

const Header = () => {

  const [login, setLogin] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const nodeRef = useRef<HTMLDivElement>(null);

  const itemsMenu = ["Главная", "Тарифы", "FAQ"]

  return (
    <>
      <HeaderWrap>
        <LeftContent>
          <Logo />
          <Menu>
            <GetMenuItems items={itemsMenu} />
          </Menu>
          <ButtonMobileMenu
            isOpen={isOpen}
            bgColor={GREEN}
            onClick={() => setIsOpen(prev => !prev)}>
            <span></span>
            <span></span>
            <span></span>
          </ButtonMobileMenu>
        </LeftContent>
        <ContainerLoginRegister>
          {login
            ? <>
              <Stats>
                <Use>Использовано компаний <span>34</span></Use>
                <Limit>Лимит по компаниям <span>100</span></Limit>
              </Stats>
              <User>
                <ContainerFlex>
                  <Name>Алексей А.</Name>
                  <UserLogOut onClick={() => setLogin(prev => !prev)}>Выйти</UserLogOut>
                </ContainerFlex>
                <img src="./images/UserLogo.png" alt="Logo" />
              </User>
            </>
            : <>
              <Register>Зарегистрироваться</Register>
              <GreenLine />
              <Login onClick={() => setLogin(prev => !prev)}>Войти</Login>
            </>
          }
        </ContainerLoginRegister>
      </HeaderWrap>
      <CSSTransition
        in={isOpen}
        nodeRef={nodeRef}
        classNames="alert"
        timeout={500}
        unmountOnExit>
        <PopUpMenu ref={nodeRef}>
          <ContainerFlexRow>
            <LogoWhiteSmall></LogoWhiteSmall>
            <ButtonMobileMenu
              isOpen={isOpen}
              bgColor={"white"}
              onClick={() => setIsOpen(prev => !prev)}>
              <span></span>
              <span></span>
              <span></span>
            </ButtonMobileMenu>
          </ContainerFlexRow>
          <MenuInPopUp>
            <GetMenuItems items={itemsMenu} />
          </MenuInPopUp>
          <Register>Зарегистрироваться</Register>
          <Login onClick={() => setLogin(prev => !prev)}>Войти</Login>
        </PopUpMenu>
      </CSSTransition>
    </>
  )
}

const GetMenuItems = ({ items }: { items: string[] }) => {
  return (
    <>
      {items.map(item => <li key={item}>{item}</li>)}
    </>
  )
}

const MenuInPopUp = styled.ul`
  display: flex;
  flex-direction: column;
  text-decoration: none;
  padding: 0;
  color: white;
  margin-top: 30px;
  list-style: none;
  justify-content: center;
  align-items: center;

  & li {
    margin-top: 13px;
    margin-bottom: 13px;
  }
`

const Menu = styled.ul`
  letter-spacing: 0.01em;
  display: flex;
  justify-content: center;
  list-style: none;
  margin-left: 335px;

  & li {
    margin: 0 24.5px;
  }

  @media (max-width: 1400px) {
    margin-left: 10vw;
    padding-left: 0px;
  }

  @media (max-width: 1000px) {
    margin-left: 5vw;

    & li {
      margin: 0 15px;
    }
  }

  @media (max-width: 778px) {
    display: none;
  }
`

const ContainerFlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 93px;
  padding-left: 14.25px;
  padding-right: 26px;
  align-items: center;
  box-sizing: border-box;
`

const ButtonMobileMenu = styled.div<{ isOpen: boolean, bgColor: string }>`
  width: 30px;
  height: 25px;
  position: relative;
  transform: rotate(0deg);
  transition: .5s ease-in-out;
  cursor: pointer;

  & span {
    display: block;
    position: absolute;
    height: 5px;
    width: 100%;
    background: ${p => (p.bgColor)};
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: .25s ease-in-out;
    border: none;
  }

  & span:nth-child(1) {
    top: 0px;
  }

  & span:nth-child(2) {
    top: 10px;
  }

  & span:nth-child(3) {
    top: 20px;
  }

  ${p => (p.isOpen ? css`
    & span:nth-child(1) {
      top: 10px;
      transform: rotate(135deg);
    }

    & span:nth-child(2) {
      opacity: 0;
      left: -60px;
    }

    & span:nth-child(3) {
      top: 10px;
      transform: rotate(-135deg);
    }
  `
    : null)};

  @media (min-width: 779px) {
    display: none;
  }

`

const PopUpMenu = styled.div`
  background-color: ${GREEN};
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  &.alert-enter {
    transform: translateX(100%);
  }
  &.alert-enter-active {
    transform: translateX(0%);
    transition: transform 0.5s ease;
  }
  &.alert-exit {
    transform: translateX(0%);
  }
  &.alert-exit-active {
    transform: translateX(100%);
    transition: transform 0.5s ease;
  }
`

const LogoWhiteSmall = styled.div`
  width: 111px;
  height: 93px;
  background-image: url(./images/WhiteLogoSmall.svg)
`

const ContainerFlex = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 4px;
  margin-left: 4px;
`

const UserLogOut = styled.button`
  color: rgba(0, 0, 0, 0.4);
  font-size: 10px;
  line-height: 12px;
  border: none;
  align-self: flex-end;
  background-color: white;
  margin-top: 3px;
  margin-right: -5px;
`

const Name = styled.div`
  color: rgba(0, 0, 0, 0.7);
  font-size: 14px;
  line-height: 17px;
`

const User = styled.div`
  display: none;
  display: flex;
  margin-left: 125px;

  img {
    width: 32px;
    height: 32px;
  }

  @media (max-width: 1400px) {
    margin-left: 5vw;
  }
  
`

const Stats = styled.div`
  width: 175px;
  height: 63px;
  font-size: 10px;
  line-height: 12px;
  background: rgba(217, 217, 217, 0.3);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Use = styled.div`
  margin: 2.5px 0;
  display: flex;

  & span {
    color: #000;
    margin-left: 10px;
    font-weight: 700;
    font-size: 14px;
  }
`

const Limit = styled.div`
  margin: 3.5px 0;
  display: flex;

  & span {
    color: #8AC540;
    margin-left: 10px;
    font-weight: 700;
    font-size: 14px;
  }
`

const LeftContent = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  @media (max-width: 778px) {
    justify-content: space-between;
    width: 100%;
    margin-left: 26px;
    margin-right: 26px;
  }
`

const Register = styled.button`
  color: #000000;
  border: none;
  background-color: white;
  color: #000000;
  border: none;
  color: rgba(0, 0, 0, 0.4);

  @media (max-width: 778px) {
    color: rgba(255, 255, 255, 0.4);
    background-color: transparent;
    font-size: 16px;
  }
`

const Login = styled.button`
  width: 65px;
  height: 26px;
  background: ${TURQUOISE};
  border-radius: 5px;
  border: none;

  @media (max-width: 778px) {
    width: 295px;
    height: 51.96px;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 0.01em;
    margin-top: 20px;
  }
`

const ContainerLoginRegister = styled.div`
  display: flex;
  margin-right: 60px;
  align-items: center;

  @media (max-width: 1000px) {
    margin-right: 26px;
  }

  @media (max-width: 778px) {
    display: none;
  }
`

const GreenLine = styled.div`
  width: 2px;
  height: 26px;

  background: #029491;
  opacity: 0.6;
  transform: matrix(-1, 0, 0, 1, 0, 0);
  margin: 0 20px 0 16px;
`

const HeaderWrap = styled.header`
  width: 100%;
  height: 93px;
  display: flex;
  justify-content: space-between;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #000000;
`

const Logo = styled.div`
  width: 143px;
  height: 93px;
  background-image: url(./images/HeaderLogo.svg);
  margin-left: 59px;

  @media (max-width: 1200px) {
    width: 111px;
    background-image: url(./images/LogoSmall.png);
  }

  @media (max-width: 1000px) {
    margin-left: 26px;
  }

  @media (max-width: 778px) {
    margin-left: 0;
  }
`

export default Header