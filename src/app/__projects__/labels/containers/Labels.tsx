import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
import Header from "../../../../components/Header/Header";
import { View, Alert } from "react-native";
import RefreshControlCommon from "../../../../components/RN/RefreshControlCommon";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import LabelRow from "../components/LabelRow";
import SectionListHeader from "../../../../components/Commons/SectionListHeader";
import ButtonHeader, {
  IconPlus,
} from "../../../../components/Buttons/ButtonHeader";
import { goToNewLabel } from "../config/navigation";
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
import {
  LabelsScreenParams,
  LABELS_SCREEN_NAME,
  goToEditLabel,
} from "../config/navigation";
import { Modalvski } from "../../../../components/Modalvski/Modalvski";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemPressable from "../../../../components/Group/ItemPressable";
import IconThemed from "../../../../components/Icons/IconThemed";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import SectionList from "../../../../components/RN/SectionList";
import {
  fetchMoreProjectLabels,
  fetchProjectLabels,
  selectLabelsByProject,
  subscribeProjectLabel,
  unsubscribeProjectLabel,
  updateProjectLabel,
  deleteProjectLabel,
} from "../config/labelsSlice";
import { TLabel } from "../../../../core/gitlab/types/labels_types";
import { separateLabels } from "../config/utils";
import { unwrapResult } from "@reduxjs/toolkit";
import { useToast } from "../../../../components/Toast/ToastContext";
import Spinner from "../../../../components/Commons/Spinner";
interface ScreenProps {}

type LabelsScreenProps = ScreenProps &
  StackScreenTmpProps<LabelsScreenParams, typeof LABELS_SCREEN_NAME>;

//GUEST CANNOT PERFORM OPERATION, ONLY SUBSCRIBE

