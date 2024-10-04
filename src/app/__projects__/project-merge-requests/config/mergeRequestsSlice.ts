import merge_requests_api from "../../../../core/gitlab/api/merge_requests_api";
import {
  AcceptMRData,
  NewMergeRequestData,
  QueryMergeRequest,
  TMergeRequest,
  UpdateMRData,
} from "../../../../core/gitlab/types/merge_requests_types";
import {
  DEFAULT_STATE,
  DEFAULT_STATE_PROJECT_MERGE_REQUEST,
} from "./constants";
import { createCrudSlice } from "../../../../store/crudSlice";
import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import { ThunkApi } from "../../../../store/utils";
import { CRUDState } from "../../../../core/utils";

// TODO: Refactor accept MR thunk

type AcceptArg = {
  project_id: number;
  entity_iid: number;
  data: AcceptMRData;
};
export const acceptMergeRequest: AsyncThunk<
  TMergeRequest | null,
  AcceptArg,
  ThunkApi
> = createAsyncThunk("merge_requests/accept", async (arg, thunkAPI) => {
  const { project_id, entity_iid, data } = arg;
  const mr = thunkAPI.getState().merge_requests[project_id];
  if (mr.state === CRUDState.updating) {
    try {
      const res = await merge_requests_api.acceptMergeRequest(
        project_id,
        entity_iid,
        data
      );
      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
  return null;
});

const merge_requests = createCrudSlice<
  TMergeRequest,
  QueryMergeRequest,
  NewMergeRequestData,
  UpdateMRData
>({
  name: "merge_requests",
  initialState: DEFAULT_STATE,
  defaultState: DEFAULT_STATE_PROJECT_MERGE_REQUEST,
  reducers: {},
  extraReducers: (builder, default_rejected, getStateProject) => {
    builder.addCase(acceptMergeRequest.fulfilled, (state, action) => {
      const { project_id, entity_iid } = action.meta.arg;
      const item_state = getStateProject(state)(project_id);

      if (action.payload === null) {
        return {
          ...state,
          [project_id]: {
            ...item_state,
            state: CRUDState.idle,
          },
        };
      } else {
        if (
          item_state.state === CRUDState.updating &&
          item_state.entities !== undefined
        ) {
          const payload = action.payload;
          return {
            ...state,
            [project_id]: {
              ...item_state,
              state: CRUDState.idle,
              entities: item_state.entities.map((e) =>
                e.iid === entity_iid ? payload : e
              ),
            },
          };
        }
      }

      return state;
    });
    builder.addCase(acceptMergeRequest.pending, (state, action) => {
      const { project_id } = action.meta.arg;
      const item_state = getStateProject(state)(project_id);
      if (item_state.state === CRUDState.idle) {
        return {
          ...state,
          [project_id]: {
            ...item_state,
            state: CRUDState.updating,
          },
        };
      } else {
        return state;
      }
    });
    builder.addCase(acceptMergeRequest.rejected, default_rejected);
  },
  get_identifier: (entity) => entity.iid,
  api: merge_requests_api,
  // genericThunks: {
  //   updateOne: []
  // }
});

const mergeRequestSlice = merge_requests.slice;

export const fetchMergeRequests = merge_requests.thunks.fetch;
export const fetchMoreMergeRequests = merge_requests.thunks.fetchMore;

export const addMergeRequest = merge_requests.thunks.add;

export const updateMergeRequest = merge_requests.thunks.update;

export const deleteMergeRequest = merge_requests.thunks.delete;

export const getMRProject = merge_requests.getStateProject;

export const selectMergeRequestsByProject = merge_requests.selectByProject;

export const mergeRequestsReducer = mergeRequestSlice.reducer;

export const {
  updateQuery: updateMergeRequestQuery,
} = mergeRequestSlice.actions;
