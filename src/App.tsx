import React from 'react';
import { Navigate, RouteObject, useRoutes } from 'react-router-dom';
import styled from 'styled-components';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Auth from './pages/auth/Auth';
import Main from './pages/main/Main';
import Result from './pages/result/Result';
import Search from './pages/search/Search';
import { useAppSelector } from './store/hooks';

type Props = {
  children: JSX.Element
  to: string
  isNavigate: boolean
}

const ProtectedRoute = ({ children, to, isNavigate }: Props) => {
  if (isNavigate) {
    return <Navigate to={to} />;
  } else {
    return children;
  }
}

function App() {

  const accessToken = useAppSelector(state => state.auth.accessToken)

  const routes: RouteObject[] = [
    {
      path: '/',
      element: (
        <Main />
      ),
    },
    {
      path: '/auth',
      element: (
        <Auth />
      ),
    },
    {
      path: '/result',
      element: <ProtectedRoute to='/auth' isNavigate={accessToken === ""}><Result /></ProtectedRoute>,
    },
    {
      path: '/search',
      element: (
        <ProtectedRoute to='/auth' isNavigate={accessToken === ""}><Search /></ProtectedRoute>
      ),
    },
  ];

  const elements = useRoutes(routes)

  return (
    <>
      <Header />
      <MainWrap>
        {elements}
      </MainWrap>
      <Footer />
    </>
  );
}

const MainWrap = styled.main`
  width: 100%;
  min-height: calc(100vh - 137px - 93px);
  padding-top: 20px;
  padding-right: 19px;
  padding-left: 19px;
  padding-bottom: 20px;
  box-sizing: border-box;

  @media (max-width: 750px) {
    padding-right: 14px;
    padding-left: 14px;
  }
`

export default App;
