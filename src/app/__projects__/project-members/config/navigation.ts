import { CommonActions } from "@react-navigation/native";
import { MemberAccess } from "../../../../core/gitlab/types";
import { TMember } from "../../../../core/gitlab/types/members_types";

export const NEW_PROJECT_MEMBER_SCREEN_NAME = "NEW_PROJECT_MEMBER_SCREEN_NAME";

export type NewProjectMemberScreenParams = {
  [NEW_PROJECT_MEMBER_SCREEN_NAME]: {
    project_id: number;
  };
};

export const goToNewProjectMember = (project_id: number) =>
  CommonActions.navigate({
    name: NEW_PROJECT_MEMBER_SCREEN_NAME,
    params: {
      project_id,
    },
  });

export const PROJECT_MEMBERS_SCREEN_NAME = "PROJECT_MEMBERS_SCREEN_NAME";

export type ProjectMembersScreenParams = {
  [PROJECT_MEMBERS_SCREEN_NAME]: {
    project_id: number;
    subtitle: string;
  };
};

export const goToProjectMembers = (project_id: number, subtitle: string) =>
  CommonActions.navigate({
    name: PROJECT_MEMBERS_SCREEN_NAME,
    params: {
      project_id,
      subtitle,
    },
  });

export const PROJECT_MEMBERS_SELECTION_SCREEN_NAME =
  "PROJECT_MEMBERS_SELECTION_SCREEN_NAME";

export type ProjectMembersSelectionScreenParams = {
  [PROJECT_MEMBERS_SELECTION_SCREEN_NAME]: {
    project_id: number;
    subtitle: string;
    member_selected_id: number | null;
    select_member: (member: TMember) => any;
  };
};

export const goToProjectMembersSelection = (
  project_id: number,
  subtitle: string,
  member_selected_id: number | null,
  select_member: (member: TMember) => any
) =>
  CommonActions.navigate({
    name: PROJECT_MEMBERS_SELECTION_SCREEN_NAME,
    params: {
      project_id,
      subtitle,
      member_selected_id,
      select_member,
    },
    key: `project-members-selection`,
  });

export const PROJECT_MEMBER_EDIT_SCREEN_NAME =
  "PROJECT_MEMBER_EDIT_SCREEN_NAME";

export type ProjectMemberEditParams = {
  member: TMember;
  access_level: MemberAccess;
  project_id: number;
};

export type ProjectMemberEditScreenParams = {
  [PROJECT_MEMBER_EDIT_SCREEN_NAME]: ProjectMemberEditParams;
};

export const goToProjectMemberEdit = (params: ProjectMemberEditParams) =>
  CommonActions.navigate({
    name: PROJECT_MEMBER_EDIT_SCREEN_NAME,
    params,
  });
