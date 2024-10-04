import { CommonActions } from '@react-navigation/native';
export const KEYBOARD_INCLUDED_SCREEN_NAME = "KEYBOARD_INCLUDED_SCREEN_NAME";

export const KEYBOARD_MORE_SCREEN_NAME = "KEYBOARD_MORE_SCREEN_NAME";

export const KEYBOARD_NAV_SCREEN_NAME = "KEYBOARD_NAV_SCREEN_NAME";

export const goToCustomizeKeyboard = () =>
  CommonActions.navigate({
    name: KEYBOARD_NAV_SCREEN_NAME,
  });