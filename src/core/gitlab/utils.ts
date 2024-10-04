import { RequestOrderBy, RequestSort, RequestScope } from "./types";
import { API_HTTP_STATUS } from "./api";
import { AxiosResponse } from "axios";

const readables = {
  [RequestOrderBy.CREATED_AT]: "Creation date",
  [RequestOrderBy.UPDATED_AT]: "Last update",
  [RequestSort.ASC]: "Ascending",
  [RequestSort.DESC]: "Descending",
  [RequestScope.CREATED_BY_ME]: "Created by me",
  [RequestScope.ASSIGNED_TO_ME]: "Assigned to me",
  [RequestScope.ALL]: "All",
};

export function getReadableRequest(val?: string) {
  return readables[val ?? ""] ?? "any";
}

export function getNextPage (response: AxiosResponse) : string {
  return response.headers['x-next-page'] ?? "";
}

export type HttpGitlabError = {
  status: number;
  message: string;
};

export const error_interceptor = (err): Promise<HttpGitlabError> => {
  let message = (err.message || "") as string;
  let status = API_HTTP_STATUS.BAD_REQUEST;
  if (message.includes(API_HTTP_STATUS.BAD_REQUEST.toString())) {
    status = API_HTTP_STATUS.BAD_REQUEST;
  } else if (message.includes(API_HTTP_STATUS.UNAUTHORIZED.toString())) {
    status = API_HTTP_STATUS.UNAUTHORIZED;
  } else if (message.includes(API_HTTP_STATUS.FORBIDDEN.toString())) {
    status = API_HTTP_STATUS.FORBIDDEN;
  } else if (message.includes(API_HTTP_STATUS.NOT_FOUND.toString())) {
    status = API_HTTP_STATUS.NOT_FOUND;
  } else if (message.includes(API_HTTP_STATUS.METHOD_NOT_ALLOWED.toString())) {
    status = API_HTTP_STATUS.METHOD_NOT_ALLOWED;
  } else if (message.includes(API_HTTP_STATUS.CONFLICT.toString())) {
    status = API_HTTP_STATUS.CONFLICT;
  } else if (message.includes(API_HTTP_STATUS.DENIED.toString())) {
    status = API_HTTP_STATUS.DENIED;
  } else if (message.includes(API_HTTP_STATUS.UNPROCESSABLE.toString())) {
    status = API_HTTP_STATUS.UNPROCESSABLE;
  } else if (message.includes(API_HTTP_STATUS.SERVER_ERROR.toString())) {
    status = API_HTTP_STATUS.SERVER_ERROR;
  } else {
    status = API_HTTP_STATUS.SERVER_ERROR;
    message = (err.toString && err.toString()) || "";
  }

  const error_formatted: HttpGitlabError = {
    status,
    message,
  };
  return Promise.reject(error_formatted);
};


export const getNumberFromDiff = (line: string) => {
  let matches = line
    .match(/\d+/g)
    ?.map((match) => Number.parseInt(match)) ?? [0, 0, 0, 0];

  if (matches.length === 3) {
    //do magic
    const index_diff_start = line.indexOf("-") + 1;
    const index_diff_end = line.indexOf(" ", index_diff_start);
    const index_plus_start = line.indexOf("+", index_diff_end + 1);
    const index_plus_end = line.indexOf(" ", index_plus_start);

    //get pair diff
    let diff = line.slice(index_diff_start, index_diff_end).trim().split(",").map(n => Number.parseInt(n));
    if (diff.length == 1) {
      if (diff[0] === 1) {
        diff = [1, 1];
      } else {
        diff = [0, 0];
      }
    }

    let plus = line.slice(index_plus_start, index_plus_end).trim().split(",").map(n => Number.parseFloat(n));
    if (diff.length == 1) {
      if (plus[0] === 1) {
        plus = [1, 1];
      } else {
        plus = [0, 0];
      }
    }
    matches = [...diff, ...plus];

  } else if (matches.length === 2) {
    matches = [matches[0], 1, matches[1], 1];
  } else if (matches.length > 4) {
    matches = matches.slice(0, 4);
  } else if (matches.length !== 4) {
    matches = [0, 0, 0, 0];
  }

  return matches;
}