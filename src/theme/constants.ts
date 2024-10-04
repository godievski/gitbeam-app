import { ThemeState, TypeView } from "./types";
import light from "../core/styles/colors.light";

export const DEFAULT_THEME_STATE: ThemeState = {
  isDark: false,
  useDeviceMode: false,
  projectView: TypeView.list,
  sourceView: TypeView.square,
  colors: light,
};
