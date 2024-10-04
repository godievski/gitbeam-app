import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_EDITOR_SETTINGS_STATE } from "./constants";
import { ThemeEditor, FontFamilyEditor } from "./types";

const slice = createSlice({
  name: "editor_config",
  initialState: DEFAULT_EDITOR_SETTINGS_STATE,
  reducers: {
    updateTextSizeEditor: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        size: action.payload,
      };
    },
    updateThemeEditor: (state, action: PayloadAction<ThemeEditor>) => {
      return {
        ...state,
        theme: action.payload,
      };
    },
    updateFontFamilyEditor: (
      state,
      action: PayloadAction<FontFamilyEditor>
    ) => {
      return {
        ...state,
        fontFamily: action.payload,
      };
    },
  },
});

export const editorSettingsReducer = slice.reducer;

export const {
  updateFontFamilyEditor,
  updateTextSizeEditor,
  updateThemeEditor,
} = slice.actions;
