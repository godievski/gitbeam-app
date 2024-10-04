import branches_api from "../../../../core/gitlab/api/branches_api";
import {
  NewBranchData,
  QueryBranches,
  TBranch,
} from "../../../../core/gitlab/types/branches_types";
import { createCrudSlice } from "../../../../store/crudSlice";
import { DEFAULT_STATE, DEFAULT_STATE_BRANCHES } from "./constants";

const branches = createCrudSlice<TBranch, QueryBranches, NewBranchData, {}>({
  name: "branches",
  initialState: DEFAULT_STATE,
  defaultState: DEFAULT_STATE_BRANCHES,
  reducers: {},
  get_identifier: (e) => e.name,
  api: branches_api,
});

const branchesSlice = branches.slice;

export const fetchBranches = branches.thunks.fetch;
export const fetchMoreBranches = branches.thunks.fetchMore;
export const addBranch = branches.thunks.add;
export const deleteBranch = branches.thunks.delete;

export const geBranchesProject = branches.getStateProject;
export const selectBranchesByProject = branches.selectByProject;
//not used yet
export const { updateQuery: updateBranchesQuery } = branchesSlice.actions;

export const branchesReducer = branchesSlice.reducer;
