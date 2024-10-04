import { TCommit } from "../../../../core/gitlab/types/commits_types";

export type CommitsProjectState = {
  loading: "idle" | "pending",
  loading_more: "idle" | "pending"
  error: null | string,
  entities: null | TCommit[],
  next_page: string,
}

export type CommitsState = Record<string, CommitsProjectState>;