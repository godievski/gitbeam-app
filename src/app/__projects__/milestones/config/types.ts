import {
  QueryMilestones,
  TMilestone,
} from "../../../../core/gitlab/types/milestones_types";
import { GenericState } from "../../../../store/types";

export type ItemProjectMilestonesState = GenericState<
  TMilestone,
  QueryMilestones
>;

export type ProjectMilestonesState = Record<number, ItemProjectMilestonesState>;
