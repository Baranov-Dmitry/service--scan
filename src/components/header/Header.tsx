import React, { useCallback, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import { GREEN } from '../../constants/valiables'
import { logOut } from '../../redusers/authSlice'
import { unsetHistogram } from '../../redusers/histogramSlice'
import { useAppSelector } from '../../store/hooks'
import {
  HeaderWrap, LeftContent, Logo, Menu, ButtonMobileMenu,
  ContainerLoginRegister, Register, GreenLine, Login, PopUpMenu,
  ContainerFlexRow, LogoWhiteSmall, MenuInPopUp, Stats, Loading,
  Use, Limit, User, ContainerFlex, Name, UserLogOut, NavLinkSt
} from './Header.Styled'

interface MenuItem {
  name: string,
  link: string
}

const Header = () => {

  const authData = useAppSelector((state) => state.auth)
  const [isOpen, setIsOpen] = useState(false)
  const nodeRef = useRef<HTMLDivElement>(null);

  const itemsMenu = [
    { name: "Главная", link: "/" },
    { name: "Тарифы", link: "" },
    { name: "FAQ", link: "" },
  ]

  const handeClose = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [],)

  return (
    <>
      <HeaderWrap>
        <LeftContent>
          <NavLink to="/">
            <Logo />
          </NavLink>
          <Menu>
            <GetMenuItems items={itemsMenu} popUp={true} />
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
          {authData.loadingInfo === 'pending' || authData.loadingInfo === 'succeeded'
            ? <UserHeaderData
              companyLimit={authData.eventFiltersInfo?.companyLimit}
              usedCompanyCount={authData.eventFiltersInfo?.usedCompanyCount}
              loading={authData.loadingInfo === 'pending' ? true : false} />
            : <>
              <Register>Зарегистрироваться</Register>
              <GreenLine />
              <Login to="/auth">Войти</Login>
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
            <GetMenuItems items={itemsMenu} handeClose={handeClose} />
          </MenuInPopUp>
          {authData.eventFiltersInfo !== undefined
            ? <UserHeaderData {...authData.eventFiltersInfo} popUp={true} />
            : <>
              <Register>Зарегистрироваться</Register>
              <Login to="/auth" onClick={handeClose}>Войти</Login>
            </>
          }
        </PopUpMenu>
      </CSSTransition>
    </>
  )
}

interface UserHeaderDataProp { loading?: boolean, popUp?: boolean, usedCompanyCount?: number, companyLimit?: number }

const UserHeaderData = ({ loading = false, popUp = false, usedCompanyCount, companyLimit, }: UserHeaderDataProp) => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogOut = () => {
    dispatch(logOut())
    dispatch(unsetHistogram())
    navigate("/")
  }

  return (
    <>
      <Stats color={popUp ? "white" : "inherit"}>
        {loading ? <Loading />
          : <>
            <Use>Использовано компаний <span>{usedCompanyCount}</span></Use>
            <Limit>Лимит по компаниям <span>{companyLimit}</span></Limit>
          </>
        }
      </Stats>
      <User marginZero={popUp}>
        <ContainerFlex>
          <Name
            color={popUp ? "white" : "rgba(0, 0, 0, 0.7);"}
          >Алексей А.</Name>
          <UserLogOut
            colorBg={popUp ? "inherit" : "white"}
            color={popUp ? "white" : "rgba(0, 0, 0, 0.7);"}
            onClick={handleLogOut}>
            Выйти
          </UserLogOut>
        </ContainerFlex>
        <img src="./images/UserLogo.png" alt="Logo" />
      </User>
    </>
  )
}

const GetMenuItems = ({ items, popUp, handeClose }: { items: MenuItem[], popUp?: boolean, handeClose?: () => void }) => {
  return (
    <>
      {items.map(item =>
        <li key={item.name}>
          {item.link !== ""
            ? < NavLinkSt color={!popUp ? "#fff" : "#000"} onClick={handeClose} to={item.link}>
              {item.name}
            </NavLinkSt>
            : item.name
          }
        </li>)
      }
    </>
  )
}

export default React.memo(Header)