import { TProject } from "../../../../core/gitlab/types/projects_types";

export interface ProjectState {
  loading: boolean;
  basic: {
    id: number;
    name: string;
  };
  data?: TProject;
  branches_count: number;
  creating_file: boolean;
}
