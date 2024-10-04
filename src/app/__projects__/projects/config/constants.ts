import { ProjectsState } from "./types";

export const DEFAULT_STATE: ProjectsState = {
  loading: "idle",
  loading_more: "idle",
  creating: "idle",
  error: null,
  entities: undefined,
  next_page: "",
};
