import { MergeRequestState } from "../../../../core/gitlab/types";
import {
  MergeRequestsByProject as MergeRequestsProject,
  MergeRequestsState,
} from "./types";
import {
  RequestOrderBy,
  RequestSort,
  RequestScope,
} from "../../../../core/gitlab/types";
import { QueryMergeRequest } from "../../../../core/gitlab/types/merge_requests_types";
import { CRUDState } from "../../../../core/utils";

export const DEFUALT_QUERY: QueryMergeRequest = {
  search: undefined,
  state: MergeRequestState.ALL,
  order_by: RequestOrderBy.CREATED_AT,
  sort: RequestSort.DESC,
  scope: RequestScope.ALL,
  source_branch: undefined,
  target_branch: undefined,
  milestone: undefined,
  labels: undefined,
};

export const DEFAULT_STATE_PROJECT_MERGE_REQUEST: MergeRequestsProject = {
  entities: undefined,
  state: CRUDState.idle,
  next_page: "",
  query: DEFUALT_QUERY,
};

export const DEFAULT_STATE: MergeRequestsState = {};
