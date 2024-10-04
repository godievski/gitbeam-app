import Config from "react-native-config";
import { MemberAccess } from "./types";
import { TProject } from "./types/projects_types";
import { TUser } from "./types/users_types";

export const API_HTTP_STATUS = {
  OK: 200,
  NO_CONTENT: 204,
  CREATED: 201,
  NOT_MODIFIED: 304,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  DENIED: 412,
  UNPROCESSABLE: 422,
  SERVER_ERROR: 500,
  UNKNOWN: 666,
};

export const API_HTTP_STATUS_MESSAGE = {
  [API_HTTP_STATUS.OK]: "The request was successful",
  [API_HTTP_STATUS.NO_CONTENT]: "The request was successful",
  [API_HTTP_STATUS.CREATED]: "The request was successful",
  [API_HTTP_STATUS.NOT_MODIFIED]: " The resource has not been modified",
  [API_HTTP_STATUS.BAD_REQUEST]: "Bad request",
  [API_HTTP_STATUS.UNAUTHORIZED]: "The token is not longer valid",
  [API_HTTP_STATUS.FORBIDDEN]: "The request is not allowed",
  [API_HTTP_STATUS.NOT_FOUND]: "The resource could not be accessed",
  [API_HTTP_STATUS.METHOD_NOT_ALLOWED]: "The request is not supported",
  [API_HTTP_STATUS.CONFLICT]: "A conflicting resource already exists",
  [API_HTTP_STATUS.DENIED]: "The request was denied",
  [API_HTTP_STATUS.UNPROCESSABLE]: "The entity could not be processed",
  [API_HTTP_STATUS.SERVER_ERROR]: "Server-side error",
  [API_HTTP_STATUS.UNKNOWN]: "Unkwon error",
};

export const getHttpStatusMessage = (status: number) => {
  return (
    API_HTTP_STATUS_MESSAGE[status] ??
    API_HTTP_STATUS_MESSAGE[API_HTTP_STATUS.UNKNOWN]
  );
};

export type APIQueryParams = {
  per_page?: number | string | undefined;
  page?: number | string | undefined;
};

export type ResponseWithPage<T> = {
  data: T;
  next_page: string;
};

export const API_AUTHORIZATION_ENDPOINT = "https://gitlab.com/oauth/authorize";

export const API_TOKEN_ENDPOINT = "https://gitlab.com/oauth/token";

export const API_SCOPES = ["openid", "api"];

export const API_URL = "https://gitlab.com/api/v4";

export const GITLAB_WEB = "https://gitlab.com";

/**
 * Taken from .env file
 */
export const GITLAB_CLIENT_ID = Config.GITLAB_CLIENT_ID;
export const GITLAB_CLIENT_SECRET = Config.GITLAB_CLIENT_SECRET;
export const GITLAB_REDIRECT_URL = Config.GITLAB_REDIRECT_URL;

export const API_ITEMS_PER_PAGE = 20;

export const getPermissionLevel = (project: TProject, user: Partial<TUser>) => {
  if (project.creator_id == user.id) {
    return MemberAccess.OWNER;
  } else {
    return Math.max(
      project.permissions.project_access?.access_level ?? 0,
      project.permissions.group_access?.access_level ?? 0
    );
  }
};