const Labels: React.FC<LabelsScreenProps> = (props) => {
  const dispatch = useAppDispatch();
  const { route, navigation } = props;

  const { project_id } = route.params;

  const user = useAppSelector((state) => state.user).data;
  const project = useAppSelector((state) => state.current_project).data!;
  const labels = useAppSelector((state) =>
    selectLabelsByProject(state)(project_id)
  );

  const toast = useToast();

  const labelsData: {
    prioritized: TLabel[];
    other: TLabel[];
  } = useMemo(() => {
    if (labels.entities) {
      return separateLabels(labels.entities);
    } else {
      return {
        prioritized: [],
        other: [],
      };
    }
  }, [labels.entities]);

  const [filterText, setFilterText] = useState("");

  const [selected_label, setSelectedLabel] = useState<TLabel>();
  const modal = useRef<Modalvski>(null);

  const access_level = useMemo(() => getPermissionLevel(project, user), [
    project,
    user,
  ]);

  const onRefreshHandler = useCallback(() => {
    dispatch(fetchProjectLabels({ project_id }));
  }, []);

  useEffect(() => {
    onRefreshHandler();
  }, []);

  const onPressNewBtnHandler = useCallback(() => {
    navigation.dispatch(goToNewLabel(project_id));
  }, []);

  const TitleComp = useCallback(
    () => <TitleHeader title={"Labels"} subtitle={route.params.subtitle} />,
    []
  );

  const RightHeaderComp = useCallback(() => {
    const showIndicator = matchAny(
      [CRUDState.loading, CRUDState.deleting, CRUDState.updating],
      labels.state
    );
    if (showIndicator) {
      return <HeaderIndicator />;
    } else if (access_level > MemberAccess.GUEST) {
      return <ButtonHeader onPress={onPressNewBtnHandler} icon={IconPlus} />;
    } else {
      return undefined;
    }
  }, [labels, onPressNewBtnHandler, access_level]);

  const updateFilterText = useCallback(
    (text: string) => {
      if (labels.state === CRUDState.idle) {
        setFilterText(text);
      }
    },
    [labels.state]
  );

  //TODO: add label detail page
  const onPressItemHandler = useCallback((item) => {}, []);

  const togglePrioritize = useCallback(
    (item: TLabel) => {
      if (!(labels.state === CRUDState.updating)) {
        if (item.priority === null) {
          const new_label = {
            color: item.color,
            priority: labelsData.prioritized.length,
          };
          dispatch(
            updateProjectLabel({
              project_id,
              identifier: item.id,
              data: new_label,
            })
          )
            .then(unwrapResult)
            .catch(toast.updateError);
        } else {
          const new_label = {
            color: item.color,
            priority: null,
          };
          dispatch(
            updateProjectLabel({
              project_id,
              identifier: item.id,
              data: new_label,
            })
          )
            .then(unwrapResult)
            .catch(toast.updateError);
        }
      }
    },
    [labels.state, labelsData.prioritized.length]
  );

  const onPressEditLabelHandler = useCallback((item: TLabel) => {
    navigation.dispatch(goToEditLabel(project_id, item));
  }, []);

  const toggleSubscribe = useCallback(
    (item: TLabel) => {
      if (!(labels.state === CRUDState.updating)) {
        if (item.subscribed) {
          dispatch(unsubscribeProjectLabel({ project_id, identifier: item.id }))
            .then(unwrapResult)
            .catch(toast.updateError);
        } else {
          dispatch(subscribeProjectLabel({ project_id, identifier: item.id }))
            .then(unwrapResult)
            .catch(toast.updateError);
        }
      }
    },
    [labels.state]
  );

  const onPressDeleteLabel = useCallback(
    (item: TLabel) => {
      if (!(labels.state === CRUDState.deleting)) {
        Alert.alert(
          "Delete Label",
          "Are you sure you want to delete this label?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => {
                dispatch(
                  deleteProjectLabel({ project_id, identifier: item.id })
                )
                  .then(unwrapResult)
                  .catch(toast.updateError);
              },
            },
          ],
          {
            cancelable: true,
          }
        );
      }
    },
    [labels.state]
  );

  const onLongPressItemHandler = useCallback((item: TLabel) => {
    setSelectedLabel(item);
    modal.current?.open();
  }, []);

  const data = useMemo(() => {
    const itemsPrioritized = labelsData.prioritized.filter((item) =>
      item.name.includes(filterText)
    );
    const itemsOther = labelsData.other.filter((item) =>
      item.name.includes(filterText)
    );
    return [
      {
        title: "Prioritized Labels",
        data: itemsPrioritized,
      },
      {
        title: "Other Labels",
        data: itemsOther,
      },
    ];
  }, [labelsData, filterText]);

  const keyExtractor = useCallback((item) => `row-${item.id}-${item.name}`, []);

  const renderItem = useCallback(
    ({ item }) => (
      <LabelRow
        item={item}
        onPress={onPressItemHandler}
        onLongPress={onLongPressItemHandler}
        onPressStar={togglePrioritize}
        onPressSubscribe={toggleSubscribe}
        showStar={access_level > MemberAccess.GUEST}
      />
    ),
    [
      onPressItemHandler,
      onLongPressItemHandler,
      togglePrioritize,
      toggleSubscribe,
      access_level,
    ]
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
    dispatch(fetchMoreProjectLabels({ project_id }));
  }, []);

  return (
    <Container primary={true}>
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
              refreshing={labels.state === CRUDState.loading}
              onRefresh={onRefreshHandler}
            />
          }
          onRealEndReached={onRealEndReached}
          ListFooterComponent={
            labels.state === CRUDState.loading_more ? <Spinner /> : undefined
          }
        />
      </View>
      <Modalvski ref={modal} cancelBtn>
        {selected_label && access_level > MemberAccess.GUEST && (
          <ItemGroup>
            <ItemPressable
              title="Edit"
              onPress={() => onPressEditLabelHandler(selected_label)}
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
                selected_label.priority === null
                  ? "Prioritize"
                  : "Remove priority"
              }
              onPress={() => togglePrioritize(selected_label)}
              renderIcon={() => (
                <IconThemed
                  type="git"
                  size={GENERAL_ICON_SIZE}
                  name={selected_label.priority === null ? "star" : "star-o"}
                />
              )}
            />
            <ItemPressable
              title={selected_label.subscribed ? "Unsubscribe" : "Subscribe"}
              onPress={() => toggleSubscribe(selected_label)}
              renderIcon={() => (
                <IconThemed
                  type="fontawesome"
                  size={GENERAL_ICON_SIZE}
                  name={selected_label.subscribed ? "bell-slash" : "bell"}
                />
              )}
            />
            <ItemPressable
              title="Delete Label"
              titleStyle={{ color: iOSColors.red }}
              onPress={() => onPressDeleteLabel(selected_label)}
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
        )}
        {selected_label && access_level <= MemberAccess.GUEST && (
          <ItemGroup>
            <ItemPressable
              title={selected_label.subscribed ? "Unsubscribe" : "Subscribe"}
              onPress={() => toggleSubscribe(selected_label)}
              renderIcon={() => (
                <IconThemed
                  type="fontawesome"
                  size={GENERAL_ICON_SIZE}
                  name={selected_label.subscribed ? "bell-slash" : "bell"}
                />
              )}
              borderBottom={false}
            />
          </ItemGroup>
        )}
      </Modalvski>
    </Container>
  );
};

export default Labels;
