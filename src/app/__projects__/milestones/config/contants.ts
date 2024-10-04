import { QueryMilestones } from "../../../../core/gitlab/types/milestones_types";
import { CRUDState } from "../../../../core/utils";
import { ItemProjectMilestonesState, ProjectMilestonesState } from "./types";

export const DEFAULT_QUERY: QueryMilestones = {};

export const DEFAULT_ITEM_STATE: ItemProjectMilestonesState = {
  entities: undefined,
  state: CRUDState.idle,
  next_page: "",
  query: DEFAULT_QUERY,
};

export const DEFAULT_STATE: ProjectMilestonesState = {};
