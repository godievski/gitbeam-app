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
import { View, Alert } from "react-native";
import MilestoneRow from "../components/MilestoneRow";
import SectionListHeader from "../../../../components/Commons/SectionListHeader";
import RefreshControlCommon from "../../../../components/RN/RefreshControlCommon";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import {
  goToEditMilestone,
  MilestonesScreenParams,
  MILESTONES_SCREEN_NAME,
  goToNewMilestone,
} from "../config/navigation";
import { iOSColors } from "react-native-typography";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";
import { MemberAccess } from "../../../../core/gitlab/types";
import Container from "../../../../components/Layouts/Container";
import {
  CRUDState,
  matchAny,
  StackScreenTmpProps,
} from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import SectionListEmpty from "../../../../components/Commons/SectionListEmpty";
import { getPermissionLevel } from "../../../../core/gitlab/api";
import { GENERAL_ICON_SIZE } from "../../../../core/styles/general";
import { Modalvski } from "../../../../components/Modalvski/Modalvski";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemPressable from "../../../../components/Group/ItemPressable";
import IconThemed from "../../../../components/Icons/IconThemed";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  deleteProjectMilestone,
  fetchProjectMilestones,
  selectMilestoneByProject,
  updateProjectMilestone,
  fetchMoreProjectMilestones,
} from "../config/milestonesSlice";
import { separateMilestones } from "../config/utils";
import { TMilestone } from "../../../../core/gitlab/types/milestones_types";
import { unwrapResult } from "@reduxjs/toolkit";
import { useToast } from "../../../../components/Toast/ToastContext";
import SectionList from "../../../../components/RN/SectionList";
import Spinner from "../../../../components/Commons/Spinner";

interface ScreenProps {}

type MilestonesScreenProps = ScreenProps &
  StackScreenTmpProps<MilestonesScreenParams, typeof MILESTONES_SCREEN_NAME>;

