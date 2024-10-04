import React, { useState, useCallback, useEffect, useMemo } from "react";
import Header from "../../../../components/Header/Header";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import RefreshControlCommon from "../../../../components/RN/RefreshControlCommon";
import Container from "../../../../components/Layouts/Container";
import ProjectMemberRowSelection from "../components/ProjectMemberRowSelection";
import { CRUDState, StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import {
  ProjectMembersSelectionScreenParams,
  PROJECT_MEMBERS_SELECTION_SCREEN_NAME,
} from "../config/navigation";
import FlatList from "../../../../components/RN/FlatList";
import EmptyState from "../../../../components/Commons/EmptyState";
import { View } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  fetchMoreProjectMembers,
  fetchProjectMembers,
  selectMembersByProject,
} from "../config/projectMembersSlice";
import { TMember } from "../../../../core/gitlab/types/members_types";
import Spinner from "../../../../components/Commons/Spinner";

interface ScreenProps {}

type ProjectMembersScreenProps = ScreenProps &
  StackScreenTmpProps<
    ProjectMembersSelectionScreenParams,
    typeof PROJECT_MEMBERS_SELECTION_SCREEN_NAME
  >;

const ProjectMembersSelection: React.FC<ProjectMembersScreenProps> = (
  props
) => {
  const dispatch = useAppDispatch();
  const { route, navigation } = props;

  const {
    subtitle,
    select_member,
    member_selected_id,
    project_id,
  } = route.params;

  const members = useAppSelector((state) =>
    selectMembersByProject(state)(project_id)
  );

  const [filter_text, setFilterText] = useState("");

  const onRefreshHandler = useCallback(() => {
    dispatch(fetchProjectMembers({ project_id }));
  }, []);

  useEffect(() => {
    onRefreshHandler();
  }, []);

  const renderTitle = useCallback(
    () => <TitleHeader title={"Members"} subtitle={subtitle} />,
    []
  );

  const updateFilterText = useCallback(
    (text: string) => {
      if (members.state === CRUDState.idle) {
        setFilterText(text);
      }
    },
    [members.state]
  );

  const onPressItem = useCallback((item: TMember) => {
    select_member && select_member(item);
    navigation.goBack();
  }, []);

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

  const keyXtractor = useCallback((item) => `row-${item.id}`, []);

  const renderItem = useCallback(
    ({ item }) => (
      <ProjectMemberRowSelection
        item={item}
        onPress={onPressItem}
        selected={item.id == member_selected_id}
      />
    ),
    [onPressItem, member_selected_id]
  );

  const onRealEndReached = useCallback(() => {
    dispatch(fetchMoreProjectMembers({ project_id }));
  }, []);

  return (
    <Container>
      <Header center={renderTitle} isModal={true} backBtn={false} />
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
    </Container>
  );
};

export default ProjectMembersSelection;
