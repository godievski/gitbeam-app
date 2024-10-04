import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_ITEMS_PER_PAGE } from "../../../../core/gitlab/api";
import repository_api from "../../../../core/gitlab/api/repository_api";
import repository_files_api from "../../../../core/gitlab/api/repository_files_api";
import { NewFileData } from "../../../../core/gitlab/types/repository_files_types";
import { TRepoNode } from "../../../../core/gitlab/types/repository_types";
import { CRUDState } from "../../../../core/utils";
import { RootState } from "../../../../store/rootReducer";
import { createSliceWithReset, ThunkApi } from "../../../../store/utils";
import { DEFAULT_ITEM_STATE, DEFAULT_STATE } from "./constants";
import { SourceCodeState } from "./types";
import { getKeySourceCodeTree } from "./utils";

type FetchSourceCodeArg = {
  project_id: number;
  ref: string;
  path: string;
};
type FetchReturn = {
  next_page: string;
  data: TRepoNode[];
} | null;
export const fetchSourceCode = createAsyncThunk<
  FetchReturn,
  FetchSourceCodeArg,
  ThunkApi
>("source_code/fetch", async (arg, thunkAPI) => {
  const { project_id, ref, path } = arg;

  const key = getKeySourceCodeTree({ project_id, ref, path });
  const item = getSourceCodeTree(thunkAPI.getState().source_code)(key);

  if (item.state === CRUDState.loading) {
    try {
      const res = await repository_api.listTree(project_id, {
        path,
        ref,
        per_page: API_ITEMS_PER_PAGE * 2,
      });
      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }

  return null;
});

export const fetchMoreSourceCode = createAsyncThunk<
  FetchReturn,
  FetchSourceCodeArg,
  ThunkApi
>("source_code/fetchMore", async (arg, thunkAPI) => {
  const { project_id, ref, path } = arg;

  const key = getKeySourceCodeTree({ project_id, ref, path });
  const item = getSourceCodeTree(thunkAPI.getState().source_code)(key);
  const page_to_fetch = item.next_page;
  if (item.state === CRUDState.loading_more) {
    try {
      const res = await repository_api.listTree(project_id, {
        path,
        ref,
        page: page_to_fetch,
        per_page: API_ITEMS_PER_PAGE * 2,
      });
      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }

  return null;
});

type NewDirectoryArg = {
  project_id: number;
  ref: string;
  path: string;
  directory_name: string;
  commit_message: string;
};
export const createNewDirectory = createAsyncThunk<
  any,
  NewDirectoryArg,
  ThunkApi
>("source_code/addDirectory", async (arg, thunkAPI) => {
  const { project_id, ref, path, directory_name, commit_message } = arg;

  let file_path = `${directory_name}/.gitkeep`;
  if (path.length > 0) {
    file_path = `${path}/${file_path}`;
  }
  file_path = encodeURIComponent(file_path);

  const data: NewFileData = {
    file_path,
    commit_message,
    branch: ref,
    content: "",
  };

  const key = getKeySourceCodeTree({ project_id, ref, path });
  const item = getSourceCodeTree(thunkAPI.getState().source_code)(key);
  if (item.state === CRUDState.creating) {
    try {
      const res = await repository_files_api.createFile(
        project_id,
        file_path,
        data
      );
      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }

  return null;
});

const sourceCodeSlice = createSliceWithReset({
  name: "source_code",
  initialState: DEFAULT_STATE,
  reducers: {},
  extraReducers: (builder) => {
    const default_rejected = (state, action) => {
      const arg = action.meta.arg;
      const key = getKeySourceCodeTree(arg);
      const item = getSourceCodeTree(state)(key);
      return {
        ...state,
        [key]: { ...item, state: CRUDState.idle },
      };
    };

    //FETCH FIRST PAGE
    builder.addCase(fetchSourceCode.fulfilled, (state, action) => {
      const arg = action.meta.arg;
      const key = getKeySourceCodeTree(arg);
      const item = getSourceCodeTree(state)(key);
      if (action.payload === null) {
        return {
          ...state,
          [key]: {
            ...item,
            state: CRUDState.idle,
          },
        };
      } else {
        if (item.state === CRUDState.loading) {
          return {
            ...state,
            [key]: {
              ...item,
              state: CRUDState.idle,
              entities: action.payload.data,
              next_page: action.payload.next_page,
            },
          };
        }
      }
      return state;
    });
    builder.addCase(fetchSourceCode.pending, (state, action) => {
      const arg = action.meta.arg;
      const key = getKeySourceCodeTree(arg);
      const item = { ...getSourceCodeTree(state)(key) };
      if (item.state === CRUDState.idle) {
        return {
          ...state,
          [key]: {
            ...item,
            state: CRUDState.loading,
          },
        };
      } else {
        return state;
      }
    });
    builder.addCase(fetchSourceCode.rejected, default_rejected);

    // FETCH MORE
    builder.addCase(fetchMoreSourceCode.fulfilled, (state, action) => {
      const arg = action.meta.arg;
      const key = getKeySourceCodeTree(arg);
      const item = getSourceCodeTree(state)(key);
      if (action.payload === null) {
        return {
          ...state,
          [key]: {
            ...item,
            state: CRUDState.idle,
          },
        };
      } else {
        if (item.state === CRUDState.loading_more && item.entities) {
          return {
            ...state,
            [key]: {
              ...item,
              state: CRUDState.idle,
              entities: [...item.entities, ...action.payload.data],
              next_page: action.payload.next_page,
            },
          };
        }
      }
      return state;
    });
    builder.addCase(fetchMoreSourceCode.pending, (state, action) => {
      const arg = action.meta.arg;
      const key = getKeySourceCodeTree(arg);
      const item = { ...getSourceCodeTree(state)(key) };
      const next_page = Number.parseInt(item.next_page);
      if (item.state === CRUDState.idle && !isNaN(next_page)) {
        return {
          ...state,
          [key]: {
            ...item,
            state: CRUDState.loading,
          },
        };
      } else {
        return state;
      }
    });
    builder.addCase(fetchMoreSourceCode.rejected, default_rejected);

    builder.addCase(createNewDirectory.fulfilled, (state, action) => {
      const arg = action.meta.arg;
      const key = getKeySourceCodeTree(arg);
      const item = getSourceCodeTree(state)(key);
      if (action.payload === null) {
        return {
          ...state,
          [key]: {
            ...item,
            state: CRUDState.idle,
          },
        };
      } else {
        return {
          ...state,
          [key]: {
            ...item,
            state: CRUDState.idle,
          },
        };
      }
    });
    builder.addCase(createNewDirectory.pending, (state, action) => {
      const arg = action.meta.arg;
      const key = getKeySourceCodeTree(arg);
      const item = getSourceCodeTree(state)(key);
      if (item.state === CRUDState.idle) {
        return {
          ...state,
          [key]: {
            ...item,
            state: CRUDState.creating,
          },
        };
      } else {
        return state;
      }
    });
    builder.addCase(createNewDirectory.rejected, default_rejected);
  },
});

export const getSourceCodeTree = (state: SourceCodeState) => (key: string) =>
  state[key] ?? DEFAULT_ITEM_STATE;

export const selectSourceCodeTree = (state: RootState) => (key: string) =>
  getSourceCodeTree(state.source_code)(key);

export const sourceCodeReducer = sourceCodeSlice.reducer;
