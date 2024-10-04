import {
  QueryMembers,
  TMember,
} from "../../../../core/gitlab/types/members_types";
import { GenericState } from "../../../../store/types";

export type ItemProjectMembersState = GenericState<TMember, QueryMembers>;

export type ProjectMembersState = Record<number, ItemProjectMembersState>;
