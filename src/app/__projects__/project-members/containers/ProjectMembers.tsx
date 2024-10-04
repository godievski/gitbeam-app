import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import Header from "../../../../components/Header/Header";
import ButtonHeader, {
  IconPlus,
} from "../../../../components/Buttons/ButtonHeader";
import { Alert, View } from "react-native";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import ProjectMemberRow from "../components/ProjectMemberRow";
import RefreshControlCommon from "../../../../components/RN/RefreshControlCommon";
import { MemberAccess } from "../../../../core/gitlab/types";
import { iOSColors } from "react-native-typography";
import {
  goToNewProjectMember,
  ProjectMembersScreenParams,
  PROJECT_MEMBERS_SCREEN_NAME,
} from "../config/navigation";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";
import Container from "../../../../components/Layouts/Container";
import {
  CRUDState,
  matchAny,
  StackScreenTmpProps,
} from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import { getPermissionLevel } from "../../../../core/gitlab/api";
import { GENERAL_ICON_SIZE } from "../../../../core/styles/general";
import { Modalvski } from "../../../../components/Modalvski/Modalvski";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemPressable from "../../../../components/Group/ItemPressable";
import ItemOuter from "../../../../components/Group/ItemOuter";
import TextThemed from "../../../../components/Commons/TextThemed";
import { goToProjectMemberEdit } from "../config/navigation";
import IconThemed from "../../../../components/Icons/IconThemed";
import FlatList from "../../../../components/RN/FlatList";
import EmptyState from "../../../../components/Commons/EmptyState";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { TMember } from "../../../../core/gitlab/types/members_types";
import {
  deleteProjectMember,
  fetchMoreProjectMembers,
  fetchProjectMembers,
  selectMembersByProject,
} from "../config/projectMembersSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useToast } from "../../../../components/Toast/ToastContext";
import Spinner from "../../../../components/Commons/Spinner";

interface ScreenProps {}

type ProjectMembersScreenProps = ScreenProps &
  StackScreenTmpProps<
    ProjectMembersScreenParams,
    typeof PROJECT_MEMBERS_SCREEN_NAME
  >;

