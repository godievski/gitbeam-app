import { createAsyncThunk } from "@reduxjs/toolkit";
import users_api from "../../../../core/gitlab/api/users_api";
import { TSShKey } from "../../../../core/gitlab/types/users_types";
import { createSliceWithReset, ThunkApi } from "../../../../store/utils";
import { DEFAULT_SSH_KEYS_STATE } from "./constants";

export const fetchSshKeys = createAsyncThunk<TSShKey[] | null, void, ThunkApi>(
  "ssh_keys/fetch",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState().ssh_keys;
    if (state.loading) {
      try {
        return (await users_api.ssh_keys()).data;
      } catch (e) {
        return thunkAPI.rejectWithValue(e);
      }
    }

    return null;
  }
);

const slice = createSliceWithReset({
  name: "ssh_keys",
  initialState: DEFAULT_SSH_KEYS_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSshKeys.pending, (state, action) => {
      if (!state.loading) {
        return {
          ...state,
          loading: true,
        };
      }
      return state;
    });
    builder.addCase(fetchSshKeys.fulfilled, (state, action) => {
      if (action.payload === null) {
        return {
          ...state,
          loading: false,
        };
      }
      if (state.loading) {
        return {
          ...state,
          loading: false,
          entities: [...action.payload],
        };
      }
      return state;
    });
    builder.addCase(fetchSshKeys.rejected, (state, action) => {
      return {
        ...state,
        entities: [],
        loading: false,
      };
    });
  },
});

export const sshKeysReducer = slice.reducer;
