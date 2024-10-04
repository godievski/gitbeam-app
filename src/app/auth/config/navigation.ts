import { STACK_PROJECT_NAVIGATOR_SCREEN_NAME } from "../../__projects__/__navigator__/config";
import { STACK_PROFILE_NAVIGATOR_SCREEN_NAME } from "../../__profile__/__navigator__/config";
import { STACK_SETTINGS_NAVIGATOR_SCREEN_NAME } from "../../__settings__/__navigator__/config";
export const MAIN_SCREEN_NAME = "MAIN_SCREEN_NAME";
export const AUTH_LOGIN_SCREEN_NAME = "AUTH_LOGIN_SCREEN_NAME";
export const SECURE_AUTHENTICATOR_SCREEN_NAME =
  "SECURE_AUTHENTICATOR_SCREEN_NAME";

export type MainStackParamList = {
  [STACK_PROJECT_NAVIGATOR_SCREEN_NAME]: undefined;
  [STACK_PROFILE_NAVIGATOR_SCREEN_NAME]: undefined;
  [STACK_SETTINGS_NAVIGATOR_SCREEN_NAME]: undefined;
};
