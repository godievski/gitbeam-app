import { File } from "./types";
import { CommonActions } from "@react-navigation/native";
export const NEW_FILE_SCREEN_NAME = "NEW_FILE_SCREEN_NAME";

export type NewFileScreenParams = {
  [NEW_FILE_SCREEN_NAME]: {
    branch: string;
    path: string;
    current_files: File[];
    project_id: number;
  };
};

export const goToNewFile = (
  branch: string,
  path: string,
  current_files: File[],
  project_id: number
) =>
  CommonActions.navigate({
    name: NEW_FILE_SCREEN_NAME,
    params: {
      branch,
      path,
      current_files,
      project_id,
    },
  });

export const NEW_DIRECTORY_SCREEN_NAME = "NEW_DIRECTORY_SCREEN_NAME";

export type NewDirectoryScreenParams = {
  [NEW_DIRECTORY_SCREEN_NAME]: {
    branch: string;
    path: string;
    current_files: File[];
  };
};

export const goToNewDirectory = (
  branch: string,
  path: string,
  current_files: File[]
) =>
  CommonActions.navigate({
    name: NEW_DIRECTORY_SCREEN_NAME,
    params: {
      branch,
      path,
      current_files,
    },
  });

export const NEW_FILE_CONTENT_SCREEN_NAME = "NEW_FILE_CONTENT_SCREEN_NAME";

export type NewFileContentParams = {
  [NEW_FILE_CONTENT_SCREEN_NAME]: {
    branch: string;
    path: string;
    file_name: string;
    project_id: number;
  };
};

export const goToNewFileContent = (
  branch: string,
  path: string,
  file_name: string,
  project_id: number
) =>
  CommonActions.navigate({
    name: NEW_FILE_CONTENT_SCREEN_NAME,
    params: {
      branch,
      path,
      file_name,
      project_id,
    },
  });
