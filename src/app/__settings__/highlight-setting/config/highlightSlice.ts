import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_HIGHLIGHT_STATE } from "./constants";

type SelectPayload = {
  style: string;
  type: string;
};
const slice = createSlice({
  name: "highlight",
  initialState: DEFAULT_HIGHLIGHT_STATE,
  reducers: {
    select: (state, action: PayloadAction<SelectPayload>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const highlightReducer = slice.reducer;

export const { select: selectHighlight } = slice.actions;
