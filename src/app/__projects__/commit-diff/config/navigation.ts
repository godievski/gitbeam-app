import { CommonActions } from "@react-navigation/native";
import { TCommit } from "../../../../core/gitlab/types/commits_types";

export const COMMIT_DIFF_SCREEN_NAME = "COMMIT_DIFF_SCREEN_NAME";

export type CommitDiffParams = {
  project_id: number;
  project_name: string;
  commit: TCommit;
};

export type CommitDiffScreenParams = {
  [COMMIT_DIFF_SCREEN_NAME]: CommitDiffParams;
};

export const goToCommitDiff = (params: CommitDiffParams) =>
  CommonActions.navigate({
    name: COMMIT_DIFF_SCREEN_NAME,
    params,
    key: `commits-diff::${params.project_id}::${params.commit.id}`,
  });
