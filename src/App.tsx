import React from 'react';
import { RouteObject, useRoutes } from 'react-router-dom';
import styled from 'styled-components';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Auth from './pages/auth/Auth';
import Main from './pages/main/Main';
import Result from './pages/result/Result';
import Search from './pages/search/Search';

function App() {

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
      element: (
        <Result />
      ),
    },
    {
      path: '/search',
      element: (
        <Search />
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
