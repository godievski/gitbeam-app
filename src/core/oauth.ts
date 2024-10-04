import {
  API_URL,
  API_AUTHORIZATION_ENDPOINT,
  API_TOKEN_ENDPOINT,
  API_SCOPES,
  GITLAB_CLIENT_ID,
  GITLAB_CLIENT_SECRET,
  GITLAB_REDIRECT_URL,
} from "./gitlab/api";
import {
  authorize,
  AuthConfiguration,
  AuthorizeResult,
} from "react-native-app-auth";
import axios from "axios";
import { error_interceptor } from "./gitlab/utils";

export const api = axios.create({
  baseURL: API_URL,
});
api.interceptors.response.use((res) => res, error_interceptor);

const config: AuthConfiguration = {
  // warmAndPrefetchChrome: true,
  serviceConfiguration: {
    authorizationEndpoint: API_AUTHORIZATION_ENDPOINT,
    tokenEndpoint: API_TOKEN_ENDPOINT,
    // revocationEndpoint: 'https://gitlab.com/oauth/revoke'
  },
  clientId: GITLAB_CLIENT_ID,
  clientSecret: GITLAB_CLIENT_SECRET,
  redirectUrl: GITLAB_REDIRECT_URL,
  scopes: API_SCOPES,
  useNonce: false,
  usePKCE: false,
};

export const authorizeGitlab = () => {
  return authorize(config);
};

export const setAPIAccessToken = (credentials: AuthorizeResult) => {
  api.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${credentials.accessToken}`;
};

export const removeAPIAccessToken = () => {
  api.defaults.headers.common["Authorization"] = undefined;
};
