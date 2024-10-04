import { createAsyncThunk } from "@reduxjs/toolkit";
import { APICommitPayload } from "../../../../core/gitlab/types/commits_types";
import { RootState } from "../../../../store/rootReducer";
import { createSliceWithReset, ThunkApi } from "../../../../store/utils";
import { DEFAULT_STATE, DEFAULT_STATE_BRANCH_CHANGES } from "./constants";
import { ChangesState } from "./types";
import { getBranchChangesKey } from "./utils";
import filesytem_api from "../../../../core/filesystem_api";
import commits_api from "../../../../core/gitlab/api/commits_api";
import { ActionChange } from "../../../../core/gitlab/types/repository_files_types";

type CommitChangesArg = {
  project_id: number;
  data: APICommitPayload;
};
export const commitChanges = createAsyncThunk<
  boolean,
  CommitChangesArg,
  ThunkApi
>("changes/commit", async (arg, thunkAPI) => {
  const { project_id, data } = arg;
  const key = getBranchChangesKey(project_id, data.branch);

  const item = thunkAPI.getState().changes[key];

  if (item.committing) {
    //load each file
    for (let i in data.actions) {
      const action = data.actions[i];
      if (action.action === "create" || action.action === "update") {
        try {
          const content = await filesytem_api.readFile(
            {
              project_id,
              branch: data.branch,
            },
            action.file_path
          );
          data.actions[i].content = content ?? "";
        } catch (e) {
          //TODO: check permissions reading files
          const err_msg = "There was an error reading the files";
          const err: any = new Error(err_msg);
          return thunkAPI.rejectWithValue(err);
        }
      }
    }

    //save
    try {
      await commits_api.commitMultipleFiles(project_id, data);
      await filesytem_api.deleteFilesBranch({
        project_id,
        branch: data.branch,
      });
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }

    return true;
  }

  return false;
});

export type SaveActionFileDeleteArg = {
  project_id: number;
  branch: string;
  data: ActionChange;
};
export const saveActionFileDelete = createAsyncThunk<
  boolean,
  SaveActionFileDeleteArg,
  ThunkApi
