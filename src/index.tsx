import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import { Provider } from 'react-redux';
import { store } from './store/store';
import { getFromLocalStorage } from './constants/helperFunctions';
import { getFiltersInfoAsync, setToken } from './redusers/authSlice';
import { AccessData } from './models/User';

const accessData = getFromLocalStorage("accessData") as (AccessData | undefined)

if (accessData) {

  if (new Date(accessData.expire).getTime() > Date.now()) {

    store.dispatch(setToken({ ...accessData }))
    store.dispatch(getFiltersInfoAsync(accessData.accessToken))

  } else {

    localStorage.removeItem("accessData")

  }

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