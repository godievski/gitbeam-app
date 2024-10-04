import {
  ActionReducerMapBuilder,
  createAction,
  createSlice,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";
import { HttpGitlabError } from "../core/gitlab/utils";
import { RootState } from "./rootReducer";

export const resetAction = createAction<void, "__reset__">("__reset__");

export const createSliceWithReset = <
  State,
  Reducers extends SliceCaseReducers<State>
>({
  name = "",
  initialState,
  reducers,
  extraReducers = () => {},
}: {
  name: string;
  initialState: State;
  reducers: ValidateSliceCaseReducers<State, Reducers>;
  extraReducers?: (builder: ActionReducerMapBuilder<State>) => void;
}) => {
  return createSlice({
    name,
    initialState,
    reducers: {
      reset: () => initialState,
      ...reducers,
    },
    extraReducers: (builder) => {
      builder.addCase(resetAction.type, () => initialState);
      extraReducers(builder);
    },
  });
};

export interface ThunkApi<T = unknown, Error = HttpGitlabError> {
  state: RootState;
  extra: T;
  rejectValue: Error;
}
