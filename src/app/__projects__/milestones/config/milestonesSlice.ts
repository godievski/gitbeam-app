import project_milestones_api from "../../../../core/gitlab/api/project_milestones_api";
import {
  AddMilestoneData,
  QueryMilestones,
  TMilestone,
  UpdateMilestoneData,
} from "../../../../core/gitlab/types/milestones_types";
import { createCrudSlice } from "../../../../store/crudSlice";
import { DEFAULT_ITEM_STATE, DEFAULT_STATE } from "./contants";

const project_milestones = createCrudSlice<
  TMilestone,
  QueryMilestones,
  AddMilestoneData,
  UpdateMilestoneData
>({
  name: "project_milestones",
  initialState: DEFAULT_STATE,
  defaultState: DEFAULT_ITEM_STATE,
  api: project_milestones_api,
  reducers: {},
  get_identifier: (e) => e.id,
});

const projectMilestonesSlice = project_milestones.slice;

export const {
  fetch: fetchProjectMilestones,
  fetchMore: fetchMoreProjectMilestones,
  add: addProjectMilestone,
  update: updateProjectMilestone,
  delete: deleteProjectMilestone,
} = project_milestones.thunks;

export const selectMilestoneByProject = project_milestones.selectByProject;

export const projectMilestonesReducer = projectMilestonesSlice.reducer;
