import React, { useLayoutEffect } from "react";
import ProjectProfile from "../project-profile/containers/ProjectProfile";
import SourceCode from "../source-code/containers/SourceCode";
import FilePreview from "../file-preview/containers/FilePreview";
import Commits from "../commits/containers/Commits";
import FileEditor from "../file-editor/containers/FileEditor";
import NewFile from "../new-file/containers/NewFile";
import NewFilePreview from "../file-preview/containers/NewFilePreview";
import NewFileEditor from "../file-editor/containers/NewFileEditor";
import Changes from "../changes/containers/Changes";
import CommitChanges from "../changes/containers/CommitChanges";
import NewFileContent from "../new-file/containers/NewFileContent";
import Labels from "../labels/containers/Labels";
import ProjectInitFilename from "../project-profile/containers/ProjectInitFilename";
import ProjectInitEditor from "../project-profile/containers/ProjectInitEditor";
import ProjectInitCommit from "../project-profile/containers/ProjectInitCommit";
import { createStackNavigator } from "@react-navigation/stack";
import Issues from "../issues/containers/Issues";
import Milestones from "../milestones/containers/Milestones";
import ProjectMembers from "../project-members/containers/ProjectMembers";
import ProjectMergeRequests from "../project-merge-requests/containers/ProjectMergeRequests";
import { PROJECT_MERGE_REQUESTS_SCREEN_NAME } from "../project-merge-requests/config/navigation";
import {
  CHANGES_SCREEN_NAME,
  COMMIT_CHANGES_SCREEN_NAME,
} from "../changes/config/navigation";
import { COMMITS_SCREEN_NAME } from "../commits/config/navigation";
import { SOURCE_CODE_SCREEN_NAME } from "../source-code/config/navigation";
import { PROJECTS_SCREEN_NAME } from "../projects/config/navigation";
import {
  PROJECT_INIT_FILENAME_SCREEN_NAME,
  PROJECT_PROFILE_SCREEN_NAME,
} from "../project-profile/config/navigation";
import {
  PROJECT_INIT_COMMIT_SCREEN_NAME,
  PROJECT_INIT_EDITOR_SCREEN_NAME,
} from "../project-profile/config/navigation";
import { PROJECT_MEMBERS_SCREEN_NAME } from "../project-members/config/navigation";
import {
  NEW_FILE_SCREEN_NAME,
  NEW_FILE_CONTENT_SCREEN_NAME,
} from "../new-file/config/navigation";
import { MILESTONES_SCREEN_NAME } from "../milestones/config/navigation";
import { LABELS_SCREEN_NAME } from "../labels/config/navigation";
import { ISSUES_SCREEN_NAME } from "../issues/config/navigation";
import {
  FILE_EDITOR_SCREEN_NAME,
  NEW_FILE_EDITOR_SCREEN_NAME,
} from "../file-editor/config/navigation";
import {
  FILE_PREVIEW_SCREEN_NAME,
  NEW_FILE_PREVIEW_SCREEN_NAME,
} from "../file-preview/config/navigation";
import Projects from "../projects/containers/Projects";
import { BRANCHES_SCREEN_NAME } from "../branches/config/navigation";
import Branches from "../branches/containers/Branches";
import { NEW_DIRECTORY_SCREEN_NAME } from "../new-file/config/navigation";
import NewDirectory from "../new-file/containers/NewDirectory";
import CommitDiff from "../commit-diff/containers/CommitDiff";
import { COMMIT_DIFF_SCREEN_NAME } from "../commit-diff/config/navigation";

const DefaultStack = createStackNavigator();

const StackProjectNormalNavigator = (props) => {
  useLayoutEffect(() => {
    const route = props.route as any;
    props.navigation.setOptions({
      gestureEnabled: route.state && route.state.index > 0 ? false : true,
    });
  });

  return (
    <DefaultStack.Navigator
      initialRouteName={PROJECTS_SCREEN_NAME}
      screenOptions={{
        gestureEnabled: true,
        cardOverlayEnabled: true,
        cardShadowEnabled: true,
        cardStyle: {
          backgroundColor: "transparent",
        },
      }}
      mode="card"
      headerMode="none"
    >
      <DefaultStack.Screen name={PROJECTS_SCREEN_NAME} component={Projects} />
      <DefaultStack.Screen
        name={PROJECT_PROFILE_SCREEN_NAME}
        component={ProjectProfile}
      />
      <DefaultStack.Screen name={BRANCHES_SCREEN_NAME} component={Branches} />
      <DefaultStack.Screen
        name={PROJECT_INIT_FILENAME_SCREEN_NAME}
        component={ProjectInitFilename}
      />
      <DefaultStack.Screen
        name={PROJECT_INIT_EDITOR_SCREEN_NAME}
        component={ProjectInitEditor}
      />
      <DefaultStack.Screen
        name={PROJECT_INIT_COMMIT_SCREEN_NAME}
        component={ProjectInitCommit}
      />
      <DefaultStack.Screen
        name={SOURCE_CODE_SCREEN_NAME}
        component={SourceCode}
      />
      <DefaultStack.Screen
        name={FILE_PREVIEW_SCREEN_NAME}
        component={FilePreview}
      />
      <DefaultStack.Screen
        name={FILE_EDITOR_SCREEN_NAME}
        component={FileEditor}
      />
      <DefaultStack.Screen name={COMMITS_SCREEN_NAME} component={Commits} />
      <DefaultStack.Screen
        name={COMMIT_DIFF_SCREEN_NAME}
        component={CommitDiff}
      />
      <DefaultStack.Screen name={NEW_FILE_SCREEN_NAME} component={NewFile} />
      <DefaultStack.Screen
        name={NEW_FILE_CONTENT_SCREEN_NAME}
        component={NewFileContent}
      />
      <DefaultStack.Screen
        name={NEW_DIRECTORY_SCREEN_NAME}
        component={NewDirectory}
      />
      <DefaultStack.Screen
        name={NEW_FILE_PREVIEW_SCREEN_NAME}
        component={NewFilePreview}
      />
      <DefaultStack.Screen
        name={NEW_FILE_EDITOR_SCREEN_NAME}
        component={NewFileEditor}
      />
      <DefaultStack.Screen name={CHANGES_SCREEN_NAME} component={Changes} />
      <DefaultStack.Screen
        name={COMMIT_CHANGES_SCREEN_NAME}
        component={CommitChanges}
      />
      <DefaultStack.Screen name={LABELS_SCREEN_NAME} component={Labels} />
      <DefaultStack.Screen
        name={MILESTONES_SCREEN_NAME}
        component={Milestones}
      />
      <DefaultStack.Screen
        name={PROJECT_MEMBERS_SCREEN_NAME}
        component={ProjectMembers}
      />
      <DefaultStack.Screen
        name={PROJECT_MERGE_REQUESTS_SCREEN_NAME}
        component={ProjectMergeRequests}
      />
      <DefaultStack.Screen name={ISSUES_SCREEN_NAME} component={Issues} />
    </DefaultStack.Navigator>
  );
};

export default StackProjectNormalNavigator;
