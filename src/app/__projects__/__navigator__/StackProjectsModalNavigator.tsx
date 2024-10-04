import React, { useLayoutEffect } from "react";
import NewBranch from "../branches/containers/NewBranch";
import NewLabel from "../labels/containers/NewLabel";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import NewIssue from "../issues/containers/NewIssue";
import FiltersIssues from "../issues/containers/FiltersIssues";
import AcceptMergeRequest from "../project-merge-requests/containers/AcceptMergeRequest";
import LabelsSelection from "../labels/containers/LabelsSelection";
import MilestonesSelection from "../milestones/containers/MilestonesSelection";
import ProjectMembersSelection from "../project-members/containers/ProjectMembersSelection";
import NewMRCreation, {
  NEW_MERGE_REQUEST_CREATION_SCREEN_NAME,
} from "../project-merge-requests/containers/NewMRCreation";
import NewMergeRequests from "../project-merge-requests/containers/NewMergeRequests";
import FiltersMergeRequests from "../project-merge-requests/containers/FiltersMergeRequests";
import EditLabel from "../labels/containers/EditLabel";
import NewMilestone from "../milestones/containers/NewMilestone";
import EditMilestone from "../milestones/containers/EditMilestone";
import NewProjectMember from "../project-members/containers/NewProjectMember";
import { NEW_BRANCH_SCREEN_NAME } from "../branches/config/navigation";
import { NEW_MERGE_REQUEST_SCREEN_NAME } from "../project-merge-requests/config/navigation";
import { NEW_PROJECT_SCREEN_NAME } from "../projects/config/navigation";
import NewProject from "../projects/containers/NewProject";
import StackProjectNormalNavigator from "./StackProjectNormalNavigator";
import { BRANCHES_SELECTION_SCREEN_NAME } from "../branches/config/navigation";

import {
  ACCEPT_MERGE_REQUEST_SCREEN_NAME,
  FILTERS_MERGE_REQUESTS_SCREEN_NAME,
} from "../project-merge-requests/config/navigation";
import {
  NEW_PROJECT_MEMBER_SCREEN_NAME,
  PROJECT_MEMBERS_SELECTION_SCREEN_NAME,
} from "../project-members/config/navigation";
import {
  MILESTONES_SELECTION_SCREEN_NAME,
  NEW_MILESTONE_SCREEN_NAME,
  EDIT_MILESTONE_SCREEN_NAME,
} from "../milestones/config/navigation";
import {
  LABELS_SELECTION_SCREEN_NAME,
  NEW_LABEL_SCREEN_NAME,
  EDIT_LABEL_SCREEN_NAME,
} from "../labels/config/navigation";
import {
  FILTERS_ISSUES_SCREEN_NAME,
  NEW_ISSUE_SCREEN_NAME,
} from "../issues/config/navigation";
import BranchesSelection from "../branches/containers/BranchesSelection";
import { PROJECT_MEMBER_EDIT_SCREEN_NAME } from "../project-members/config/navigation";
import ProjectMemberEdit from "../project-members/containers/ProjectMemberEdit";

const MainStack = createStackNavigator();

const StackProjectsNavigator = (props) => {
  useLayoutEffect(() => {
    const route = props.route as any;
    props.navigation.setOptions({
      gestureEnabled: route.state && route.state.index > 0 ? false : true,
    });
  });

  return (
    <MainStack.Navigator
      initialRouteName={"DEFAULT_PROJECTS"}
      headerMode="none"
      screenOptions={{
        gestureEnabled: true,
        cardOverlayEnabled: true,
        cardShadowEnabled: true,
        ...TransitionPresets.ModalPresentationIOS,
        cardStyle: {
          backgroundColor: "transparent",
        },
      }}
      mode="card"
    >
      <MainStack.Screen
        name="DEFAULT_PROJECTS"
        component={StackProjectNormalNavigator}
      />
      <MainStack.Screen name={NEW_PROJECT_SCREEN_NAME} component={NewProject} />
      <MainStack.Screen
        name={BRANCHES_SELECTION_SCREEN_NAME}
        component={BranchesSelection}
      />
      <MainStack.Screen name={NEW_BRANCH_SCREEN_NAME} component={NewBranch} />
      <MainStack.Screen
        name={LABELS_SELECTION_SCREEN_NAME}
        component={LabelsSelection}
      />
      <MainStack.Screen name={NEW_LABEL_SCREEN_NAME} component={NewLabel} />
      <MainStack.Screen name={EDIT_LABEL_SCREEN_NAME} component={EditLabel} />
      <MainStack.Screen
        name={MILESTONES_SELECTION_SCREEN_NAME}
        component={MilestonesSelection}
      />
      <MainStack.Screen
        name={NEW_MILESTONE_SCREEN_NAME}
        component={NewMilestone}
      />
      <MainStack.Screen
        name={EDIT_MILESTONE_SCREEN_NAME}
        component={EditMilestone}
      />
      <MainStack.Screen
        name={PROJECT_MEMBERS_SELECTION_SCREEN_NAME}
        component={ProjectMembersSelection}
      />
      <MainStack.Screen
        name={NEW_PROJECT_MEMBER_SCREEN_NAME}
        component={NewProjectMember}
      />
      <MainStack.Screen
        name={PROJECT_MEMBER_EDIT_SCREEN_NAME}
        component={ProjectMemberEdit}
      />
      <MainStack.Screen
        name={FILTERS_MERGE_REQUESTS_SCREEN_NAME}
        component={FiltersMergeRequests}
      />
      <MainStack.Screen
        name={NEW_MERGE_REQUEST_SCREEN_NAME}
        component={NewMergeRequests}
      />
      <MainStack.Screen
        name={NEW_MERGE_REQUEST_CREATION_SCREEN_NAME}
        component={NewMRCreation}
      />
      <MainStack.Screen
        name={ACCEPT_MERGE_REQUEST_SCREEN_NAME}
        component={AcceptMergeRequest}
      />
      <MainStack.Screen
        name={FILTERS_ISSUES_SCREEN_NAME}
        component={FiltersIssues}
      />
      <MainStack.Screen name={NEW_ISSUE_SCREEN_NAME} component={NewIssue} />
    </MainStack.Navigator>
  );
};

export default StackProjectsNavigator;