>("change/save_delete", async (arg, thunkAPI) => {
  const { project_id, branch, data } = arg;
  try {
    await filesytem_api.deleteFile({ project_id, branch }, data.file_path);
    return true;
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

export type SaveActionFileWriteArg = {
  project_id: number;
  branch: string;
  data: ActionChange;
};
//createNewFile
//updateNewFile
//saveFileUpdate
export const saveActionFileWrite = createAsyncThunk<
  boolean,
  SaveActionFileWriteArg,
  ThunkApi
>("changes/save_update", async (arg, thunkAPI) => {
  const { project_id, branch, data } = arg;
  try {
    await filesytem_api.saveContent(
      { project_id, branch },
      data.file_path,
      data.content ?? ""
    );
    return true;
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

export type ReloadActionChangeArg = {
  project_id: number;
  branch: string;
  file_path: string;
};
export const reloadActionChange = createAsyncThunk<
  string,
  ReloadActionChangeArg,
  ThunkApi
>("changes/reload_action", async (arg, thunkAPI) => {
  const { project_id, branch, file_path } = arg;
  try {
    const local_content = await filesytem_api.readFile(
      { project_id, branch },
      file_path
    );
    return local_content;
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});

export type DeleteActionChangeArg = {
  project_id: number;
  branch: string;
  file_path: string;
};
export const deleteActionChange = createAsyncThunk<
  boolean,
  DeleteActionChangeArg,
  ThunkApi
>("changes/delete_action", async (arg, thunk) => {
  const { project_id, branch, file_path } = arg;
  try {
    await filesytem_api.deleteFile({ project_id, branch }, file_path);
    return true;
  } catch (e) {
    return thunk.rejectWithValue(e);
  }
});

export type DeleteMultipleActionChangeArg = {
  project_id: number;
  branch: string;
  data: string[];
};
export const deleteMultipleActionChange = createAsyncThunk<
  string[],
  DeleteMultipleActionChangeArg,
  ThunkApi
>("changes/delete_multiple", async (arg, thunkAPI) => {
  const { project_id, branch, data } = arg;
  const toDelete: string[] = [];
  try {
    for (let i in data) {
      await filesytem_api.deleteFile({ project_id, branch }, data[i]);
      toDelete.push(data[i]);
    }
    return toDelete;
  } catch (e) {
    //TODO: pass "toDelete"
    return thunkAPI.rejectWithValue(e);
  }
});

const slice = createSliceWithReset({
  name: "changes",
  initialState: DEFAULT_STATE,
  reducers: {},
  extraReducers: (builder) => {
    //Commit changes
    builder.addCase(commitChanges.pending, (state, action) => {
      const arg = action.meta.arg;
      const key = getBranchChangesKey(arg.project_id, arg.data.branch);
      const item = getBranchChanges(state)(key);
      if (!item.committing) {
        return {
          ...state,
          [key]: {
            ...item,
            committing: true,
          },
        };
      }
      //safe guard
      if (!state[key]) {
        return {
          ...state,
          [key]: { ...item },
        };
      }
      return state;
    });
    builder.addCase(commitChanges.fulfilled, (state, action) => {
      const arg = action.meta.arg;
      const key = getBranchChangesKey(arg.project_id, arg.data.branch);
      const item = getBranchChanges(state)(key);
      if (item.committing && action.payload) {
        return {
          ...state,
          [key]: {
            ...item,
            actions: [],
            committing: false,
          },
        };
      } else {
        return {
          ...state,
          [key]: {
            ...item,
            committing: false,
          },
        };
      }
    });
    builder.addCase(commitChanges.rejected, (state, action) => {
      //TODO: handle errors
      const arg = action.meta.arg;
      const key = getBranchChangesKey(arg.project_id, arg.data.branch);
      const item = getBranchChanges(state)(key);
      return {
        ...state,
        [key]: {
          ...item,
          committing: false,
        },
      };
    });

    //Save Action Delete File
    builder.addCase(saveActionFileDelete.pending, (state, action) => {
      const arg = action.meta.arg;
      const key = getBranchChangesKey(arg.project_id, arg.branch);
      const item = getBranchChanges(state)(key);
      if (item.fs_state === "idle") {
        return {
          ...state,
          [key]: {
            ...item,
            fs_state: "deleting",
          },
        };
      }
      return state;
    });
    builder.addCase(saveActionFileDelete.fulfilled, (state, action) => {
      const arg = action.meta.arg;
      const key = getBranchChangesKey(arg.project_id, arg.branch);
      const item = getBranchChanges(state)(key);
      return {
        ...state,
        [key]: {
          ...item,
          fs_state: "idle",
          actions: [
            ...item.actions.filter((a) => a.file_path != arg.data.file_path),
            arg.data,
          ],
        },
      };
    });
    builder.addCase(saveActionFileDelete.rejected, (state, action) => {
      const arg = action.meta.arg;
      const key = getBranchChangesKey(arg.project_id, arg.branch);
      const item = getBranchChanges(state)(key);
      return {
        ...state,
        [key]: {
          ...item,
          fs_state: "idle",
        },
      };
    });

    //action write file
    builder.addCase(saveActionFileWrite.pending, (state, action) => {
      const arg = action.meta.arg;
      const key = getBranchChangesKey(arg.project_id, arg.branch);
      const item = getBranchChanges(state)(key);
      if (item.fs_state === "idle") {
        return {
          ...state,
          [key]: {
            ...item,
            fs_state: "writting",
          },
        };
      }
      return state;
    });
    builder.addCase(saveActionFileWrite.fulfilled, (state, action) => {
      const arg = action.meta.arg;
      const key = getBranchChangesKey(arg.project_id, arg.branch);
      const item = getBranchChanges(state)(key);
      return {
        ...state,
        [key]: {
          ...item,
          fs_state: "idle",
          actions: [
            ...item.actions.filter((a) => a.file_path != arg.data.file_path),
            arg.data,
          ],
        },
      };
    });
    builder.addCase(saveActionFileWrite.rejected, (state, action) => {
      const arg = action.meta.arg;
      const key = getBranchChangesKey(arg.project_id, arg.branch);
      const item = getBranchChanges(state)(key);
      return {
        ...state,
        [key]: {
          ...item,
          fs_state: "idle",
        },
      };
    });

    //reload action change content
    builder.addCase(reloadActionChange.pending, (state, action) => {
      const arg = action.meta.arg;
      const key = getBranchChangesKey(arg.project_id, arg.branch);
      const item = getBranchChanges(state)(key);
      if (item.fs_state === "idle") {
        return {
          ...state,
          [key]: {
            ...item,
            fs_state: "reading",
          },
        };
      }
      return state;
    });
    builder.addCase(reloadActionChange.fulfilled, (state, action) => {
      const arg = action.meta.arg;
      const key = getBranchChangesKey(arg.project_id, arg.branch);
      const item = getBranchChanges(state)(key);
      if (item.fs_state === "reading") {
        return {
          ...state,
          [key]: {
            ...item,
            fs_state: "idle",
            actions: item.actions.map((a) => {
              if (a.file_path === arg.file_path) {
                return {
                  ...a,
                  file_path: arg.file_path,
                  content: action.payload,
                };
              }
              return a;
            }),
          },
        };
      }
      return state;
    });
    builder.addCase(reloadActionChange.rejected, (state, action) => {
      const arg = action.meta.arg;
      const key = getBranchChangesKey(arg.project_id, arg.branch);
      const item = getBranchChanges(state)(key);
      return {
        ...state,
        [key]: {
          ...item,
          fs_state: "idle",
        },
      };
    });

    //delete simple change
    builder.addCase(deleteActionChange.pending, (state, action) => {
      const arg = action.meta.arg;
      const key = getBranchChangesKey(arg.project_id, arg.branch);
      const item = getBranchChanges(state)(key);
      if (item.fs_state === "idle") {
        return {
          ...state,
          [key]: {
            ...item,
            fs_state: "deleting",
          },
        };
      }
      return state;
    });
    builder.addCase(deleteActionChange.fulfilled, (state, action) => {
      const arg = action.meta.arg;
      const key = getBranchChangesKey(arg.project_id, arg.branch);
      const item = getBranchChanges(state)(key);
      if (item.fs_state === "deleting") {
        return {
          ...state,
          [key]: {
            ...item,
            fs_state: "idle",
            actions: item.actions.filter(
              (a) => !(a.file_path === arg.file_path)
            ),
          },
        };
      }
      return state;
    });
    builder.addCase(deleteActionChange.rejected, (state, action) => {
      const arg = action.meta.arg;
      const key = getBranchChangesKey(arg.project_id, arg.branch);
      const item = getBranchChanges(state)(key);
      return {
        ...state,
        [key]: {
          ...item,
          fs_state: "idle",
        },
      };
    });

    //delete multiple change
    builder.addCase(deleteMultipleActionChange.pending, (state, action) => {
      const arg = action.meta.arg;
      const key = getBranchChangesKey(arg.project_id, arg.branch);
      const item = getBranchChanges(state)(key);
      if (item.fs_state === "idle") {
        return {
          ...state,
          [key]: {
            ...item,
            fs_state: "deleting",
          },
        };
      }
      return state;
    });
    builder.addCase(deleteMultipleActionChange.fulfilled, (state, action) => {
      const arg = action.meta.arg;
      const key = getBranchChangesKey(arg.project_id, arg.branch);
      const item = getBranchChanges(state)(key);
      if (item.fs_state === "deleting") {
        return {
          ...state,
          [key]: {
            ...item,
            fs_state: "idle",
            actions: item.actions.filter(
              (a) => !arg.data.some((val) => a.file_path === val)
            ),
          },
        };
      }
      return state;
    });
    builder.addCase(deleteMultipleActionChange.rejected, (state, action) => {
      //TODO: remove only deletable files
      const arg = action.meta.arg;
      const key = getBranchChangesKey(arg.project_id, arg.branch);
      const item = getBranchChanges(state)(key);
      return {
        ...state,
        [key]: {
          ...item,
          fs_state: "idle",
        },
      };
    });
  },
});

export const getBranchChanges = (state: ChangesState) => (key: string) =>
  state[key] ?? DEFAULT_STATE_BRANCH_CHANGES;

export const selectBranchChanges = (state: RootState) => (key: string) =>
  getBranchChanges(state.changes)(key);

export const changesReducer = slice.reducer;
