import { CommonActions } from "@react-navigation/native";

export const FILE_EDITOR_SCREEN_NAME = "FILE_EDITOR_SCREEN_NAME";

type FileEditorParams = {
  project_id: number;
  branch: string;
  path: string;
  title: string;
  file_name: string;
  last_commit_id?: string;
  content: string | null;
};

export type FileEditorScreenParams = {
  [FILE_EDITOR_SCREEN_NAME]: FileEditorParams;
};

export const goToFileEditor = (params: FileEditorParams) =>
  CommonActions.navigate({
    name: FILE_EDITOR_SCREEN_NAME,
    params: params,
    key: `file-editor::${params.project_id}::${params.branch}::${params.path}`,
  });

export const NEW_FILE_EDITOR_SCREEN_NAME = "NEW_FILE_EDITOR_SCREEN_NAME";

type NewFileEditorParams = {
  project_id: number;
  branch: string;
  path: string;
  title: string;
  file_name: string;
  content: string;
};

export type NewFileEditorScreenParams = {
  [NEW_FILE_EDITOR_SCREEN_NAME]: NewFileEditorParams;
};

export const goToNewFileEditor = (params: NewFileEditorParams) =>
  CommonActions.navigate({
    name: NEW_FILE_EDITOR_SCREEN_NAME,
    params: params,
    key: `new-file-editor::${params.project_id}::${params.branch}::${params.path}`,
  });
