import { createAsyncThunk } from "@reduxjs/toolkit";
import project_members_api from "../../../../core/gitlab/api/project_members_api";
import {
  AddMemberData,
  QueryMembers,
  TMember,
  UpdateMemberData,
} from "../../../../core/gitlab/types/members_types";
import { HttpGitlabError } from "../../../../core/gitlab/utils";
import { CRUDState } from "../../../../core/utils";
import { createCrudSlice } from "../../../../store/crudSlice";
import { ThunkApi } from "../../../../store/utils";
import { DEFAULT_STATE, DEFAULT_STATE_PROJECT_MEMBERS } from "./constants";
import _find from "lodash/find";

type AddMultipleProjectMemmbersArg = {
  project_id: number;
  members: AddMemberData[];
};
type AddMultipleProjectMembersReturn = {
  added: TMember[];
  updated: TMember[];
};
export const addMultipleProjectMembers = createAsyncThunk<
  AddMultipleProjectMembersReturn | null,
  AddMultipleProjectMemmbersArg,
  ThunkApi
>("project_members/addMultiple", async (arg, thunkAPI) => {
  const { project_id, members } = arg;
  const item = thunkAPI.getState().project_members[project_id];

  const response_members: AddMultipleProjectMembersReturn = {
    added: [],
    updated: [],
  };

  if (item.state === CRUDState.creating) {
    try {
      for (let i = 0; i < members.length; i++) {
        try {
          const res_new = await project_members_api.add(project_id, members[i]);
          response_members.added.push(res_new.data);
        } catch (e) {
          if ((e as HttpGitlabError).status === 409) {
            const res_update = await project_members_api.update(
              project_id,
              members[i].user_id,
              members[i] as UpdateMemberData
            );
            response_members.updated.push(res_update.data);
          } else {
            throw e;
          }
        }
      }
      return response_members;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }

  return null;
});

const project_members = createCrudSlice<
  TMember,
  QueryMembers,
  AddMemberData,
  UpdateMemberData
>({
  name: "project_members",
  initialState: DEFAULT_STATE,
  defaultState: DEFAULT_STATE_PROJECT_MEMBERS,
  get_identifier: (e) => e.id,
  api: project_members_api,
  reducers: {},
  extraReducers: (builder, default_rejected, getStateByProject) => {
    builder.addCase(addMultipleProjectMembers.fulfilled, (state, action) => {
      const { project_id } = action.meta.arg;
      const item = getStateByProject(state)(project_id);
      if (action.payload === null) {
        return {
          ...state,
          [project_id]: {
            ...item,
            state: CRUDState.idle,
          },
        };
      } else {
        if (item.state === CRUDState.creating && item.entities !== undefined) {
          const payload = action.payload;
          return {
            ...state,
            [project_id]: {
              ...item,
              state: CRUDState.idle,
              entities: [
                ...payload.added,
                ...item.entities.map((entity) => {
                  const updated_entity = _find(
                    payload.updated,
                    (entity_2) => entity_2.id == entity.id
                  );

                  return { ...entity, ...(updated_entity || {}) };
                }),
              ],
            },
          };
        }
      }
      return state;
    });

    builder.addCase(addMultipleProjectMembers.pending, (state, action) => {
      const { project_id } = action.meta.arg;
      const item = getStateByProject(state)(project_id);
      if (item.state === CRUDState.idle) {
        return {
          ...state,
          [project_id]: {
            ...item,
            state: CRUDState.creating,
          },
        };
      } else {
        return state;
      }
    });
    builder.addCase(addMultipleProjectMembers.rejected, default_rejected);
  },
});

const project_members_slice = project_members.slice;

export const fetchProjectMembers = project_members.thunks.fetch;

export const fetchMoreProjectMembers = project_members.thunks.fetchMore;

export const addProjectMember = project_members.thunks.add;

export const updateProjectMember = project_members.thunks.update;

export const deleteProjectMember = project_members.thunks.delete;

export const getMembersByProject = project_members.getStateProject;

export const selectMembersByProject = project_members.selectByProject;

export const {
  updateQuery: updateProjectMembersQuery,
} = project_members_slice.actions;

export const projectMembersReducer = project_members_slice.reducer;
