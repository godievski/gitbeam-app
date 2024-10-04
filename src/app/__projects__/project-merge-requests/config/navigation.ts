import { CommonActions } from "@react-navigation/native";
import { TMergeRequest } from "../../../../core/gitlab/types/merge_requests_types";

export const PROJECT_MERGE_REQUESTS_SCREEN_NAME =
  "PROJECT_MERGE_REQUESTS_SCREEN_NAME";

export type ProjectMergeRequestParams = {
  [PROJECT_MERGE_REQUESTS_SCREEN_NAME]: {
    project_id: number;
    subtitle: string;
  };
};

export const goToProjectMergeRequests = (
  project_id: number,
  subtitle: string
) =>
  CommonActions.navigate({
    name: PROJECT_MERGE_REQUESTS_SCREEN_NAME,
    params: {
      project_id,
      subtitle,
    },
  });

export const ACCEPT_MERGE_REQUEST_SCREEN_NAME =
  "ACCEPT_MERGE_REQUEST_SCREEN_NAME";

export type AcceptMRScreenParams = {
  [ACCEPT_MERGE_REQUEST_SCREEN_NAME]: {
    mr_item: TMergeRequest;
  };
};

export const goToAcceptMergeRequest = (mr_item: TMergeRequest) =>
  CommonActions.navigate({
    name: ACCEPT_MERGE_REQUEST_SCREEN_NAME,
    params: {
      mr_item,
    },
    key: `accept-merge-request`,
  });

export const FILTERS_MERGE_REQUESTS_SCREEN_NAME =
  "FILTERS_MERGE_REQUESTS_SCREEN_NAME";

export type FiltersMergeRequestScreenParams = {
  [FILTERS_MERGE_REQUESTS_SCREEN_NAME]: {
    project_id: number;
  };
};

export const goToFiltersMergeRequests = (project_id: number) =>
  CommonActions.navigate({
    name: FILTERS_MERGE_REQUESTS_SCREEN_NAME,
    params: {
      project_id,
    },
  });

export const NEW_MERGE_REQUEST_SCREEN_NAME = "NEW_MERGE_REQUEST_SCREEN_NAME";

export type NewMRScreenParams = {
  [NEW_MERGE_REQUEST_SCREEN_NAME]: {
    ref?: string;
  };
};

export const goToNewMergeRequest = (ref?: string) =>
  CommonActions.navigate({
    name: NEW_MERGE_REQUEST_SCREEN_NAME,
    params: {
      ref,
    },
    key: "new-merge-request",
  });
