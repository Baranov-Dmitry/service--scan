import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUrl } from "../constants/helperFunctions";
import { AppDispatch, RootState } from "../store/store";
import { AnalyticsHistogramData, Fail, loadingState, ScanDoc, SearchResultItem } from "../models/Histogram";

const initialState: {
  histogramData: AnalyticsHistogramData[] | null;
  objectSearch: SearchResultItem[] | null;
  loadingHistogram: loadingState;

  posts: Array<ScanDoc | Fail>;
  loadingPosts: loadingState;
  lastLoadedPost: number;
} = {
  histogramData: null,
  objectSearch: null,
  loadingHistogram: "idle",

  posts: [],
  lastLoadedPost: 0,
  loadingPosts: "idle",
};

export const getHistogramAsync = createAsyncThunk<
  // Return type of the payload creator
  { histogram: AnalyticsHistogramData[]; objectSearch: SearchResultItem[] },
  // First argument to the payload creator
  object,
  {
    // Optional fields for defining thunkApi field types
    dispatch: AppDispatch;
    state: RootState;
  }
>("histogram/fetchData", async (body, thunkAPI) => {
  const url = "https://gateway.scan-interfax.ru/api/v1/";
  const accessToken = thunkAPI.getState().auth.accessToken;

  if (!accessToken) throw new Error("Something went wrong with loading new posts");

  const [responseHistogram, responseObjectSearch] = await Promise.all([
    fetchUrl(url + "objectsearch/histograms", body, accessToken),
    fetchUrl(url + "objectsearch", body, accessToken),
  ]);

  if (!responseHistogram.ok || !responseObjectSearch.ok) {
    throw new Error("Something went wrong with loading new posts");
  }

  const [histogramData, objectSearchData]: [
    { data: AnalyticsHistogramData[] },
    { items: SearchResultItem[]; mappings: any }
  ] = await Promise.all([
    responseHistogram.json(),
    responseObjectSearch.json(),
  ]);

  return {
    histogram: histogramData.data,
    objectSearch: objectSearchData.items,
  };

});

export const getPostsAsync = createAsyncThunk<
  // Return type of the payload creator
  { data: Array<ScanDoc>, lastLoadedPost: number },
  // First argument to the payload creator
  undefined,
  {
    // Optional fields for defining thunkApi field types
    dispatch: AppDispatch;
    state: RootState;
  }
>("histogram/fetchPosts", async (NoNeed, thunkAPI) => {

  const objectSearch = thunkAPI.getState().histogram.objectSearch
  const start = thunkAPI.getState().histogram.lastLoadedPost

  if (objectSearch === null || objectSearch.length === start) throw new Error("Something went wrong with loading new posts");

  const url = "https://gateway.scan-interfax.ru/api/v1/";

  const accessToken = thunkAPI.getState().auth.accessToken;

  const POSTSPERLOAD = 10

  const end = (start + POSTSPERLOAD) < objectSearch.length ? start + POSTSPERLOAD : objectSearch.length

  const ids = {
    ids: objectSearch.slice(start, end).map(obj => obj.encodedId)
  }

  const responce = await fetchUrl(url + "documents", ids, accessToken)

  if (!responce.ok) {
    throw new Error("Something went wrong with loading new posts");
  }

  const data = await responce.json() as Array<ScanDoc>

  return {
    data,
    lastLoadedPost: end
  }

});

export const histogramSlice = createSlice({
  name: "histogram",
  initialState,
  reducers: {
    unsetHistogram() {
      return initialState
    }
  },

  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getHistogramAsync.pending, (state) => {
      state.loadingHistogram = "pending";
    });

    builder.addCase(getHistogramAsync.fulfilled,
      (state, action: PayloadAction<{ histogram: AnalyticsHistogramData[], objectSearch: SearchResultItem[] }>) => {
        if (action.payload === undefined) return state;

        return {
          ...state,
          loadingHistogram: "succeeded",
          histogramData: action.payload.histogram,
          objectSearch: action.payload.objectSearch,
        };
      }
    );

    builder.addCase(getHistogramAsync.rejected, (state) => {
      state.loadingHistogram = 'failed';
    });

    builder.addCase(getPostsAsync.pending, (state) => {
      state.loadingPosts = "pending";
    });
    builder.addCase(getPostsAsync.fulfilled, (state, action) => {
      let loading: loadingState;
      if (state.objectSearch?.length === action.payload.lastLoadedPost) {
        loading = "succeeded"
      } else {
        loading = "idle"
      }
      return { ...state, posts: [...state.posts, ...action.payload.data], loadingPosts: loading, lastLoadedPost: action.payload.lastLoadedPost }
    });
    builder.addCase(getPostsAsync.rejected, (state) => {
      state.loadingPosts = "failed"
    });
  },
});

export const { unsetHistogram } = histogramSlice.actions

export default histogramSlice.reducer;
