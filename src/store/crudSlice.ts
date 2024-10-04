import {
  ActionReducerMapBuilder,
  AsyncThunk,
  createAsyncThunk,
  Draft,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";
import { APIQueryParams, ResponseWithPage } from "../core/gitlab/api";
import { CrudAPI } from "../core/gitlab/types";
import { CRUDState } from "../core/utils";
import { RootState } from "./rootReducer";
import { GenericState } from "./types";
import { createSliceWithReset, ThunkApi } from "./utils";

export type FetchArg = {
  project_id: number;
};

export type DeleteParams = {
  project_id: number;
  identifier: number | string;
};

export type UpdateOneParams = {
  project_id: number;
  identifier: number;
};

//Generic Thunks
type UpdateOneThunk<
  Entity,
  Return extends UpdateOneParams = UpdateOneParams,
  Api extends ThunkApi = ThunkApi
> = AsyncThunk<Entity | null, Return, Api>;

export const createCrudSlice = <
  Entity,
  Query,
  CreateData,
  UpdateData,
  State extends Record<number, GenericState<Entity, Query>> = Record<
    number,
    GenericState<Entity, Query>
  >,
  Reducers extends SliceCaseReducers<State> = SliceCaseReducers<State>,
  API extends CrudAPI<
    Entity,
    Query & APIQueryParams,
    CreateData,
    UpdateData
  > = CrudAPI<Entity, Query & APIQueryParams, CreateData, UpdateData>
>({
  name,
  defaultState,
  initialState,
  api,
  get_identifier,
  reducers,
  extraReducers = () => {},
  genericThunks = {},
}: {
  name: string;
  defaultState: GenericState<Entity, Query>;
  initialState: State;
  api: API;
  get_identifier: (e: Entity) => number | string;
  reducers: ValidateSliceCaseReducers<State, Reducers>;
  extraReducers?: (
    builder: ActionReducerMapBuilder<State>,
    default_rejected: (state: any, action: any) => any,
    getStateProject: (
      state: State | Draft<State>
    ) => (project_id: number) => GenericState<Entity, Query>
  ) => void;
  genericThunks?: {
    updateOne?: UpdateOneThunk<Entity>[];
  };
}) => {
  //define generic types
  type FetchReturned = ResponseWithPage<Entity[]> | null;
  type AddParams = {
    project_id: number;
    data: CreateData;
  };
  type UpdateParams = UpdateOneParams & {
    data: UpdateData;
  };
  type ItemState = GenericState<Entity, Query>;

  //default item state
  // const getStateProject = (state: State) => (project_id: number) =>
  //   state[project_id] ?? defaultState;
  const getStateProject: (
    state: State | Draft<State>
  ) => (project_id: number) => ItemState = (state) => {
    return (project_id) => {
      const s = state as State;
      return s[project_id] ?? defaultState;
    };
  };

  //selector
  const selectByProject: (
    state: RootState
  ) => (project_id: number) => ItemState = (state) => (project_id) =>
    getStateProject(state[name])(project_id);

  //thunk fetch
  const fetchThunk: AsyncThunk<
    FetchReturned,
    FetchArg,
    ThunkApi
  > = createAsyncThunk<FetchReturned, FetchArg, ThunkApi>(
    `${name}/fetch`,
    async (arg, thunkAPI) => {
      const item_state = getStateProject(thunkAPI.getState()[name])(
        arg.project_id
      );

      if (item_state.state === CRUDState.loading) {
        try {
          const res = await api.list(arg.project_id, item_state.query);
          return res.data;
        } catch (e) {
          return thunkAPI.rejectWithValue(e);
        }
      }

      return null;
    }
  );

  //thunk fetch more
  const fetchMoreThunk: AsyncThunk<
    FetchReturned,
    FetchArg,
    ThunkApi
  > = createAsyncThunk<FetchReturned, FetchArg, ThunkApi>(
    `${name}/fetchMore`,
    async (arg, thunkAPI) => {
      const item_state = getStateProject(thunkAPI.getState()[name])(
        arg.project_id
      );
      const { next_page: page_to_fetch } = item_state;

      if (item_state.state === CRUDState.loading_more) {
        try {
          const res = await api.list(arg.project_id, {
            ...item_state.query,
            page: page_to_fetch,
          });
          return res.data;
        } catch (e) {
          return thunkAPI.rejectWithValue(e);
        }
      }

      return null;
    }
  );

  //thunk add
  const addThunk: AsyncThunk<
    Entity | null,
    AddParams,
    ThunkApi
  > = createAsyncThunk<Entity | null, AddParams, ThunkApi>(
    `${name}/add`,
    async (arg, thunkAPI) => {
      const { project_id, data } = arg;

      const item_state = getStateProject(thunkAPI.getState()[name])(project_id);
      if (item_state.state === CRUDState.creating) {
        try {
          const res = await api.add(project_id, data);
          return res.data;
        } catch (e) {
          return thunkAPI.rejectWithValue(e);
        }
      }

      return null;
    }
  );

  //thunk update
  const updateThunk: AsyncThunk<
    Entity | null,
    UpdateParams,
    ThunkApi
  > = createAsyncThunk<Entity | null, UpdateParams, ThunkApi>(
    `${name}/update`,
    async (arg, thunkAPI) => {
      const { project_id, identifier, data } = arg;
      const item_state = getStateProject(thunkAPI.getState()[name])(project_id);
      if (item_state.state === CRUDState.updating) {
        try {
          const res = await api.update(project_id, identifier, data);
          return res.data;
        } catch (e) {
          return thunkAPI.rejectWithValue(e);
        }
      }

      return null;
    }
  );

  //thunk delete
  const deleteThunk: AsyncThunk<
    boolean | null,
    DeleteParams,
    ThunkApi
  > = createAsyncThunk<boolean | null, DeleteParams, ThunkApi>(
    `${name}/delete`,
    async (arg, thunkAPI) => {
      const { project_id, identifier } = arg;
      const item_state = getStateProject(thunkAPI.getState()[name])(project_id);
      if (item_state.state === CRUDState.deleting) {
        try {
          await api.delete(project_id, identifier);
          return true;
        } catch (e) {
          return thunkAPI.rejectWithValue(e);
        }
      }
      return null;
    }
  );

  const builderUpdateOne = <Params extends UpdateOneParams>(
    genericBuilder: ActionReducerMapBuilder<State>,
    genericThunk: AsyncThunk<Entity | null, Params, ThunkApi>
  ) => {
    genericBuilder.addCase(genericThunk.fulfilled, (state, action) => {
      const { project_id, identifier } = action.meta.arg;
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
          return {
            ...state,
            [project_id]: {
              ...item_state,
              state: CRUDState.idle,
              entities: item_state.entities.map((e) =>
                get_identifier(e) === identifier ? action.payload : e
              ),
            },
          };
        }
      }

      return state;
    });
    genericBuilder.addCase(genericThunk.pending, (state, action) => {
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
    genericBuilder.addCase(genericThunk.rejected, (state, action) => {
      const { project_id } = action.meta.arg;
      const item_state = getStateProject(state)(project_id);
      return {
        ...state,
        [project_id]: { ...item_state, state: CRUDState.idle },
      };
    });
  };

  const slice = createSliceWithReset({
    name,
    initialState,
    reducers: {
      updateQuery: (
        state,
        action: PayloadAction<{ project_id: number; query: Query }>
      ) => {
        const { project_id, query } = action.payload;
        const item_state = getStateProject(state)(project_id);
        return {
          ...state,
          [project_id]: {
            ...item_state,
            query: { ...query },
          },
        };
      },
      ...reducers,
    },
    extraReducers: (builder: ActionReducerMapBuilder<State>) => {
      const default_rejected = (state, action) => {
        const { project_id } = action.meta.arg;
        const mr = getStateProject(state)(project_id);
        return {
          ...state,
          [project_id]: { ...mr, state: CRUDState.idle },
        };
      };

      //FETCH CASES
      builder.addCase(fetchThunk.fulfilled, (state, action) => {
        const { project_id } = action.meta.arg;
        const item_state = getStateProject(state)(project_id);
        if (action.payload === null || action.payload === undefined) {
          return {
            ...state,
            [project_id]: {
              ...item_state,
              state: CRUDState.idle,
            },
          };
        } else {
          if (item_state.state === CRUDState.loading) {
            return {
              ...state,
              [project_id]: {
                ...item_state,
                state: CRUDState.idle,
                entities: action.payload.data,
                next_page: action.payload.next_page,
              },
            };
          }
        }
        return state;
      });
      builder.addCase(fetchThunk.pending, (state, action) => {
        const { project_id } = action.meta.arg;
        const item_state = { ...getStateProject(state)(project_id) };
        if (item_state.state === CRUDState.idle) {
          return {
            ...state,
            [project_id]: {
              ...item_state,
              state: CRUDState.loading,
            },
          };
        } else {
          return state;
        }
      });
      builder.addCase(fetchThunk.rejected, default_rejected);

      //FETCH MORE CASES
      builder.addCase(fetchMoreThunk.fulfilled, (state, action) => {
        const { project_id } = action.meta.arg;
        const item_state = getStateProject(state)(project_id);
        if (action.payload === null || action.payload === undefined) {
          return {
            ...state,
            [project_id]: {
              ...item_state,
              state: CRUDState.idle,
            },
          };
        } else {
          if (
            item_state.state === CRUDState.loading_more &&
            item_state.entities
          ) {
            return {
              ...state,
              [project_id]: {
                ...item_state,
                state: CRUDState.idle,
                entities: [...item_state.entities, ...action.payload.data],
                next_page: action.payload.next_page,
              },
            };
          }
        }
        return state;
      });

      builder.addCase(fetchMoreThunk.pending, (state, action) => {
        const { project_id } = action.meta.arg;
        const item_state = getStateProject(state)(project_id);
        const next_page = Number.parseInt(item_state.next_page);
        if (item_state.state === CRUDState.idle && !isNaN(next_page)) {
          return {
            ...state,
            [project_id]: {
              ...item_state,
              state: CRUDState.loading_more,
            },
          };
        } else {
          return state;
        }
      });
      builder.addCase(fetchMoreThunk.rejected, default_rejected);

      // ADD ONE CASES
      builder.addCase(addThunk.fulfilled, (state, action) => {
        const { project_id } = action.meta.arg;
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
            item_state.state === CRUDState.creating &&
            item_state.entities !== undefined
          ) {
            return {
              ...state,
              [project_id]: {
                ...item_state,
                state: CRUDState.idle,
                entities: [action.payload, ...item_state.entities],
              },
            };
          }
        }
        return state;
      });
      builder.addCase(addThunk.pending, (state, action) => {
        const { project_id } = action.meta.arg;
        const item_state = getStateProject(state)(project_id);
        if (item_state.state === CRUDState.idle) {
          return {
            ...state,
            [project_id]: {
              ...item_state,
              state: CRUDState.creating,
            },
          };
        } else {
          return state;
        }
      });
      builder.addCase(addThunk.rejected, default_rejected);

      // UPDATE ONE CASES
      builderUpdateOne(builder, updateThunk);

      // DELETE ONE CASES
      builder.addCase(deleteThunk.fulfilled, (state, action) => {
        const { project_id, identifier } = action.meta.arg;
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
            item_state.state === CRUDState.deleting &&
            item_state.entities !== undefined
          ) {
            return {
              ...state,
              [project_id]: {
                ...item_state,
                state: CRUDState.idle,
                entities: item_state.entities.filter(
                  (e) => get_identifier(e) !== identifier
                ),
              },
            };
          }
        }
        return state;
      });
      builder.addCase(deleteThunk.pending, (state, action) => {
        const { project_id } = action.meta.arg;
        const item_state = getStateProject(state)(project_id);
        if (item_state.state === CRUDState.idle) {
          return {
            ...state,
            [project_id]: {
              ...item_state,
              state: CRUDState.deleting,
            },
          };
        } else {
          return state;
        }
      });
      builder.addCase(deleteThunk.rejected, default_rejected);

      extraReducers(builder, default_rejected, getStateProject);

      //generic thunks
      //UPDATE ONES
      if (genericThunks.updateOne) {
        for (let i in genericThunks.updateOne) {
          const genericThunk = genericThunks.updateOne[i];
          builderUpdateOne(builder, genericThunk);
        }
      }
    },
  });

  const thunks = {
    fetch: fetchThunk,
    fetchMore: fetchMoreThunk,
    add: addThunk,
    update: updateThunk,
    delete: deleteThunk,
  };

  return {
    slice,
    thunks,
    getStateProject,
    selectByProject,
  };
};
