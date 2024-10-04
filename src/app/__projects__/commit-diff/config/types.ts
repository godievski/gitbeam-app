import { TCommitDiffParsed } from "../../../../core/gitlab/types/commits_types";

export type CommitDiffItemState = {
  loading: boolean;
  entities?: TCommitDiffParsed[];
};

export type CommitDiffState = Record<string, CommitDiffItemState>;
