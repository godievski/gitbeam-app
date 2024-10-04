import { createTransform } from "redux-persist";
import dark from "../core/styles/colors.dark";
import light from "../core/styles/colors.light";
import { ThemeState } from "./types";

export const themeTransformer = createTransform(
  (inState: ThemeState) => inState,
  (outState: ThemeState) => {
    return {
      ...outState,
      colors: outState.isDark ? dark : light,
    };
  },
  {
    whitelist: ["theme"],
  }
);

export default themeTransformer;
