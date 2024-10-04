import { TProjectSimple } from "../../../../core/gitlab/types/projects_types";
export type ProjectsState = {
  entities: TProjectSimple[] | undefined;
  next_page: string;
  error: string | null;
  loading: "idle" | "pending";
  loading_more: "idle" | "pending";
  creating: "idle" | "pending";
};
