import { IssueState } from "../../../../core/gitlab/types";
import {
  RequestOrderBy,
  RequestSort,
  RequestScope,
} from "../../../../core/gitlab/types";
import { QueryIssues } from "../../../../core/gitlab/types/issues_types";
import { CRUDState } from "../../../../core/utils";
import { IssuesProjectState, IssuesState } from "./types";

export const DEFAULT_QUERY_ISSUE_REQUEST: QueryIssues = {
  state: IssueState.ALL,
  order_by: RequestOrderBy.CREATED_AT,
  sort: RequestSort.DESC,
  milestone: undefined,
  labels: undefined,
  search: undefined,
  scope: RequestScope.ALL,
};

export const DEFAULT_STATE_ISSUES: IssuesProjectState = {
  state: CRUDState.idle,
  entities: [],
  next_page: "",
  query: DEFAULT_QUERY_ISSUE_REQUEST,
};

export const DEFAULT_STATE: IssuesState = {};
