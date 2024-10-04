import { CommonActions } from "@react-navigation/native";
import { SOURCE_CODE_SCREEN_NAME } from "../../source-code/config/navigation";
import { COMMITS_SCREEN_NAME } from "../../commits/config/navigation";
import { CHANGES_SCREEN_NAME } from "../../changes/config/navigation";
import {
  FILTERS_MERGE_REQUESTS_SCREEN_NAME,
  NEW_MERGE_REQUEST_SCREEN_NAME,
} from "../../project-merge-requests/config/navigation";

export const BRANCHES_SCREEN_NAME = "BRANCHES_SCREEN_NAME";
export const BRANCHES_SELECTION_SCREEN_NAME = "BRANCHES_SELECTION_SCREEN_NAME";
export const NEW_BRANCH_SCREEN_NAME = "NEW_BRANCH_SCREEN_NAME";

export type BranchesScreenParams = {
  [BRANCHES_SCREEN_NAME]: {
    project_id: number;
    title: string;
    from_branch?: string;
    path?: string;
  };
};

export type BranchesSelectionScreenParams = {
  [BRANCHES_SELECTION_SCREEN_NAME]: {
    project_id: number;
    title: string;
    from_branch?: string;
    path?: string;
    from_screen: string;
    selectBranch: any;
  };
};

export type NewBranchScreenParams = {
  [NEW_BRANCH_SCREEN_NAME]: {
    ref?: string;
  };
};

export const goToBranches = (project_id: number, title: string) =>
  CommonActions.navigate({
    name: BRANCHES_SCREEN_NAME,
    params: {
      project_id,
      title,
    },
    key: `${project_id}::branches`,
  });

export const goToBranchesFromSourceCode = (
  project_id: number,
  from_branch: string,
  path: string,
  project_name: string
) =>
  CommonActions.navigate({
    name: BRANCHES_SELECTION_SCREEN_NAME,
    params: {
      project_id,
      path,
      from_branch,
      title: project_name,
      from_screen: SOURCE_CODE_SCREEN_NAME,
    },
    key: `${project_id}::branches::selection::source-code`,
  });

export const goToBranchesFromCommits = (
  project_id: number,
  from_branch: string,
  project_name: string
) =>
  CommonActions.navigate({
    name: BRANCHES_SELECTION_SCREEN_NAME,
    params: {
      project_id,
      from_branch,
      title: project_name,
      from_screen: COMMITS_SCREEN_NAME,
    },
    key: `${project_id}::branches::selection::commits`,
  });

export const goToBranchesFromChanges = (
  project_id: number,
  from_branch: string,
  project_name: string
) =>
  CommonActions.navigate({
    name: BRANCHES_SELECTION_SCREEN_NAME,
    params: {
      project_id,
      from_branch,
      title: project_name,
      from_screen: CHANGES_SCREEN_NAME,
    },
    key: `${project_id}::branches::selection::changes`,
  });

export const goToBranchesFromNewBranch = (
  project_id: number,
  from_branch: string,
  title: string,
  selectBranch
) =>
  CommonActions.navigate({
    name: BRANCHES_SELECTION_SCREEN_NAME,
    params: {
      project_id,
      from_branch,
      title,
      selectBranch,
      from_screen: NEW_BRANCH_SCREEN_NAME,
    },
    key: `${project_id}::branches::selection::new-branch`,
  });

export const goToBranchesFromFilterMergeRequest = (
  project_id: number,
  from_branch: string,
  title: string,
  selectBranch
) =>
  CommonActions.navigate({
    name: BRANCHES_SELECTION_SCREEN_NAME,
    params: {
      project_id,
      from_branch,
      title,
      selectBranch,
      from_screen: FILTERS_MERGE_REQUESTS_SCREEN_NAME,
    },
    key: `${project_id}::branches::selection::filter-merge-request`,
  });

export const goToBranchesFromNewMergeRequest = (
  project_id: number,
  from_branch: string,
  title: string,
  selectBranch
) =>
  CommonActions.navigate({
    name: BRANCHES_SELECTION_SCREEN_NAME,
    params: {
      project_id,
      from_branch,
      title,
      selectBranch,
      from_screen: NEW_MERGE_REQUEST_SCREEN_NAME,
    },
    key: `${project_id}::branches::selection::filter-merge-request`,
  });

export const goToNewBranch = (ref?: string) =>
  CommonActions.navigate({
    name: NEW_BRANCH_SCREEN_NAME,
    params: {
      ref,
    },
    key: "new-branch",
  });