const Milestones: React.FC<MilestonesScreenProps> = (props) => {
  const dispatch = useAppDispatch();

  const toast = useToast();

  const { route, navigation } = props;

  const { project_id } = route.params;

  const user = useAppSelector((state) => state.user).data;
  const project = useAppSelector((state) => state.current_project).data!;
  const milestones = useAppSelector((state) =>
    selectMilestoneByProject(state)(project_id)
  );

  const milestonesData = useMemo(() => {
    if (milestones.entities) {
      return separateMilestones(milestones.entities);
    } else {
      return { closed: [], active: [] };
    }
  }, [milestones.entities]);

  const [filterText, setFilterText] = useState("");

  const [selected_milestone, setSelectedMilestone] = useState<TMilestone>();
  const modal = useRef<Modalvski>(null);

  const access_level = useMemo(() => getPermissionLevel(project, user), [
    project,
    user,
  ]);

  const onRefreshHandler = useCallback(() => {
    dispatch(fetchProjectMilestones({ project_id }));
  }, []);

  useEffect(() => {
    onRefreshHandler();
  }, []);

  const onPressNewBtnHandler = useCallback(() => {
    navigation.dispatch(goToNewMilestone(project_id));
  }, []);

  const TitleComp = useCallback(
    () => <TitleHeader title={"Milestones"} subtitle={route.params.subtitle} />,
    []
  );

  const RightHeaderComp = useCallback(() => {
    if (
      matchAny(
        [CRUDState.updating, CRUDState.deleting, CRUDState.loading],
        milestones.state
      )
    ) {
      return <HeaderIndicator />;
    } else if (access_level > MemberAccess.REPORTER) {
      return <ButtonHeader onPress={onPressNewBtnHandler} icon={IconPlus} />;
    } else {
      return undefined;
    }
  }, [milestones.state, onPressNewBtnHandler, access_level]);

  const updateFilterText = useCallback(
    (text: string) => {
      if (milestones.state === CRUDState.idle) {
        setFilterText(text);
      }
    },
    [milestones.state]
  );

  //TODO: add milestone detail page
  const onPressItemHandler = useCallback((item: TMilestone) => {}, []);

  const onPressEditHandler = useCallback((item: TMilestone) => {
    navigation.dispatch(goToEditMilestone(project_id, item));
  }, []);

  const onPressDeleteHandler = useCallback(
    (item: TMilestone) => {
      if (!(milestones.state === CRUDState.deleting)) {
        Alert.alert(
          "Delete Milestone",
          "Are you sure you want to delete this milestone?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => {
                dispatch(
                  deleteProjectMilestone({ project_id, identifier: item.id })
                )
                  .then(unwrapResult)
                  .catch(toast.updateError);
              },
            },
          ]
        );
      }
    },
    [milestones.state]
  );

  const toggleState = useCallback(
    (item: TMilestone) => {
      if (milestones.state !== CRUDState.updating) {
        if (item.state === "active") {
          dispatch(
            updateProjectMilestone({
              project_id,
              identifier: item.id,
              data: { state_event: "close" },
            })
          )
            .then(unwrapResult)
            .catch(toast.updateError);
        } else {
          dispatch(
            updateProjectMilestone({
              project_id,
              identifier: item.id,
              data: { state_event: "activate" },
            })
          )
            .then(unwrapResult)
            .catch(toast.updateError);
        }
      }
    },
    [milestones.state]
  );

  const onLongPressHandler = useCallback((item: TMilestone) => {
    setSelectedMilestone(item);
    modal.current?.open();
  }, []);

  const data = useMemo(() => {
    const active = milestonesData.active.filter((item) =>
      item.title.includes(filterText)
    );
    const closed = milestonesData.closed.filter((item) =>
      item.title.includes(filterText)
    );
    return [
      { title: "Active", data: active },
      { title: "Closed", data: closed },
    ];
  }, [milestones, filterText]);

  const keyExtractor = useCallback((item) => `row-${item.id}-${item.iid}`, []);

  const renderItem = useCallback(
    ({ item }) => (
      <MilestoneRow
        item={item}
        onLongPress={onLongPressHandler}
        onPress={onPressItemHandler}
        toggleState={toggleState}
        showBtnState={access_level > MemberAccess.REPORTER}
      />
    ),
    [onLongPressHandler, onPressItemHandler, toggleState, access_level]
  );

  const renderSectionHeader = useCallback(
    ({ section }) => <SectionListHeader title={section.title} />,
    []
  );

  const renderSectionFooter = useCallback(
    ({ section }) => (section.data.length == 0 ? <SectionListEmpty /> : null),
    []
  );

  const onRealEndReached = useCallback(() => {
    dispatch(fetchMoreProjectMilestones({ project_id }));
  }, []);

  return (
    <Container>
      <Header center={TitleComp} right={RightHeaderComp} />
      <SearchBar
        onChangeText={updateFilterText}
        placeholder="Quick filter by title"
      />
      <View style={{ flex: 1 }}>
        <SectionList
          sections={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          renderSectionFooter={renderSectionFooter}
          refreshControl={
            <RefreshControlCommon
              refreshing={milestones.state === CRUDState.loading}
              onRefresh={onRefreshHandler}
            />
          }
          onRealEndReached={onRealEndReached}
          ListFooterComponent={
            milestones.state === CRUDState.loading_more ? (
              <Spinner />
            ) : (
              undefined
            )
          }
        />
      </View>
      <Modalvski ref={modal} cancelBtn>
        {selected_milestone &&
          (access_level > MemberAccess.REPORTER ? (
            <ItemGroup>
              <ItemPressable
                title="Edit"
                onPress={() => onPressEditHandler(selected_milestone)}
                renderIcon={() => (
                  <IconThemed
                    type="fontawesome"
                    size={GENERAL_ICON_SIZE}
                    name="edit"
                  />
                )}
                chevron={true}
              />
              <ItemPressable
                title={
                  selected_milestone.state === "closed"
                    ? "Reopen milestone"
                    : "Close milestone"
                }
                onPress={() => toggleState(selected_milestone)}
                renderIcon={() => (
                  <IconThemed
                    type="fontawesome"
                    size={GENERAL_ICON_SIZE}
                    name={
                      selected_milestone.state === "closed"
                        ? "undo"
                        : "times-circle"
                    }
                  />
                )}
              />
              <ItemPressable
                title="Delete milestone"
                titleStyle={{ color: iOSColors.red }}
                onPress={() => onPressDeleteHandler(selected_milestone)}
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
          ) : null)}
        {/* TODO: add empty state for no options */}
      </Modalvski>
    </Container>
  );
};

export default Milestones;
