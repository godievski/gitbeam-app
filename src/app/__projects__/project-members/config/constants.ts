import { QueryMembers } from "../../../../core/gitlab/types/members_types";
import { CRUDState } from "../../../../core/utils";
import { ItemProjectMembersState, ProjectMembersState } from "./types";

export const DEFAULT_QUERY_PROJECT_MEMBERS: QueryMembers = {
  query: undefined,
  user_ids: undefined,
};

export const DEFAULT_STATE_PROJECT_MEMBERS: ItemProjectMembersState = {
  entities: undefined,
  state: CRUDState.idle,
  next_page: "",
  query: DEFAULT_QUERY_PROJECT_MEMBERS,
};

export const DEFAULT_STATE: ProjectMembersState = {};
