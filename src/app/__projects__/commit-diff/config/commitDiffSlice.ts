import { createAsyncThunk } from "@reduxjs/toolkit";
import commits_api from "../../../../core/gitlab/api/commits_api";
import {
  APIGetCommitDiffParams,
  TCommitDiffParsed,
} from "../../../../core/gitlab/types/commits_types";
import { RootState } from "../../../../store/rootReducer";
import { createSliceWithReset, ThunkApi } from "../../../../store/utils";
import { DEFAULT_STATE, DEFAULT_ITEM_STATE } from "./constants";
import { CommitDiffState } from "./types";
import { getCommitDiffKey } from "./utils";

type FetchCommitDiffArg = APIGetCommitDiffParams & { force_fetch?: boolean };
type FetchCommitDiffReturn = TCommitDiffParsed[] | null;

export const fetchCommitDiff = createAsyncThunk<
  FetchCommitDiffReturn,
  FetchCommitDiffArg,
  ThunkApi
>("commit_diff/fetch", async (arg, thunkAPI) => {
  const key = getCommitDiffKey(arg);
  const item = getCommitDiffItem(thunkAPI.getState().commit_diff)(key);

  if (item.loading) {
    try {
      const res = await commits_api.getCommitDiff(arg);
      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }

  return null;
});

const slice = createSliceWithReset({
  name: "commit_diff",
  initialState: DEFAULT_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCommitDiff.pending, (state, action) => {
      const { arg } = action.meta;
      const key = getCommitDiffKey(arg);
      const item = getCommitDiffItem(state)(key);
      let should_fetch = true;
      if (item.loading) {
        should_fetch = false;
      } else {
        should_fetch = arg.force_fetch ? true : item.entities === undefined;
      }

      if (should_fetch) {
        return {
          ...state,
          [key]: {
            ...item,
            loading: true,
          },
        };
      } else {
        return state;
      }
    });

    builder.addCase(fetchCommitDiff.fulfilled, (state, action) => {
      const arg = action.meta.arg;
      const key = getCommitDiffKey(arg);
      const item = getCommitDiffItem(state)(key);
      if (action.payload === null) {
        return {
          ...state,
          [key]: {
            ...item,
            loading: false,
          },
        };
      } else {
        if (item.loading) {
          return {
            ...state,
            [key]: {
              loading: false,
              entities: action.payload,
            },
          };
        }
      }
      return state;
    });

    builder.addCase(fetchCommitDiff.rejected, (state, action) => {
      const arg = action.meta.arg;
      const key = getCommitDiffKey(arg);
      const item = getCommitDiffItem(state)(key);
      return {
        ...state,
        [key]: { ...item, loading: false },
      };
    });
  },
});

export const getCommitDiffItem = (state: CommitDiffState) => (key: string) =>
  state[key] ?? DEFAULT_ITEM_STATE;

export const selectCommitDiffItem = (state: RootState) => (key: string) =>
  getCommitDiffItem(state.commit_diff)(key);

export const commitDiffReducer = slice.reducer;
