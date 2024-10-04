import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DEAFULT_KEYBOARD_CONFIG_STATE } from "./constants";
import { KeyHelper } from "./types";

const slice = createSlice({
  name: "keyboard_config",
  initialState: DEAFULT_KEYBOARD_CONFIG_STATE,
  reducers: {
    updateOrder: (state, action: PayloadAction<KeyHelper[]>) => {
      return {
        ...state,
        included: [...action.payload],
      };
    },
    removeKey: (state, action: PayloadAction<KeyHelper>) => {
      return {
        ...state,
        included: state.included.filter((key) => key.id !== action.payload.id),
        more: [...state.more, action.payload],
      };
    },
    addKey: (state, action: PayloadAction<KeyHelper>) => {
      return {
        ...state,
        included: [...state.included, action.payload],
        more: state.more.filter((key) => key.id !== action.payload.id),
      };
    },
  },
});

export const keyboardConfigReducer = slice.reducer;

export const {
  updateOrder: updateOrderKeyboardConfig,
  removeKey: removeKeyConfig,
  addKey: addKeyConfig,
} = slice.actions;
