import { ActionReducerMapBuilder, AsyncThunk } from "@reduxjs/toolkit";
import { CRUDState } from "../core/utils";
import { GenericState } from "./types";

type GenericAsyncThunk<Returned = unknown, Arg = unknown> = AsyncThunk<
  Returned,
  Arg,
  any
>;

type PendingAction<R = unknown, A = unknown> = ReturnType<
  GenericAsyncThunk<R, A>["pending"]
>;
type RejectedAction<R = unknown, A = unknown> = ReturnType<
  GenericAsyncThunk<R, A>["rejected"]
>;
type FulfilledAction<R = unknown, A = unknown> = ReturnType<
  GenericAsyncThunk<R, A>["fulfilled"]
>;

export const thunkCaseReducerCreator = <
  Entity,
  Query,
  Arg = unknown,
  State extends GenericState<Entity, Query> = GenericState<Entity, Query>,
  Returned extends { data: Entity[]; next_page: string } | null = {
    data: Entity[];
    next_page: string;
  } | null
>() => ({
  fetch: {
    fulfilled: (state: State, action: FulfilledAction<Returned, Arg>) => {
      if (action.payload === null || action.payload === undefined) {
        state.state = CRUDState.idle;
      } else {
        if (state.state === CRUDState.loading) {
          state.state = CRUDState.idle;
          state.entities = action.payload.data;
          state.next_page = action.payload.next_page;
        }
      }
    },
    pending: (state: State, _action: PendingAction<Returned, Arg>) => {
      if (state.state === CRUDState.idle) {
        state.state = CRUDState.loading;
      }
    },
    rejected: (state: State, _action: RejectedAction<Returned, Arg>) => {
      state.state = CRUDState.idle;
    },
  },
  fetch_more: {
    fulfilled: (state: State, action: FulfilledAction<Returned, Arg>) => {
      if (action.payload === null || action.payload === undefined) {
        state.state = CRUDState.idle;
      } else {
        if (state.state === CRUDState.loading_more && state.entities) {
          state.state = CRUDState.idle;
          state.entities.concat(action.payload.data);
          state.next_page = action.payload.next_page;
        }
      }
    },
    pending: (state: State, _action: PendingAction<Returned, Arg>) => {
      const next_page = Number.parseInt(state.next_page);
      if (state.state === CRUDState.idle && !isNaN(next_page)) {
        state.state = CRUDState.loading_more;
      }
    },
    rejected: (state: State, _action: RejectedAction<Returned, Arg>) => {
      state.state = CRUDState.idle;
    },
  },
  add: {
    pending: (state: State, _action: PendingAction<Returned, Arg>) => {
      if (state.state === CRUDState.idle) {
        state.state = CRUDState.creating;
      }
    },
  },
  update: {
    pending: (state: State, _action: PendingAction<Returned, Arg>) => {
      if (state.state === CRUDState.idle) {
        state.state = CRUDState.updating;
      }
    },
  },
  delete: {
    pending: (state: State, _action: PendingAction<Returned, Arg>) => {
      if (state.state === CRUDState.idle) {
        state.state = CRUDState.deleting;
      }
    },
  },
  rejected: (state: State, _action: RejectedAction<Returned, Arg>) => {
    state.state = CRUDState.idle;
  },
});

export type ThunkReducersReturned = ReturnType<typeof thunkCaseReducerCreator>;

//TODO: fix typing
// export const addCaseToBuilder = (
//   builder: ActionReducerMapBuilder<any>,
//   thunk: GenericAsyncThunk<any, any>,
//   thunk_reducers: ThunkReducersReturned
// ) => {
//   builder.addCase(thunk.fulfilled, thunk_reducers.fulfilled);
//   builder.addCase(thunk.rejected, thunk_reducers.rejected);
//   builder.addCase(thunk.pending, thunk_reducers.pending);
// };
