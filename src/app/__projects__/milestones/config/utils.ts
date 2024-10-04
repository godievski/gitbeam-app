import { TMilestone } from "../../../../core/gitlab/types/milestones_types";

export const separateMilestones = (milestones: TMilestone[]) => {
  let active: TMilestone[] = [];
  let closed: TMilestone[] = [];

  for (let i = 0; i < milestones.length; i++) {
    if (milestones[i].state == "active") {
      active.push(milestones[i]);
    } else {
      closed.push(milestones[i]);
    }
  }

  return {
    active,
    closed,
  };
};
