import { CommonActions } from "@react-navigation/native";

export const COMMITS_SCREEN_NAME = "COMMITS_SCREEN_NAME";

export type CommitsScreenParams = {
  [COMMITS_SCREEN_NAME]: {
    project_id: number;
    branch: string;
    project_name: string;
  };
};

export const goToCommits = (
  project_id: number,
  branch: string,
  project_name: string
) =>
  CommonActions.navigate({
    name: COMMITS_SCREEN_NAME,
    params: {
      project_id,
      branch,
      project_name,
    },
    key: `commits::${project_id}::${branch}`,
  });
