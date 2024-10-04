import issues_api from "../../../../core/gitlab/api/issues_api";
import {
  NewIssueData,
  QueryIssues,
  TIssue,
  UpdateIssueData,
} from "../../../../core/gitlab/types/issues_types";
import { DEFAULT_STATE, DEFAULT_STATE_ISSUES } from "./constants";
import { createCrudSlice } from "../../../../store/crudSlice";

const issues = createCrudSlice<
  TIssue,
  QueryIssues,
  NewIssueData,
  UpdateIssueData
>({
  name: "issues",
  initialState: DEFAULT_STATE,
  defaultState: DEFAULT_STATE_ISSUES,
  reducers: {},
  get_identifier: (e) => e.iid,
  api: issues_api,
});

const issuesSlice = issues.slice;

export const fetchIssues = issues.thunks.fetch;

export const fetchMoreIssues = issues.thunks.fetchMore;

export const addIssue = issues.thunks.add;

export const updateIssue = issues.thunks.update;

export const deleteIssue = issues.thunks.delete;

export const getIssuesProject = issues.getStateProject;

export const selectIssuesByProject = issues.selectByProject;

export const { updateQuery: updateIssuesQuery } = issuesSlice.actions;

export const issuesReducer = issuesSlice.reducer;
