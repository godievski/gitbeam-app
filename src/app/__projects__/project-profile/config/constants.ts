import { ProjectState } from "./types";

export const DEFAULT_STATE: ProjectState = {
  loading: false,
  basic: {
    id: 0,
    name: "",
  },
  data: undefined,
  branches_count: 0,
  creating_file: false,
};
