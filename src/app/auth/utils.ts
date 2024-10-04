import {
  ToastContextValue,
  TOAST_TYPES,
} from "../../components/Toast/ToastContext";
import { AuthorizeResult } from "react-native-app-auth";
import { API_HTTP_STATUS } from "../../core/gitlab/api";
import { HttpGitlabError } from "../../core/gitlab/utils";
import { AppDispatch } from "../../store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { revokeCredential, validateCredential } from "./config/authSlice";

export const AUTHENTICATION_VERIFICATION_FORBIDDEN =
  "Please access GitLab from a web browser to accept the Terms of Service.";

export const AUTHENTICATION_CANCELLED = "The authentication was cancelled";

export const validCredentials = async (
  credential: AuthorizeResult,
  dispatch: AppDispatch,
  toastHandler: ToastContextValue
) => {
  let success = false;
  try {
    await dispatch(validateCredential({ credential })).then(unwrapResult);
    success = true;
  } catch (e) {
    const git_error = e as HttpGitlabError;
    if (git_error.status && git_error.message) {
      if (git_error.status == API_HTTP_STATUS.FORBIDDEN) {
        toastHandler.updateMessage({
          status: git_error.status,
          message: AUTHENTICATION_VERIFICATION_FORBIDDEN,
        });
      } else {
        toastHandler.updateStatus(git_error.status);
      }
    } else {
      toastHandler.updateStatus(API_HTTP_STATUS.UNKNOWN);
    }
  }
  if (!success) {
    try {
      await dispatch(revokeCredential());
    } catch (e) {
      toastHandler.updateMessage({
        status: TOAST_TYPES.ERROR,
        message: "Close and open the app",
      });
    }
  }
};
