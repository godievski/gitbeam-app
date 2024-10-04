import { CommonActions } from "@react-navigation/native";
export const EDITOR_FONT_FAMILY_SCREEN_NAME = "EDITOR_FONT_FAMILY_SCREEN_NAME";

export const goToEditorFontFamily = () =>
  CommonActions.navigate({
    name: EDITOR_FONT_FAMILY_SCREEN_NAME,
  });

export const EDITOR_SETTINGS_SCREEN_NAME = "EDITOR_SETTINGS_SCREEN_NAME";

export const goToEditorSettings = () =>
  CommonActions.navigate({
    name: EDITOR_SETTINGS_SCREEN_NAME,
  });

export type EditorSettingsScreenParams = {
  [EDITOR_SETTINGS_SCREEN_NAME]: {};
};
