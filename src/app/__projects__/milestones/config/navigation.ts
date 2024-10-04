import { CommonActions } from "@react-navigation/native";
import { TMilestone } from "../../../../core/gitlab/types/milestones_types";
export const EDIT_MILESTONE_SCREEN_NAME = "EDIT_MILESTONE_SCREEN_NAME";

export type EditMilestoneScreenParams = {
  [EDIT_MILESTONE_SCREEN_NAME]: {
    project_id: number;
    milestone: TMilestone;
  };
};

export const goToEditMilestone = (project_id: number, milestone: TMilestone) =>
  CommonActions.navigate({
    name: EDIT_MILESTONE_SCREEN_NAME,
    params: {
      project_id,
      milestone,
    },
  });

export const MILESTONES_SCREEN_NAME = "MILESTONES_SCREEN_NAME";

export type MilestonesScreenParams = {
  [MILESTONES_SCREEN_NAME]: {
    project_id: number;
    subtitle: string;
  };
};

export const goToMilestones = (project_id: number, subtitle: string) =>
  CommonActions.navigate({
    name: MILESTONES_SCREEN_NAME,
    params: {
      project_id,
      subtitle,
    },
  });

export const MILESTONES_SELECTION_SCREEN_NAME =
  "MILESTONES_SELECTION_SCREEN_NAME";

export type MilestonesSelectionScreenParams = {
  [MILESTONES_SELECTION_SCREEN_NAME]: {
    project_id: number;
    subtitle: string;
    milestone_selected_id: number | null;
    select_milestone: any;
  };
};

export const goToMilestonesSelection = (
  project_id: number,
  subtitle: string,
  milestone_selected_id: number | null,
  select_milestone
) =>
  CommonActions.navigate({
    name: MILESTONES_SELECTION_SCREEN_NAME,
    params: {
      project_id,
      subtitle,
      milestone_selected_id,
      select_milestone,
    },
  });

export const NEW_MILESTONE_SCREEN_NAME = "NEW_MILESTONE_SCREEN_NAME";

export type NewMilestoneScreenParams = {
  [NEW_MILESTONE_SCREEN_NAME]: {
    project_id: number;
  };
};

export const goToNewMilestone = (project_id: number) =>
  CommonActions.navigate({
    name: NEW_MILESTONE_SCREEN_NAME,
    params: {
      project_id,
    },
  });
