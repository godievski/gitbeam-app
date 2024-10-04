import React, {
  useCallback,
  useEffect,
  useContext,
  useRef,
  useMemo,
  useState,
} from "react";
import { shallowEqual } from "react-redux";
import Header from "../../../../components/Header/Header";
import ButtonHeader, {
  IconPlus,
  IconSearch,
} from "../../../../components/Buttons/ButtonHeader";
import { View, Alert } from "react-native";
import RefreshControlCommon from "../../../../components/RN/RefreshControlCommon";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";
import Container from "../../../../components/Layouts/Container";
import { CRUDState, StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import EmptyState from "../../../../components/Commons/EmptyState";
import IssueRow from "../components/IssueRow";
import {
  MemberAccess,
  IssueState,
  RequestStateEvent,
} from "../../../../core/gitlab/types";
import { iOSColors } from "react-native-typography";
import { getPermissionLevel } from "../../../../core/gitlab/api";
import { IssuesProjectState } from "../config/types";
import { GENERAL_ICON_SIZE } from "../../../../core/styles/general";
import {
  IssuesScreenParams,
  ISSUES_SCREEN_NAME,
  goToFiltersIssues,
  goToNewIssue,
} from "../config/navigation";
import { ToastContext } from "../../../../components/Toast/ToastContext";
import { Modalvski } from "../../../../components/Modalvski/Modalvski";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemPressable from "../../../../components/Group/ItemPressable";
import IconThemed from "../../../../components/Icons/IconThemed";
import FlatList from "../../../../components/RN/FlatList";
import { TProject } from "../../../../core/gitlab/types/projects_types";
import { TIssue } from "../../../../core/gitlab/types/issues_types";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  deleteIssue,
  fetchMoreIssues,
  selectIssuesByProject,
  updateIssue,
} from "../config/issuesSlice";
import { fetchIssues } from "../config/issuesSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Spinner from "../../../../components/Commons/Spinner";
import { TUser } from "../../../../core/gitlab/types/users_types";
TimeAgo.addLocale(en);

interface ScreenProps {
  issues: IssuesProjectState;
  project: TProject;
  user: TUser;
}

type IssuesScreenProps = ScreenProps &
  StackScreenTmpProps<IssuesScreenParams, typeof ISSUES_SCREEN_NAME>;

const Issues: React.FC<IssuesScreenProps> = (props) => {
  const [timeAgo] = useState(new TimeAgo("en-US"));
  const dispatch = useAppDispatch();
  const { navigation, route } = props;
  const { project_id, project_name } = route.params;

  const issues = useAppSelector(
    (state) => selectIssuesByProject(state)(project_id),
    shallowEqual
  );

  const project = useAppSelector((state) => state.current_project).data!;
  const user = useAppSelector((state) => state.user).data;

  const toast = useContext(ToastContext);

  const access_level = useMemo(() => getPermissionLevel(project, user), [
    project,
    user,
  ]);

  const [selected_issue, setSelectedIssue] = useState<TIssue>();

  const onRefresh = useCallback(() => {
    dispatch(fetchIssues({ project_id }));
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  const TitleComp = useCallback(
    () => <TitleHeader title={"Issues"} subtitle={project_name} />,
    []
  );

  const onPressFilterBtnHandler = useCallback(() => {
    navigation.dispatch(goToFiltersIssues(project_id));
  }, []);

  const onPressNewBtnHandler = useCallback(() => {
    navigation.dispatch(goToNewIssue(project_id, project.name));
  }, [project.name]);

  const RightComp = useCallback(() => {
    if (
      issues.state === CRUDState.loading ||
      issues.state === CRUDState.updating ||
      issues.state === CRUDState.deleting
    ) {
      return <HeaderIndicator />;
    } else {
      return (
        <View style={{ flexDirection: "row" }}>
          <ButtonHeader onPress={onPressFilterBtnHandler} icon={IconSearch} />
          <ButtonHeader onPress={onPressNewBtnHandler} icon={IconPlus} />
        </View>
      );
    }
  }, [issues, onPressFilterBtnHandler, onPressNewBtnHandler]);

  //TODO:
  const onPressItemHandler = useCallback((item: TIssue) => {}, []);

  //TODO:
  // const onPressEditIssueHandler = useCallback((item: TIssue) => {}, []);

  const onPressDeleteIssueHandler = useCallback((item: TIssue) => {
    Alert.alert("Delete Issue", "Are you sure you want to delete this issue?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          dispatch(deleteIssue({ project_id, identifier: item.iid }))
            .then(unwrapResult)
            .catch(toast.updateError);
        },
      },
    ]);
  }, []);

  const onPressStateIssueHandler = useCallback((item: TIssue) => {
    const data = {
      id: project_id,
      issue_iid: item.iid,
      state_event:
        item.state == IssueState.OPENED
          ? RequestStateEvent.CLOSE
          : RequestStateEvent.REOPEN,
    };
    dispatch(updateIssue({ project_id, identifier: item.iid, data }))
      .then(unwrapResult)
      .catch(toast.updateError);
  }, []);

  const modal = useRef<Modalvski>(null);
  const onLongPressItemHandler = useCallback((item: TIssue) => {
    setSelectedIssue(item);
    modal.current?.open();
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: TIssue; index: number }) => {
      return (
        <IssueRow
          item={item}
          onLongPress={onLongPressItemHandler}
          onPress={onPressItemHandler}
          timeAgo={timeAgo}
        />
      );
    },
    [onLongPressItemHandler, onPressItemHandler, timeAgo]
  );

  const keyExtractor = useCallback(
    (item: TIssue) => `row-${item.id}-${item.iid}`,
    []
  );

  const onRealEndReached = useCallback(() => {
    dispatch(fetchMoreIssues({ project_id }));
  }, []);

  return (
    <Container>
      <Header center={TitleComp} right={RightComp} />
      <View style={{ flex: 1 }}>
        {issues.state === CRUDState.loading &&
          issues.entities === undefined && <EmptyState loading={true} />}
        {issues.entities !== undefined && (
          <FlatList
            data={issues.entities}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            refreshControl={
              <RefreshControlCommon
                refreshing={issues.state === CRUDState.loading}
                onRefresh={onRefresh}
              />
            }
            ListEmptyComponent={
              <EmptyState loading={issues.state === CRUDState.loading} />
            }
            ListFooterComponent={
              issues.state === CRUDState.loading_more ? <Spinner /> : null
            }
            onRealEndReached={onRealEndReached}
          />
        )}
      </View>
      <Modalvski ref={modal} cancelBtn>
        {!!selected_issue && (
          <ItemGroup>
            {access_level > MemberAccess.REPORTER && (
              <ItemPressable
                title={
                  selected_issue.state === IssueState.CLOSED
                    ? "Reopen issue"
                    : "Close issue"
                }
                onPress={() => onPressStateIssueHandler(selected_issue)}
                renderIcon={() => (
                  <IconThemed
                    type="fontawesome"
                    size={GENERAL_ICON_SIZE}
                    name={
                      selected_issue.state === "closed"
                        ? "undo"
                        : "times-circle"
                    }
                  />
                )}
                borderBottom={access_level >= MemberAccess.OWNER}
              />
            )}
            {access_level >= MemberAccess.OWNER && (
              <ItemPressable
                title="Delete issue"
                titleStyle={{ color: iOSColors.red }}
                onPress={() => onPressDeleteIssueHandler(selected_issue)}
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
            )}
          </ItemGroup>
        )}
      </Modalvski>
    </Container>
  );
};

export default Issues;
