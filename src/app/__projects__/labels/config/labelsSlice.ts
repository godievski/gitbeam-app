import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import project_labels_api from "../../../../core/gitlab/api/project_labels_api";
import {
  NewLabelData,
  QueryLabels,
  TLabel,
  UpdateLabelData,
} from "../../../../core/gitlab/types/labels_types";
import { CRUDState } from "../../../../core/utils";
import { createCrudSlice, UpdateOneParams } from "../../../../store/crudSlice";
import { ThunkApi } from "../../../../store/utils";
import { DEFAULT_ITEM_STATE, DEFAULT_STATE } from "./contants";

export const subscribeProjectLabel: AsyncThunk<
  TLabel | null,
  UpdateOneParams,
  ThunkApi
> = createAsyncThunk("project_labels/subscribe", async (arg, thunkAPI) => {
  const { project_id, identifier } = arg;
  const item = thunkAPI.getState().project_labels[project_id];

  if (item.state === CRUDState.updating) {
    try {
      const res = await project_labels_api.subscribe(project_id, identifier);
      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }

  return null;
});
export const unsubscribeProjectLabel: AsyncThunk<
  TLabel | null,
  UpdateOneParams,
  ThunkApi
> = createAsyncThunk("project_labels/unsubscribe", async (arg, thunkAPI) => {
  const { project_id, identifier } = arg;
  const item = thunkAPI.getState().project_labels[project_id];

  if (item.state === CRUDState.updating) {
    try {
      const res = await project_labels_api.unsubscribe(project_id, identifier);
      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }

  return null;
});

const project_labels = createCrudSlice<
  TLabel,
  QueryLabels,
  NewLabelData,
  UpdateLabelData
>({
  name: "project_labels",
  initialState: DEFAULT_STATE,
  defaultState: DEFAULT_ITEM_STATE,
  api: project_labels_api,
  reducers: {},
  get_identifier: (e) => e.id,
  genericThunks: {
    updateOne: [subscribeProjectLabel, unsubscribeProjectLabel],
  },
});

const projectLabelsSlice = project_labels.slice;

export const {
  fetch: fetchProjectLabels,
  fetchMore: fetchMoreProjectLabels,
  add: addProjectLabel,
  update: updateProjectLabel,
  delete: deleteProjectLabel,
} = project_labels.thunks;

export const getItemProjectLabel = project_labels.getStateProject;
export const selectLabelsByProject = project_labels.selectByProject;

export const projectLabelsReducer = projectLabelsSlice.reducer;
export const {
  updateQuery: updateQueryProjectLabel,
} = projectLabelsSlice.actions;
