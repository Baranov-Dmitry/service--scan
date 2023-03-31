import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redusers/authSlice";
import histogramSlice from "../redusers/histogramSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    histogram: histogramSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
