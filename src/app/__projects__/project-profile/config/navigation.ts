import { CommonActions } from '@react-navigation/native';
export const PROJECT_INIT_COMMIT_SCREEN_NAME =
  "PROJECT_INIT_COMMIT_SCREEN_NAME";

export type ProjectInitCommitParams = {
  [PROJECT_INIT_COMMIT_SCREEN_NAME]: {
    file_name: string;
    content: string;
  };
};

export const goToProjectInitCommit = (file_name: string, content: string) =>
  CommonActions.navigate({
    name: PROJECT_INIT_COMMIT_SCREEN_NAME,
    params: {
      file_name,
      content,
    },
  });


export const PROJECT_INIT_EDITOR_SCREEN_NAME =
  "PROJECT_INIT_EDITOR_SCREEN_NAME";

export type ProjectInitEditorParams = {
  [PROJECT_INIT_EDITOR_SCREEN_NAME]: {
    file_name: string;
  };
};

export const goToProjectInitEditor = (file_name: string) =>
  CommonActions.navigate({
    name: PROJECT_INIT_EDITOR_SCREEN_NAME,
    params: {
      file_name,
    },
  });


export const PROJECT_INIT_FILENAME_SCREEN_NAME =
  "PROJECT_INIT_FILENAME_SCREEN_NAME";

export type ProjectInitFilenameParams = {
  [PROJECT_INIT_FILENAME_SCREEN_NAME]: {
    file_name: string;
  };
};

export const goToProjectInitFilename = (file_name: string) =>
  CommonActions.navigate({
    name: PROJECT_INIT_FILENAME_SCREEN_NAME,
    params: {
      file_name,
    },
  });


  export const PROJECT_PROFILE_SCREEN_NAME = "PROJECT_PROFILE_SCREEN_NAME";

  export type ProjectProfileParams = {
    [PROJECT_PROFILE_SCREEN_NAME]: {
      project_id: number;
    }
  }

  export const goToProjectProfile = (project_id: number) =>
    CommonActions.navigate({
      name: PROJECT_PROFILE_SCREEN_NAME,
      params: { project_id },
    });