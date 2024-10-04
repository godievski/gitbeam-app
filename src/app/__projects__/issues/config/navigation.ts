import { CommonActions } from "@react-navigation/native";

export const ISSUES_SCREEN_NAME = "ISSUES_SCREEN_NAME";

export type IssuesScreenParams = {
  [ISSUES_SCREEN_NAME]: {
    project_id: number;
    project_name: string;
  };
};

export const goToIssues = (project_id: number, project_name: string) =>
  CommonActions.navigate({
    name: ISSUES_SCREEN_NAME,
    params: {
      project_id,
      project_name,
    },
  });

export const NEW_ISSUE_SCREEN_NAME = "NEW_ISSUE_SCREEN_NAME";

export type NewIssueScreenParams = {
  [NEW_ISSUE_SCREEN_NAME]: {
    project_id: number;
    project_name: string;
  };
};

export const goToNewIssue = (project_id: number, project_name: string) =>
  CommonActions.navigate({
    name: NEW_ISSUE_SCREEN_NAME,
    params: {
      project_id,
      project_name,
    },
    key: "new-issue-creation",
  });

export const FILTERS_ISSUES_SCREEN_NAME = "FILTERS_ISSUES_SCREEN_NAME";

export type FiltersIssuesScreenParams = {
  [FILTERS_ISSUES_SCREEN_NAME]: {
    project_id: number;
  };
};

export const goToFiltersIssues = (project_id: number) =>
  CommonActions.navigate({
    name: FILTERS_ISSUES_SCREEN_NAME,
    params: {
      project_id,
    },
  });
