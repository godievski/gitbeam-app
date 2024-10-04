import { CommonActions } from '@react-navigation/native';

export const ABOUT_SCREEN_NAME = "ABOUT_SCREEN_NAME";

export const goToAbout = () =>
  CommonActions.navigate({
    name: ABOUT_SCREEN_NAME,
  });