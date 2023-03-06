import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../redusers/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer
  },
});