import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import branches_api from "../../../../core/gitlab/api/branches_api";
import projects_api from "../../../../core/gitlab/api/projects_api";
import repository_files_api from "../../../../core/gitlab/api/repository_files_api";
import {
  TProject,
  TProjectSimple,
} from "../../../../core/gitlab/types/projects_types";
import { NewFileData } from "../../../../core/gitlab/types/repository_files_types";
import { createSliceWithReset, ThunkApi } from "../../../../store/utils";
import { DEFAULT_STATE } from "./constants";

type FetchProjectArg = {
  project_id: number;
};
type FetchProjectReturn = {
  data: TProject;
  branches_count: number;
} | null;
export const fetchProject = createAsyncThunk<
  FetchProjectReturn,
  FetchProjectArg,
  ThunkApi
>("current_project/fetch", async (arg, thunkAPI) => {
  const state = thunkAPI.getState().current_project;
  if (state.loading) {
    try {
      const res_project = await projects_api.findProject(arg.project_id, {
        statistics: true,
      });
      const res_branch = await branches_api.list(arg.project_id, {});

      return {
        data: res_project.data,
        branches_count: res_branch.headers["x-total"] || 0,
      };
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }

  return null;
});

type CreateFileArg = {
  project_id: number;
  file_name: string;
  content: string;
  commit_message: string;
  branch?: string;
};
export const createFile = createAsyncThunk<any, CreateFileArg, ThunkApi>(
  "current_project/create_file",
  async (arg, thunkAPI) => {
    const data: NewFileData = {
      file_path: encodeURIComponent(arg.file_name),
      content: arg.content,
      commit_message: arg.commit_message,
      branch: arg.branch ?? "main",
    };

    const state = thunkAPI.getState().current_project;
    const { project_id } = arg;

    if (state.creating_file) {
      try {
        const res = await repository_files_api.createFile(
          arg.project_id,
          data.file_path,
          data
        );
        await thunkAPI.dispatch(fetchProject({ project_id }));
        return res.data;
      } catch (e) {
        return thunkAPI.rejectWithValue(e);
      }
    }

    return null;
  }
);

const slice = createSliceWithReset({
  name: "current_project",
  initialState: DEFAULT_STATE,
  reducers: {
    select: (state, action: PayloadAction<TProjectSimple>) => {
      return {
        ...state,
        data: state.data?.id === action.payload.id ? state.data : undefined,
        basic: {
          id: action.payload.id,
          name: action.payload.name,
        },
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProject.pending, (state, _) => {
      if (!state.loading) {
        return {
          ...state,
          loading: true,
        };
      } else {
        return state;
      }
    });
    builder.addCase(fetchProject.fulfilled, (state, action) => {
      if (action.payload === null) {
        return {
          ...state,
          loading: false,
        };
      } else {
        if (state.loading && state.basic.id === action.payload.data.id) {
          return {
            ...state,
            data: action.payload.data,
            basic: {
              id: state.basic.id,
              name: action.payload.data.name,
            },
            branches_count: action.payload.branches_count,
            loading: false,
          };
        }
      }
      return state;
    });
    builder.addCase(fetchProject.rejected, (state, _) => {
      return {
        ...state,
        loading: false,
      };
    });

    // creating file
    builder.addCase(createFile.pending, (state, _) => {
      if (!state.creating_file) {
        return {
          ...state,
          creating_file: true,
        };
      } else {
        return state;
      }
    });
    builder.addCase(createFile.fulfilled, (state, _) => {
      return {
        ...state,
        creating_file: false,
      };
    });
    builder.addCase(createFile.rejected, (state, _) => {
      return {
        ...state,
        creating_file: false,
      };
    });
  },
});

export const currentProjectReducer = slice.reducer;

export const { select: selectProject } = slice.actions;
