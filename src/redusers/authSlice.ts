import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { saveLocalStorage } from "../constants/helperFunctions";
import { eventFiltersInfo, User } from "../models/User";

const initialState: User = {
  id: "",
  name: "",
  countUsage: 0,
  counterLimit: 0,
  accessToken: "",
  expire: "",
  eventFiltersInfo: undefined,
  loadingInfo: "idle",
  error: undefined,
};

export const getFiltersInfoAsync = createAsyncThunk(
  "auth/fetch",
  async (accessToken: string) => {
    const url = "https://gateway.scan-interfax.ru/api/v1/account/info";

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + accessToken,
      },
    });

    const data = await response.json();

    return data;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut() {
      localStorage.removeItem("accessData");
      return initialState;
    },

    setToken(
      state,
      action: PayloadAction<{ accessToken: string; expire: string }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.expire = action.payload.expire;
      saveLocalStorage("accessData", JSON.stringify(action.payload));
      // getUserInfo(action.payload.accessToken, setInfo)
    },

    setInfo(state, action: PayloadAction<eventFiltersInfo>) {
      state.eventFiltersInfo = action.payload.eventFiltersInfo;
    },

    countUsagePlus(state) {
      state.countUsage += 1;
    },
  },

  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getFiltersInfoAsync.pending, (state) => {
      state.loadingInfo = "pending";
    });
    builder.addCase(
      getFiltersInfoAsync.fulfilled,
      (
        state,
        action: PayloadAction<{
          eventFiltersInfo: { usedCompanyCount: number; companyLimit: number };
        }>
      ) => {
        return {
          ...state,
          eventFiltersInfo: { ...action.payload.eventFiltersInfo },
          loadingInfo: "succeeded",
        };
      }
    );
    builder.addCase(getFiltersInfoAsync.rejected, (state, action) => {
      if (state.loadingInfo === "pending") {
        state.loadingInfo = "failed";
        state.error = action.error.message;
      }
    });
  },
});

export const { logOut, setToken, setInfo, countUsagePlus } = authSlice.actions;

export default authSlice.reducer;
