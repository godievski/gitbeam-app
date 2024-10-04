import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dark from "../core/styles/colors.dark";
import light from "../core/styles/colors.light";
import { DEFAULT_THEME_STATE } from "./constants";
import { TypeView } from "./types";

const slice = createSlice({
  name: "theme",
  initialState: DEFAULT_THEME_STATE,
  reducers: {
    toggleTheme: (state, action: PayloadAction<boolean>) => {
      let isDark = !state.isDark;
      let useDeviceMode =
        isDark != action.payload ? false : state.useDeviceMode;
      return {
        ...state,
        isDark,
        useDeviceMode,
        colors: isDark ? dark : light,
      };
    },
    toggleDeviceTheme: (state, action: PayloadAction<boolean>) => {
      let useDeviceMode = !state.useDeviceMode;
      let isDark = useDeviceMode ? action.payload : state.isDark;
      return {
        ...state,
        isDark,
        useDeviceMode,
        colors: isDark ? dark : light,
      };
    },
    updateDarkMode: (state, action: PayloadAction<boolean>) => {
      if (state.useDeviceMode) {
        return {
          ...state,
          isDark: action.payload,
          useDeviceMode: state.useDeviceMode,
          colors: action.payload ? dark : light,
        };
      } else {
        return state;
      }
    },
    toggleProjectView: (state, _: PayloadAction<void>) => {
      return {
        ...state,
        projectView:
          state.projectView == TypeView.list ? TypeView.square : TypeView.list,
      };
    },
    toggleSourceView: (state, _: PayloadAction<void>) => {
      return {
        ...state,
        sourceView:
          state.sourceView == TypeView.list ? TypeView.square : TypeView.list,
      };
    },
  },
});

export const themeReducer = slice.reducer;

export const {
  toggleDeviceTheme,
  toggleTheme,
  toggleProjectView,
  toggleSourceView,
  updateDarkMode,
} = slice.actions;
