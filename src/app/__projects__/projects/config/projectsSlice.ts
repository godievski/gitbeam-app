import { PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_STATE } from "./constants";
import {
  TProject,
  TProjectSimple,
} from "../../../../core/gitlab/types/projects_types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import projects_api from "../../../../core/gitlab/api/projects_api";
import { APINewProjectParams } from "../../../../core/gitlab/api/projects_api";
import _ from "lodash";
import { TProjectSimpleKeys } from "../../../../core/gitlab/types/projects_types";
import { createSliceWithReset, ThunkApi } from "../../../../store/utils";

type FetchReturned = {
  next_page: string;
  entities: TProjectSimple[];
} | null;
export const fetchProjects = createAsyncThunk<FetchReturned, void, ThunkApi>(
  "projects/fetch",
  async (_data, thunkAPI) => {
    const { loading } = thunkAPI.getState().projects;

    if (loading !== "pending") {
      return null;
    }

    const { next_page, data } = (await projects_api.listProjects()).data;

    return {
      next_page,
      entities: data,
    };
  }
);

export const fetchMoreProjects = createAsyncThunk<
  FetchReturned,
  void,
  ThunkApi
>("projects/fetchMore", async (_data, thunkAPI) => {
  const {
    loading_more,
    next_page: page_to_fetch,
  } = thunkAPI.getState().projects;

  if (loading_more !== "pending") {
    return null;
  }

  const { next_page, data } = (
    await projects_api.listProjects({ page: page_to_fetch })
  ).data;

  return {
    next_page,
    entities: data,
  };
});

type PostReturned = (Partial<TProject> & TProjectSimple) | null;
export const createNewProject = createAsyncThunk<
  PostReturned,
  APINewProjectParams,
  ThunkApi
>("projects/createNewProject", async (data, thunkAPI) => {
  const { creating } = thunkAPI.getState().projects;
  if (creating != "pending") {
    return null;
  }
  const res = await projects_api.createNewProject(data);
  return res.data;
});

const projectsSlice = createSliceWithReset({
  name: "projects",
  initialState: DEFAULT_STATE,
  reducers: {
    updateProject: (state, action: PayloadAction<Partial<TProject>>) => {
      if (state.entities !== undefined) {
        state.entities = state.entities.map((project) => {
          if (project.id === action.payload.id) {
            return _.merge(project, _.pick(action.payload, TProjectSimpleKeys));
          } else {
            return project;
          }
        });
      }
    },
  },
  extraReducers: (builder) => {
    //fetch
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      if (!action.payload) {
        state.loading = "idle";
      }
      if (action.payload && state.loading == "pending") {
        state.loading = "idle";
        state.entities = action.payload.entities;
        state.next_page = action.payload.next_page;
      }
    });
    builder.addCase(fetchProjects.pending, (state, action) => {
      if (state.loading === "idle") {
        state.loading = "pending";
      }
    });
    builder.addCase(fetchProjects.rejected, (state, action) => {
      state.loading = "idle";
      state.entities = [];
    });
    //fetch more
    builder.addCase(fetchMoreProjects.fulfilled, (state, action) => {
      if (!action.payload) {
        state.loading_more = "idle";
      }
      if (
        state.loading_more == "pending" &&
        state.entities != null &&
        action.payload
      ) {
        state.loading_more = "idle";
        state.entities = [...state.entities, ...action.payload.entities];
        state.next_page = action.payload.next_page;
      }
    });
    builder.addCase(fetchMoreProjects.pending, (state, action) => {
      const next_page = Number.parseInt(state.next_page);
      if (
        state.loading == "idle" &&
        state.loading_more == "idle" &&
        !isNaN(next_page)
      ) {
        state.loading_more = "pending";
      }
    });
    builder.addCase(fetchMoreProjects.rejected, (state, action) => {
      state.loading_more = "idle";
    });
    //add project
    builder.addCase(createNewProject.fulfilled, (state, action) => {
      if (action.payload === null) {
        state.creating = "idle";
      } else {
        if (state.creating == "pending" && state.entities !== undefined) {
          state.creating = "idle";
          state.entities = [action.payload, ...state.entities];
        }
      }
    });

    builder.addCase(createNewProject.pending, (state, action) => {
      if (state.creating == "idle") {
        state.creating = "pending";
      }
    });
    builder.addCase(createNewProject.rejected, (state, action) => {
      state.creating = "idle";
    });
  },
});

export const { updateProject } = projectsSlice.actions;

export const projectsReducer = projectsSlice.reducer;
