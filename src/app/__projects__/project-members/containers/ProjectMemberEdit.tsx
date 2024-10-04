import React, { useState, useCallback, useRef } from "react";
import { MemberAccess, MemberAccessDesc } from "../../../../core/gitlab/types";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemComponent from "../../../../components/Group/ItemComponent";
import { View } from "react-native";
import ItemSelect from "../../../../components/Group/ItemSelect";
import Header from "../../../../components/Header/Header";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";
import { CRUDState, StackScreenTmpProps } from "../../../../core/utils";
import Container from "../../../../components/Layouts/Container";
import TitleHeader from "../../../../components/Header/TitleHeader";
import DatePicker from "../../../../components/Commons/DatePicker";
import { GENERAL_ICON_SIZE } from "../../../../core/styles/general";
import {
  ProjectMemberEditScreenParams,
  PROJECT_MEMBER_EDIT_SCREEN_NAME,
} from "../config/navigation";
import { Modalvski } from "../../../../components/Modalvski/Modalvski";
import ItemPressable from "../../../../components/Group/ItemPressable";
import IconThemed from "../../../../components/Icons/IconThemed";
import ScrollView from "../../../../components/RN/ScrollView";
import UserProfile from "../../../../components/Layouts/UserProfile";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  selectMembersByProject,
  updateProjectMember,
} from "../config/projectMembersSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useToast } from "../../../../components/Toast/ToastContext";

const DATE_FORMAT = "YYYY-MM-DD";

const PERMISSIONS = [
  { id: MemberAccess.GUEST, label: MemberAccessDesc[MemberAccess.GUEST] },
  { id: MemberAccess.REPORTER, label: MemberAccessDesc[MemberAccess.REPORTER] },
  {
    id: MemberAccess.DEVELOPER,
    label: MemberAccessDesc[MemberAccess.DEVELOPER],
  },
  {
    id: MemberAccess.MAINTAINER,
    label: MemberAccessDesc[MemberAccess.MAINTAINER],
  },
];

interface Props {}

type ProjectMemberEditProps = Props &
  StackScreenTmpProps<
    ProjectMemberEditScreenParams,
    typeof PROJECT_MEMBER_EDIT_SCREEN_NAME
  >;

const ProjectMemberEdit: React.FC<ProjectMemberEditProps> = (props) => {
  const dispatch = useAppDispatch();

  const toast = useToast();

  const { navigation, route } = props;

  const { member, project_id } = route.params;

  const members = useAppSelector((state) =>
    selectMembersByProject(state)(project_id)
  );

  const [expires_at, setExpiresAt] = useState<string | undefined>(
    member.expires_at
  );
  const [access_level, setAccessLevel] = useState<MemberAccess>(
    member.access_level
  );

  const modal = useRef<Modalvski>(null);

  const onPressRolePermissionHandler = useCallback(() => {
    modal.current?.open();
  }, [access_level]);

  const onPressUpdate = useCallback(() => {
    dispatch(
      updateProjectMember({
        project_id,
        identifier: member.id,
        data: {
          user_id: member.id,
          access_level,
          expires_at: expires_at ?? null,
        },
      })
    )
      .then(unwrapResult)
      .then(() => {
        navigation.goBack();
      })
      .catch(toast.updateError);
  }, [expires_at, access_level]);

  const TitleComp = useCallback(
    () => (
      <TitleHeader title={"Edit Project Member"} subtitle={member.username} />
    ),
    []
  );

  const RightHeaderComp = useCallback(() => {
    if (members.state === CRUDState.updating) {
      return <HeaderIndicator />;
    } else {
      return <ButtonHeader title="UPDATE" onPress={onPressUpdate} />;
    }
  }, [members.state, onPressUpdate]);

  return (
    <Container>
      <Header
        center={TitleComp}
        right={RightHeaderComp}
        isModal={true}
        backBtn={true}
      />
      <ScrollView style={{ flex: 1 }} paddingTop={true}>
        <UserProfile
          name={member.name}
          username={member.username}
          avatar_url={member.avatar_url}
        />
        <ItemGroup>
          <ItemSelect
            label="ROLE PERMISSION"
            value={MemberAccessDesc[access_level]}
            onPress={onPressRolePermissionHandler}
          />
          <ItemComponent label="ACCESS EXPIRATION DATE" borderBottom={false}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <DatePicker
                value={expires_at}
                placeholder="Select due date"
                format={DATE_FORMAT}
                onChange={setExpiresAt}
              />
            </View>
          </ItemComponent>
        </ItemGroup>
      </ScrollView>
      <Modalvski ref={modal}>
        <ItemGroup>
          {PERMISSIONS.map((role, index) => {
            const selected = access_level === role.id;
            const renderRight = selected
              ? () => (
                  <IconThemed
                    type="ionicon"
                    name="checkmark-outline"
                    size={GENERAL_ICON_SIZE}
                  />
                )
              : undefined;
            return (
              <ItemPressable
                key={role.id}
                title={role.label}
                onPress={() => setAccessLevel(role.id)}
                renderRight={renderRight}
                borderBottom={index !== PERMISSIONS.length - 1}
                dismissModal={false}
              />
            );
          })}
        </ItemGroup>
      </Modalvski>
    </Container>
  );
};

export default ProjectMemberEdit;
