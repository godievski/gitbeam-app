import { createAsyncThunk } from "@reduxjs/toolkit";
import commits_api from "../../../../core/gitlab/api/commits_api";
import { TCommit } from "../../../../core/gitlab/types/commits_types";
import { createSliceWithReset, ThunkApi } from "../../../../store/utils";
import { CommitsState } from "./types";
import { DEFAULT_STATE, DEFAULT_COMMITS_BY_PROJECT } from "./constants";
import { RootState } from "../../../../store/rootReducer";

type FetchParams = {
  project_id: number;
  branch: string;
};

type FetchReturned = {
  next_page: string;
  entities: TCommit[];
} | null;

export const fetchCommits = createAsyncThunk<
  FetchReturned,
  FetchParams,
  ThunkApi
>("commits/fetch", async (params, thunkAPI) => {
  const { project_id, branch } = params;
  const commits = getCommitsProject(thunkAPI.getState().commits)(project_id);
  const { loading } = commits;
  if (loading === "pending") {
    const { next_page, data } = (
      await commits_api.listCommits(project_id, { ref_name: branch })
    ).data;

    return {
      next_page,
      entities: data,
    };
  }

  return null;
});

export const fetchMoreCommits = createAsyncThunk<
  FetchReturned,
  FetchParams,
  ThunkApi
>("commits/fetchMore", async (params, thunkAPI) => {
  const { project_id, branch } = params;
  const commits = getCommitsProject(thunkAPI.getState().commits)(project_id);
  const { next_page: page_to_fetch, loading_more } = commits;

  if (loading_more === "pending") {
    const { next_page, data } = (
      await commits_api.listCommits(project_id, {
        page: page_to_fetch,
        ref_name: branch,
      })
    ).data;
    return {
      next_page,
      entities: data,
    };
  }
  return null;
});

const commitsSlice = createSliceWithReset({
  name: "commits",
  initialState: DEFAULT_STATE,
  reducers: {},
  extraReducers: (builder) => {
    //fetch init
    builder.addCase(fetchCommits.fulfilled, (state, action) => {
      const { project_id } = action.meta.arg;
      const commits = getCommitsProject(state)(project_id);
      if (!action.payload) {
        commits.loading = "idle";
      }
      if (action.payload && commits.loading == "pending") {
        commits.loading = "idle";
        commits.entities = action.payload.entities;
        commits.next_page = action.payload.next_page;
      }
      state[project_id] = commits;
    });
    builder.addCase(fetchCommits.pending, (state, action) => {
      const { project_id } = action.meta.arg;
      const commits = getCommitsProject(state)(project_id);
      if (commits.loading === "idle") {
        commits.loading = "pending";
      }
      state[project_id] = commits;
    });
    builder.addCase(fetchCommits.rejected, (state, action) => {
      const { project_id } = action.meta.arg;
      const commits = getCommitsProject(state)(project_id);
      commits.loading = "idle";
      commits.entities = [];
      state[project_id] = commits;
    });

    //fetch more pages
    builder.addCase(fetchMoreCommits.fulfilled, (state, action) => {
      const { project_id } = action.meta.arg;
      const commits = getCommitsProject(state)(project_id);
      if (!action.payload) {
        commits.loading = "idle";
      }
      if (
        commits.loading_more == "pending" &&
        commits.entities != null &&
        action.payload
      ) {
        commits.loading_more = "idle";
        // commits.entities = [...commits.entities, ...action.payload.entities];
        commits.entities = commits.entities.concat(action.payload.entities);
        commits.next_page = action.payload.next_page;
      }

      state[project_id] = commits;
    });
    builder.addCase(fetchMoreCommits.pending, (state, action) => {
      const { project_id } = action.meta.arg;
      const commits = getCommitsProject(state)(project_id);
      const next_page = Number.parseInt(commits.next_page);
      if (
        commits.loading === "idle" &&
        commits.loading_more === "idle" &&
        !isNaN(next_page)
      ) {
        commits.loading_more = "pending";
      }
      state[project_id] = commits;
    });
    builder.addCase(fetchMoreCommits.rejected, (state, action) => {
      const { project_id } = action.meta.arg;
      const commits = getCommitsProject(state)(project_id);
      commits.loading_more = "idle";
      state[project_id] = commits;
    });
  },
});

export const commitsReducer = commitsSlice.reducer;

export const getCommitsProject = (state: CommitsState) => (
  project_id: number
) => state[project_id] ?? DEFAULT_COMMITS_BY_PROJECT;

export const selectCommitsByProject = (state: RootState) => (
  project_id: number
) => {
  return getCommitsProject(state.commits)(project_id);
};
