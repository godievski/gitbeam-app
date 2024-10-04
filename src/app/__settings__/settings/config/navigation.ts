import { CommonActions } from "@react-navigation/native";
export const SETTINGS_SCREEN_NAME = "SETTINGS_SCREEN_NAME";

export const goToSettings = () =>
  CommonActions.navigate({
    name: SETTINGS_SCREEN_NAME,
    key: `settings`,
  });

export type SettingsScreenParams = {
  [SETTINGS_SCREEN_NAME]: {};
};
