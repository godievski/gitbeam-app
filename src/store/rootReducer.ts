import { combineReducers } from "@reduxjs/toolkit";
import { projectsReducer } from "../app/__projects__/projects/config/projectsSlice";
import { commitsReducer } from "../app/__projects__/commits/config/commitsSlice";
import { issuesReducer } from "../app/__projects__/issues/config/issuesSlice";
import { mergeRequestsReducer } from "../app/__projects__/project-merge-requests/config/mergeRequestsSlice";
import { branchesReducer } from "../app/__projects__/branches/config/branchesSlice";
import { projectMembersReducer } from "../app/__projects__/project-members/config/projectMembersSlice";
import { projectLabelsReducer } from "../app/__projects__/labels/config/labelsSlice";
import { projectMilestonesReducer } from "../app/__projects__/milestones/config/milestonesSlice";
import { sourceCodeReducer } from "../app/__projects__/source-code/config/sourceCodeSlice";
import { commitDiffReducer } from "../app/__projects__/commit-diff/config/commitDiffSlice";
import { currentProjectReducer } from "../app/__projects__/project-profile/config/currentProjectSlice";
import { changesReducer } from "../app/__projects__/changes/config/changesSlice";
import { userReducer } from "../app/__profile__/profile/config/userSlice";
import { sshKeysReducer } from "../app/__profile__/ssh-keys/config/sshkeysSlice";
import { highlightReducer } from "../app/__settings__/highlight-setting/config/highlightSlice";
import { keyboardConfigReducer } from "../app/__settings__/customize-keyboard/config/keyboardConfigSlice";
import { editorSettingsReducer } from "../app/__settings__/editor-setting/config/editorSettingsSlice";
import { themeReducer } from "../theme/themeSlice";
import { credentialReducer } from "../app/auth/config/authSlice";

export const appReducer = combineReducers({
  credential: credentialReducer,
  projects: projectsReducer,
  commits: commitsReducer,
  issues: issuesReducer,
  merge_requests: mergeRequestsReducer,
  branches: branchesReducer,
  project_members: projectMembersReducer,
  project_labels: projectLabelsReducer,
  project_milestones: projectMilestonesReducer,
  source_code: sourceCodeReducer,
  commit_diff: commitDiffReducer,
  current_project: currentProjectReducer,
  changes: changesReducer,
  user: userReducer,
  ssh_keys: sshKeysReducer,
  highlight: highlightReducer,
  keyboardConfig: keyboardConfigReducer,
  editorConfig: editorSettingsReducer,
  theme: themeReducer,
});

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = appReducer;

export default rootReducer;
