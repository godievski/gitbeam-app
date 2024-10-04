import React, { useState, useEffect, useCallback, useMemo } from "react";
import Header from "../../../../components/Header/Header";
import RefreshControlCommon from "../../../../components/RN/RefreshControlCommon";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import Container from "../../../../components/Layouts/Container";
import LabelRowSelection from "../components/LabelRowSelection";
import { CRUDState, StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import {
  LabelsSelectionScreenParams,
  LABELS_SELECTION_SCREEN_NAME,
} from "../config/navigation";
import EmptyState from "../../../../components/Commons/EmptyState";
import FlatList from "../../../../components/RN/FlatList";
import { View } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  fetchMoreProjectLabels,
  fetchProjectLabels,
  selectLabelsByProject,
} from "../config/labelsSlice";
import { TLabel } from "../../../../core/gitlab/types/labels_types";
import Spinner from "../../../../components/Commons/Spinner";

interface ScreenProps {}

type LabelsScreenProps = ScreenProps &
  StackScreenTmpProps<
    LabelsSelectionScreenParams,
    typeof LABELS_SELECTION_SCREEN_NAME
  >;

//GUEST CANNOT PERFORM OPERATION, ONLY SUBSCRIBE

const LabelsSelection: React.FC<LabelsScreenProps> = (props) => {
  const dispatch = useAppDispatch();

  const { route } = props;
  const {
    project_id,
    setLabels: setLabelsParent,
    labels: labelsParent,
  } = route.params;

  const labels = useAppSelector((state) =>
    selectLabelsByProject(state)(project_id)
  );

  const [filterText, setFilterText] = useState("");
  const [labelsSelected, setLabelsSelected] = useState(labelsParent);

  const onRefreshHandler = useCallback(() => {
    dispatch(fetchProjectLabels({ project_id }));
  }, []);

  useEffect(() => {
    onRefreshHandler();
  }, []);

  useEffect(() => {
    setLabelsParent(labelsSelected);
  }, [labelsSelected]);

  const TitleComp = useCallback(
    () => (
      <TitleHeader title={"Labels"} subtitle={props.route.params.subtitle} />
    ),
    []
  );

  const updateFilterText = useCallback((text: string) => {
    if (labels.state === CRUDState.idle) {
      setFilterText(text);
    }
  }, []);

  const onPressItemHandler = useCallback(
    (label: TLabel) => {
      if (labelsSelected[label.id]) {
        let labels_copy = { ...labelsSelected };
        delete labels_copy[label.id];
        setLabelsSelected(labels_copy);
      } else {
        setLabelsSelected({ ...labelsSelected, [label.id]: label.name });
      }
    },
    [labelsSelected]
  );

  const labels_to_show = useMemo(() => {
    if (labels.entities) {
      return labels.entities.filter((item) => item.name.includes(filterText));
    }
    return [];
  }, [labels.entities, filterText]);

  const keyExtractor = useCallback((item) => `row-${item.id}-${item.iid}`, []);

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <LabelRowSelection
          item={item}
          onPress={onPressItemHandler}
          selected={!!labelsSelected[item.id]}
        />
      );
    },
    [labelsSelected, onPressItemHandler]
  );

  const onRealEndReached = useCallback(() => {
    dispatch(fetchMoreProjectLabels({ project_id }));
  }, []);

  return (
    <Container primary={true}>
      <Header center={TitleComp} isModal={true} backBtn={false} />
      <SearchBar
        onChangeText={updateFilterText}
        placeholder="Quick filter by title"
      />
      <View style={{ flex: 1 }}>
        <FlatList
          data={labels_to_show}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          refreshControl={
            <RefreshControlCommon
              refreshing={labels.state === CRUDState.loading}
              onRefresh={onRefreshHandler}
            />
          }
          onRealEndReached={onRealEndReached}
          ListEmptyComponent={
            <EmptyState loading={labels.state === CRUDState.loading} />
          }
          ListFooterComponent={
            labels.state === CRUDState.loading_more ? <Spinner /> : undefined
          }
        />
      </View>
    </Container>
  );
};

export default LabelsSelection;
