import { CommonActions } from "@react-navigation/native";

export const FILE_PREVIEW_SCREEN_NAME = "FILE_PREVIEW_SCREEN_NAME";

type FilePreviewParams = {
  project_id: number;
  branch: string;
  path: string;
  title: string;
};
export type FilePreviewScreenParams = {
  [FILE_PREVIEW_SCREEN_NAME]: FilePreviewParams;
};

export const goToFilePreview = ({
  project_id,
  branch,
  path,
  title,
}: FilePreviewParams) =>
  CommonActions.navigate({
    name: FILE_PREVIEW_SCREEN_NAME,
    params: {
      project_id,
      branch,
      path,
      title,
    },
    key: `file-preview::${project_id}::${branch}::${path}`,
  });

export const NEW_FILE_PREVIEW_SCREEN_NAME = "NEW_FILE_PREVIEW_SCREEN_NAME";

type NewFilePreviewParams = {
  project_id: number;
  branch: string;
  path: string;
  title: string;
  file_name: string;
};

export type NewFilePreviewScreenParams = {
  [NEW_FILE_PREVIEW_SCREEN_NAME]: NewFilePreviewParams;
};

export const goToNewFilePreview = ({
  project_id,
  branch,
  path,
  title,
  file_name,
}: NewFilePreviewParams) =>
  CommonActions.navigate({
    name: NEW_FILE_PREVIEW_SCREEN_NAME,
    params: {
      project_id,
      branch,
      path,
      title,
      file_name,
    },
    key: `new-file-preview::${project_id}::${branch}::${path}`,
  });
