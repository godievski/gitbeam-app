import { CommonActions } from "@react-navigation/native";

export const CHANGES_SCREEN_NAME = "CHANGES_SCREEN_NAME";

export type ChangesScreenParams = {
  [CHANGES_SCREEN_NAME]: {
    project_id: number;
    branch: string;
    project_name: string;
  };
};

export const goToChanges = (
  project_id: number,
  branch: string,
  project_name: string
) =>
  CommonActions.navigate({
    name: CHANGES_SCREEN_NAME,
    params: {
      project_id,
      branch,
      project_name,
    },
    key: `changes::${project_id}::${branch}`,
  });

export const COMMIT_CHANGES_SCREEN_NAME = "COMMIT_CHANGES_SCREEN_NAME";

export type CommitChangesScreenParams = {
  [COMMIT_CHANGES_SCREEN_NAME]: {
    project_id: number;
    branch: string;
    project_name: string;
  };
};

export const goToCommitChanges = (
  project_id: number,
  branch: string,
  project_name: string
) =>
  CommonActions.navigate({
    name: COMMIT_CHANGES_SCREEN_NAME,
    params: {
      project_id,
      branch,
      project_name,
    },
    key: `commit-changes::${project_id}::${branch}`,
  });