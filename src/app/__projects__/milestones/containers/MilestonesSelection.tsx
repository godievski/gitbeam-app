import React, { useCallback, useEffect, useState, useMemo } from "react";
import Header from "../../../../components/Header/Header";
import RefreshControlCommon from "../../../../components/RN/RefreshControlCommon";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import Container from "../../../../components/Layouts/Container";
import MilestoneRowSelection from "../components/MilestoneRowSelection";
import { CRUDState, StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import {
  MilestonesSelectionScreenParams,
  MILESTONES_SELECTION_SCREEN_NAME,
} from "../config/navigation";
import FlatList from "../../../../components/RN/FlatList";
import EmptyState from "../../../../components/Commons/EmptyState";
import { View } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  fetchMoreProjectMilestones,
  fetchProjectMilestones,
  selectMilestoneByProject,
} from "../config/milestonesSlice";
import { TMilestone } from "../../../../core/gitlab/types/milestones_types";
import Spinner from "../../../../components/Commons/Spinner";

interface ScreenProps {}

type MilestonesScreenProps = ScreenProps &
  StackScreenTmpProps<
    MilestonesSelectionScreenParams,
    typeof MILESTONES_SELECTION_SCREEN_NAME
  >;

const MilestonesSelection: React.FC<MilestonesScreenProps> = (props) => {
  const dispatch = useAppDispatch();
  const { route, navigation } = props;

  const {
    subtitle,
    milestone_selected_id,
    select_milestone,
    project_id,
  } = route.params;

  const milestones = useAppSelector((state) =>
    selectMilestoneByProject(state)(project_id)
  );

  const [filter_text, setFilterText] = useState("");

  const renderTitle = useCallback(
    () => <TitleHeader title={"Milestones"} subtitle={subtitle} />,
    []
  );

  const onRefreshHandler = useCallback(() => {
    dispatch(fetchProjectMilestones({ project_id }));
  }, []);

  useEffect(() => {
    onRefreshHandler();
  }, []);

  const updateFilterText = useCallback(
    (text: string) => {
      if (milestones.state === CRUDState.idle) {
        setFilterText(text);
      }
    },
    [milestones.state]
  );

  const onPressItem = useCallback((item: TMilestone) => {
    select_milestone(item);
    navigation.goBack();
  }, []);

  const active = useMemo(() => {
    if (milestones.entities) {
      return milestones.entities.filter((item) => {
        return item.state === "active" && item.title.includes(filter_text);
      });
    } else {
      return [];
    }
  }, [filter_text, milestones.entities]);

  const keyExtractor = useCallback((item) => `row-${item.id}-${item.iid}`, []);

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <MilestoneRowSelection
          item={item}
          onPress={onPressItem}
          selected={item.id === milestone_selected_id}
        />
      );
    },
    [onPressItem, milestone_selected_id]
  );

  const onRealEndReached = useCallback(() => {
    dispatch(fetchMoreProjectMilestones({ project_id }));
  }, []);

  return (
    <Container>
      <Header center={renderTitle} isModal={true} backBtn={false} />
      <SearchBar
        onChangeText={updateFilterText}
        placeholder="Quick filter by title"
      />
      <View style={{ flex: 1 }}>
        <FlatList
          data={active}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          refreshControl={
            <RefreshControlCommon
              refreshing={milestones.state === CRUDState.loading}
              onRefresh={onRefreshHandler}
            />
          }
          ListEmptyComponent={EmptyState}
          ListFooterComponent={
            milestones.state === CRUDState.loading_more ? (
              <Spinner />
            ) : (
              undefined
            )
          }
          onRealEndReached={onRealEndReached}
        />
      </View>
    </Container>
  );
};

export default MilestonesSelection;
