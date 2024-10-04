import { QueryBranches } from "../../../../core/gitlab/types/branches_types";
import { CRUDState } from "../../../../core/utils";
import { BranchesProjectState, BranchesState } from "./types";

export const DEFAULT_QUERY_BRANCH_REQUEST: QueryBranches = {
  search: undefined,
};

export const DEFAULT_STATE_BRANCHES: BranchesProjectState = {
  state: CRUDState.idle,
  entities: undefined,
  next_page: "",
  query: DEFAULT_QUERY_BRANCH_REQUEST,
};

export const DEFAULT_STATE: BranchesState = {};
