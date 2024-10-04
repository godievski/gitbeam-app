import { CommonActions } from "@react-navigation/native";

export const NEW_PROJECT_SCREEN_NAME = "NEW_PROJECT_SCREEN_NAME";

export type NewProjectParams = {
  [NEW_PROJECT_SCREEN_NAME]: undefined;
};

export const goToNewProject = () =>
  CommonActions.navigate({
    name: NEW_PROJECT_SCREEN_NAME,
    params: {},
  });

export const PROJECTS_SCREEN_NAME = "Projects";

export type ProjectsScreenParams = {
  [PROJECTS_SCREEN_NAME]: undefined;
};

export const PROJECTS_STACKS_SCREEN_NAME = "PROJECTS_STACKS_SCREEN_NAME";
