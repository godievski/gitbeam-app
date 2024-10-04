import { CommonActions } from '@react-navigation/native';


export const SOURCE_CODE_SCREEN_NAME = "SOURCE_CODE_SCREEN_NAME";

export type SourceCodeViewParams = {
  [SOURCE_CODE_SCREEN_NAME]: {
    project_id: number;
    branch: string;
    path: string;
    title: string;
    project_name: string;
  };
};

export const goToSourceCode = (
  project_id: number,
  branch: string,
  path: string,
  title: string,
  project_name: string
) =>
  CommonActions.navigate({
    name: SOURCE_CODE_SCREEN_NAME,
    params: {
      project_id,
      branch,
      path,
      title,
      project_name,
    },
    key: `source-code::${project_id}::${branch}::${path}`,
  });