const ProjectMembers: React.FC<ProjectMembersScreenProps> = (props) => {
  const dispatch = useAppDispatch();
  const { route, navigation } = props;

  const { project_id } = route.params;

  const user = useAppSelector((state) => state.user).data;
  const project = useAppSelector((state) => state.current_project).data!;
  const members = useAppSelector((state) =>
    selectMembersByProject(state)(project_id)
  );

  const access_level = useMemo(() => getPermissionLevel(project, user), [
    project,
    user,
  ]);

  const modal = useRef<Modalvski>(null);

  const toast = useToast();

  const [filter_text, setFilterText] = useState("");
  const [member_to_edit, setMemberToEdit] = useState<TMember | null>(null);

  const onRefreshHandler = useCallback(() => {
    dispatch(fetchProjectMembers({ project_id }));
  }, []);

  useEffect(() => {
    onRefreshHandler();
  }, []);

  const renderTitle = useCallback(
    () => <TitleHeader title={"Members"} subtitle={route.params.subtitle} />,
    []
  );

  const onPressAddBtnHandler = useCallback(
    () => navigation.dispatch(goToNewProjectMember(project_id)),
    []
  );

  const RightComp = useCallback(() => {
    const show_indicator = matchAny(
      [
        CRUDState.deleting,
        CRUDState.loading,
        CRUDState.loading,
        CRUDState.updating,
      ],
      members.state
    );
    if (show_indicator) {
      return <HeaderIndicator />;
    } else if (access_level >= MemberAccess.MAINTAINER) {
      return <ButtonHeader icon={IconPlus} onPress={onPressAddBtnHandler} />;
    } else {
      return undefined;
    }
  }, [members, access_level, onPressAddBtnHandler]);

  const updateFilterText = useCallback(
    (text: string) => {
      if (members.state === CRUDState.idle) {
        setFilterText(text);
      }
    },
    [members.state]
  );

  const deleteMember = useCallback(() => {
    if (!(members.state === CRUDState.deleting) && member_to_edit) {
      Alert.alert(
        "Remove Member",
        "Are you sure you want to remove this user from the project?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => {
              dispatch(
                deleteProjectMember({
                  project_id,
                  identifier: member_to_edit.id,
                })
              )
                .then(unwrapResult)
                .then(() => {
                  if (member_to_edit.id == user.id) {
                    navigation.pop(2);
                  }
                })
                .catch(toast.updateError);
            },
          },
        ]
      );
    }
  }, [members.state, user, member_to_edit]);

  const onLongPressHandler = useCallback((item: TMember) => {
    setMemberToEdit(item);
    modal.current?.open();
  }, []);

  const onPressHandler = useCallback((item: TMember | null) => {
    if (item && access_level >= MemberAccess.MAINTAINER) {
      navigation.dispatch(
        goToProjectMemberEdit({
          project_id,
          member: item,
          access_level,
        })
      );
    }
  }, []);

  const keyXtractor = useCallback((item) => `row-${item.id}`, []);

  const renderItem = useCallback(
    ({ item }) => (
      <ProjectMemberRow
        item={item}
        onPress={onPressHandler}
        onLongPress={onLongPressHandler}
      />
    ),
    [onPressHandler, onLongPressHandler]
  );

  const data = useMemo(() => {
    if (members.entities === undefined) {
      return [];
    }
    return members.entities.filter((item) => {
      const lowFit = filter_text.toLowerCase();
      return (
        item.name.toLowerCase().includes(lowFit) ||
        item.name.toLowerCase().includes(lowFit)
      );
    });
  }, [members.entities]);

  const onRealEndReached = useCallback(() => {
    dispatch(fetchMoreProjectMembers({ project_id }));
  }, []);

  return (
    <Container>
      <Header center={renderTitle} right={RightComp} />
      <SearchBar
        onChangeText={updateFilterText}
        placeholder="Quick filter by name or username"
      />
      <View style={{ flex: 1 }}>
        <FlatList
          data={data}
          keyExtractor={keyXtractor}
          renderItem={renderItem}
          refreshControl={
            <RefreshControlCommon
              refreshing={members.state === CRUDState.loading}
              onRefresh={onRefreshHandler}
            />
          }
          ListEmptyComponent={EmptyState}
          ListFooterComponent={
            members.state === CRUDState.loading_more ? <Spinner /> : undefined
          }
          onRealEndReached={onRealEndReached}
        />
      </View>
      <Modalvski ref={modal} cancelBtn>
        <ItemOuter>
          <TextThemed
            style={{
              width: "100%",
              textAlign: "center",
              fontSize: 15,
              fontWeight: "500",
            }}
          >
            {member_to_edit?.username}
          </TextThemed>
        </ItemOuter>

        {member_to_edit?.id == user.id ? (
          <ItemGroup>
            <ItemPressable
              title="Leave project"
              titleStyle={{ color: iOSColors.red }}
              onPress={deleteMember}
              renderIcon={() => (
                <IconThemed
                  type="ionicon"
                  name="trash-outline"
                  size={GENERAL_ICON_SIZE}
                  color={iOSColors.red}
                />
              )}
              borderBottom={false}
            />
          </ItemGroup>
        ) : access_level == MemberAccess.OWNER ||
          access_level == MemberAccess.MAINTAINER ? (
          <ItemGroup>
            <ItemPressable
              title={"Edit member"}
              renderIcon={() => (
                <IconThemed
                  type="fontawesome"
                  size={GENERAL_ICON_SIZE}
                  name="edit"
                />
              )}
              onPress={() => {
                onPressHandler(member_to_edit);
              }}
              chevron={true}
            />
            <ItemPressable
              title={
                member_to_edit?.id == user.id
                  ? "Leave project"
                  : "Remove user from project"
              }
              titleStyle={{ color: iOSColors.red }}
              renderIcon={() => (
                <IconThemed
                  type="ionicon"
                  name="trash-outline"
                  size={GENERAL_ICON_SIZE}
                  color={iOSColors.red}
                />
              )}
              onPress={deleteMember}
              borderBottom={false}
            />
          </ItemGroup>
        ) : null}
      </Modalvski>
    </Container>
  );
};

export default ProjectMembers;
