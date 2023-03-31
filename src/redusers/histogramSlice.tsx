import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUrl } from "../constants/helperFunctions";
import { AppDispatch, RootState, store } from "../store/store";

interface AnalyticsIntervalPoint {
  date: string;
  value: number;
}

export interface AnalyticsHistogramData {
  data: AnalyticsIntervalPoint[];
  histogramType: "totalDocuments" | "riskFactors";
}

export interface SearchResultItem {
  encodedId: string;
  influence: number;
  similarCount: number;
}

export interface ScanDoc {
  ok: {
    schemaVersion: string;
    id: string;
    version: number;
    issueDate: string;
    url: string;
    source: DocumentSource;
    dedupClusterId: string;
    title: DocumentTitle;
    content: DocumentContent;
    attributes: DocumentAttributes;
    language: "Russian" | "other" | "unknown";
  };
}

export interface Fail {
  fail: {
    errorCode: string;
    errorMessage: string;
  };
}

interface DocumentSource {
  id: number;
  name: string;
  categoryId: number;
  levelId: number;
  groupId: number;
}

interface DocumentTitle {
  text: string;
  markup: string;
}

interface DocumentContent {
  markup: string;
}

interface DocumentAttributes {
  isTechNews: boolean;
  isAnnouncement: boolean;
  isDigest: boolean;
  wordCount: number;
}

export type loadingState = "idle" | "pending" | "succeeded" | "failed";

export const getHistogramAsync = createAsyncThunk<
  // Return type of the payload creator
  | { histogram: AnalyticsHistogramData[]; objectSearch: SearchResultItem[] }
  | undefined,
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

  try {
    const [responseHistogram, responseObjectSearch] = await Promise.all([
      fetchUrl(url + "objectsearch/histograms", body, accessToken),
      fetchUrl(url + "objectsearch", body, accessToken),
    ]);

    if (!responseHistogram.ok || !responseObjectSearch.ok) {
      throw new Error("Something went wrong");
    }

    const [histogramData, objectSearchData]: [
      { data: AnalyticsHistogramData[] },
      { items: SearchResultItem[]; mappings: any }
    ] = await Promise.all([
      responseHistogram.json(),
      responseObjectSearch.json(),
    ]);

    // thunkAPI.dispatch(getPostsAsync())

    return {
      histogram: histogramData.data,
      objectSearch: objectSearchData.items,
    };
  } catch (error) {
    console.log("Error: ", error);
  }

  return undefined;
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

  console.log(start, end)

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
      (state, action: PayloadAction<undefined | { histogram: AnalyticsHistogramData[], objectSearch: SearchResultItem[] }>) => {
        if (action.payload === undefined) return;
        console.log(action.payload.histogram)
        return {
          ...state,
          loadingHistogram: "succeeded",
          histogramData: action.payload.histogram,
          objectSearch: action.payload.objectSearch,
        };
      }
    );

    builder.addCase(getHistogramAsync.rejected, (state, action) => {
      state.loadingHistogram = 'failed';
    });

    builder.addCase(getPostsAsync.pending, (state, action) => {
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
    builder.addCase(getPostsAsync.rejected, (state, action) => {
      state.loadingPosts = "failed"
    });
  },
});

export const { unsetHistogram } = histogramSlice.actions

export default histogramSlice.reducer;
