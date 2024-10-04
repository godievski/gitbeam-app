import { CommitsProjectState, CommitsState } from "./types";

export const DEFAULT_COMMITS_BY_PROJECT: CommitsProjectState = {
  loading: "idle",
  loading_more: "idle",
  error: null,
  entities: null,
  next_page: "",
};

export const DEFAULT_STATE: CommitsState = {};
