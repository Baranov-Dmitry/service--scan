import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import { Provider } from 'react-redux';
import { store } from './store/store';
import { getFromLocalStorage } from './constants/helperFunctions';
import { AccessData, getFiltersInfoAsync, setToken } from './redusers/authSlice';

const accessData = getFromLocalStorage("accessData") as (AccessData | undefined)

if (accessData) {
  console.log("index start store")
  store.dispatch(setToken({ ...accessData }))
  store.dispatch(getFiltersInfoAsync(accessData.accessToken))
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);