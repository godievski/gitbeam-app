import { CommonActions } from '@react-navigation/native';

export const THEME_SETTINGS_NAME = "THEME_SETTINGS_NAME";

export const goToThemeSettings = () =>
  CommonActions.navigate({
    name: THEME_SETTINGS_NAME,
    key: "change-theme",
  });
