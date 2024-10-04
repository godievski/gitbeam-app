import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  unwrapResult,
} from "@reduxjs/toolkit";
import filesystem_api from "../../../core/filesystem_api";
import {
  createSliceWithReset,
  resetAction,
  ThunkApi,
} from "../../../store/utils";
import { DEFAULT_CREDENTIAL_STATE } from "./constants";
import { CredentialStatus } from "./types";
import { setAPIAccessToken, removeAPIAccessToken } from "../../../core/oauth";
import { AuthorizeResult } from "react-native-app-auth";
import { fetchUser } from "../../__profile__/profile/config/userSlice";
import secureStorage from "./secureStorage";

export const revokeCredential = createAsyncThunk<boolean, void, ThunkApi>(
  "credential/revoke",
  async (_, thunkAPI) => {
    try {
      await filesystem_api.deleteAllFiles();
      await secureStorage.removeCredential();
      removeAPIAccessToken();
      thunkAPI.dispatch(resetAction());
      return true;
    } catch (e) {
      //try hard
      thunkAPI.dispatch(resetAction());
      return false;
    }
  }
);

type ValidateCredentialArg = {
  credential: AuthorizeResult;
};
export const validateCredential = createAsyncThunk<
  boolean,
  ValidateCredentialArg,
  ThunkApi
>("credential/save", async (arg, thunkAPI) => {
  const dispatch = thunkAPI.dispatch;
  const credential = arg.credential;

  try {
    await secureStorage.saveCredential(credential);
    setAPIAccessToken(credential);
    await dispatch(fetchUser()).then(unwrapResult);
    return true;
  } catch (e) {
    removeAPIAccessToken();
    return thunkAPI.rejectWithValue(e);
  }
});

const slice = createSlice({
  name: "credential",
  initialState: DEFAULT_CREDENTIAL_STATE,
  reducers: {
    updateStatus: (
      state,
      action: PayloadAction<{ error?: any; status: CredentialStatus }>
    ) => {
      return {
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(validateCredential.fulfilled, () => {
      return {
        status: CredentialStatus.success,
      };
    });
    builder.addCase(validateCredential.rejected, () => {
      return {
        status: CredentialStatus.empty,
      };
    });
    builder.addCase(revokeCredential.fulfilled, () => {
      return {
        status: CredentialStatus.empty,
      };
    });
    builder.addCase(revokeCredential.rejected, () => {
      return {
        status: CredentialStatus.empty,
      };
    });
  },
});

export const { updateStatus: updateAuthStatus } = slice.actions;

export const credentialReducer = slice.reducer;
