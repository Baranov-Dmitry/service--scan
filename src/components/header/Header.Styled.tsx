import { NavLink } from "react-router-dom"
import styled, { css } from "styled-components"
import { IMAGEPATH, GREEN, TURQUOISE } from "../../constants/valiables"

export const Loading = styled.div`
  width: 24px;
  height: 24px;
  background-image: url(${IMAGEPATH + "speen.svg"});

  animation-name: spin;
  animation-duration: 500ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;

  @keyframes spin { 
    from { 
        transform: rotate(0deg); 
    } to { 
        transform: rotate(360deg); 
    }
  }
`

export const NavLinkSt = styled(NavLink)`
  color: ${p => p.color};
  text-decoration: none;
`

export const MenuInPopUp = styled.ul`
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

export const Menu = styled.ul`
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

export const ContainerFlexRow = styled.div`
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

export const ButtonMobileMenu = styled.div<{ isOpen: boolean, bgColor: string }>`
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

export const PopUpMenu = styled.div`
  background-color: ${GREEN};
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10000;

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

  @media (min-width: 779px) {
    display: none;
  }
`

export const LogoWhiteSmall = styled.div`
  width: 111px;
  height: 93px;
  background-image: url(./images/WhiteLogoSmall.svg)
`

export const ContainerFlex = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 4px;
  margin-left: 4px;
`

export const UserLogOut = styled.button<{ colorBg: string }>`
  color: ${p => p.color};
  font-size: 10px;
  line-height: 12px;
  border: none;
  align-self: flex-end;
  background-color: ${p => p.colorBg};
  margin-top: 3px;
  margin-right: -5px;
`

export const Name = styled.div`
  color: ${p => p.color};
  font-size: 14px;
  line-height: 17px;
`

export const User = styled.div<{ marginZero: boolean }>`
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

  ${p => p.marginZero && css`
    @media (max-width: 778px) {
      margin-left: 0;
      margin-top: 15px;
    }
  `}
  
`

export const Stats = styled.div`
  color: ${p => p.color};
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

export const Use = styled.div`
  margin: 2.5px 0;
  display: flex;

  & span {
    color: #000;
    margin-left: 10px;
    font-weight: 700;
    font-size: 14px;
  }
`

export const Limit = styled.div`
  margin: 3.5px 0;
  display: flex;

  & span {
    color: #8AC540;
    margin-left: 10px;
    font-weight: 700;
    font-size: 14px;
  }
`

export const LeftContent = styled.div`
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

export const Register = styled.button`
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

export const Login = styled(NavLink)`
  width: 65px;
  height: 26px;
  background: ${TURQUOISE};
  border-radius: 5px;
  border: none;

  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #000;

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

export const ContainerLoginRegister = styled.div`
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

export const GreenLine = styled.div`
  width: 2px;
  height: 26px;

  background: #029491;
  opacity: 0.6;
  transform: matrix(-1, 0, 0, 1, 0, 0);
  margin: 0 20px 0 16px;
`

export const HeaderWrap = styled.header`
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

export const Logo = styled.div`
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