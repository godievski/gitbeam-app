import { createAsyncThunk } from "@reduxjs/toolkit";
import users_api from "../../../../core/gitlab/api/users_api";
import { TUser } from "../../../../core/gitlab/types/users_types";
import { createSliceWithReset, ThunkApi } from "../../../../store/utils";
import { DEFAULT_USER_STATE } from "./constants";

export const fetchUser = createAsyncThunk<TUser | null, void, ThunkApi>(
  "user/fetch",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState().user;

    if (state.loading) {
      try {
        return (await users_api.user()).data;
      } catch (e) {
        return thunkAPI.rejectWithValue(e);
      }
    }

    return null;
  }
);

const slice = createSliceWithReset({
  name: "user",
  initialState: DEFAULT_USER_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state, _) => {
      if (!state.loading) {
        return {
          ...state,
          loading: true,
        };
      }
      return state;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      if (action.payload === null) {
        return {
          ...state,
          loading: false,
        };
      }
      if (state.loading) {
        return {
          loading: false,
          data: { ...action.payload },
        };
      }
      return state;
    });

    builder.addCase(fetchUser.rejected, () => {
      return {
        loading: false,
        data: {} as TUser,
      };
    });
  },
});

export const userReducer = slice.reducer;
