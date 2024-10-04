import React, {
  useEffect,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import Header from "../../../../components/Header/Header";
import ButtonHeader, {
  IconPlus,
  IconSearch,
} from "../../../../components/Buttons/ButtonHeader";
import { View, Alert } from "react-native";
import MergeRequestRow from "../components/MergeRequestRow";
import RefreshControlCommon from "../../../../components/RN/RefreshControlCommon";
import Container from "../../../../components/Layouts/Container";
import { CRUDState, StackScreenTmpProps } from "../../../../core/utils";
import { iOSColors } from "react-native-typography";
import {
  goToAcceptMergeRequest,
  goToNewMergeRequest,
  goToFiltersMergeRequests,
} from "../config/navigation";
import TitleHeader from "../../../../components/Header/TitleHeader";
import EmptyState from "../../../../components/Commons/EmptyState";
import {
  TOAST_TYPES,
  ToastContext,
} from "../../../../components/Toast/ToastContext";
import {
  PROJECT_MERGE_REQUESTS_SCREEN_NAME,
  ProjectMergeRequestParams,
} from "../config/navigation";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";
import { GENERAL_ICON_SIZE } from "../../../../core/styles/general";
import {
  RequestStateEvent,
  MergeRequestState,
} from "../../../../core/gitlab/types";
import { Modalvski } from "../../../../components/Modalvski/Modalvski";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemPressable from "../../../../components/Group/ItemPressable";
import IconThemed from "../../../../components/Icons/IconThemed";
import FlatList from "../../../../components/RN/FlatList";
import { TMergeRequest } from "../../../../core/gitlab/types/merge_requests_types";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  deleteMergeRequest,
  fetchMergeRequests,
  fetchMoreMergeRequests,
  selectMergeRequestsByProject,
  updateMergeRequest,
  updateMergeRequestQuery,
} from "../config/mergeRequestsSlice";
import Spinner from "../../../../components/Commons/Spinner";
import { unwrapResult } from "@reduxjs/toolkit";

type Props = {};

type ProjectMergeRequestsProps = Props &
  StackScreenTmpProps<
    ProjectMergeRequestParams,
    typeof PROJECT_MERGE_REQUESTS_SCREEN_NAME
  >;

const ProjectMergeRequests: React.FC<ProjectMergeRequestsProps> = (props) => {
  const { route, navigation } = props;
  const dispatch = useAppDispatch();

  const project_id = route.params.project_id;

  const merge_requests = useAppSelector((state) =>
    selectMergeRequestsByProject(state)(project_id)
  );

  const toast = useContext(ToastContext);
  const modal = useRef<Modalvski>(null);
  const [selected_mr, setSelectedMR] = useState<TMergeRequest>();

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = useCallback(() => {
    dispatch(fetchMergeRequests({ project_id }));
  }, []);

  const onPressPlusBtn = useCallback(() => {
    navigation.dispatch(goToNewMergeRequest());
  }, []);

  const onPressSearchBtn = useCallback(
    () => navigation.dispatch(goToFiltersMergeRequests(project_id)),
    []
  );

  const TitleComp = useCallback(
    () => (
      <TitleHeader
        title={"Merge Requests"}
        subtitle={props.route.params.subtitle}
      />
    ),
    []
  );

  const RightComp = useCallback(() => {
    if (
      merge_requests.state === CRUDState.updating ||
      merge_requests.state === CRUDState.loading ||
      merge_requests.state === CRUDState.deleting
    ) {
      return <HeaderIndicator />;
    } else {
      return (
        <View style={{ flexDirection: "row" }}>
          <ButtonHeader onPress={onPressSearchBtn} icon={IconSearch} />
          <ButtonHeader onPress={onPressPlusBtn} icon={IconPlus} />
        </View>
      );
    }
  }, [onPressPlusBtn, onPressSearchBtn, merge_requests.state]);

  const deleteMR = useCallback((item: TMergeRequest) => {
    Alert.alert(
      "Delete MR",
      "MR will be removed. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            dispatch(deleteMergeRequest({ project_id, identifier: item.iid }))
              .then(unwrapResult)
              .catch((err) => {
                toast.updateMessage({
                  status: TOAST_TYPES.ERROR,
                  message: "Couldn't delete the MR",
                });
              });
          },
          style: "destructive",
        },
      ],
      {
        cancelable: true,
      }
    );
  }, []);

  const updateMRStatus = useCallback(
    async (item: TMergeRequest, state_event: RequestStateEvent) => {
      dispatch(
        updateMergeRequest({
          project_id,
          identifier: item.iid,
          data: { state_event },
        })
      )
        .then(unwrapResult)
        .then((res) => {
          toast.updateMessage({
            status: TOAST_TYPES.NORMAL,
            message: "MR was updated",
          });
        })
        .catch((err) => {
          toast.updateError({
            status: TOAST_TYPES.ERROR,
            message: "Couldn't update the MR",
          });
        });
    },
    []
  );

  const onLongPress = useCallback((item: TMergeRequest) => {
    setSelectedMR(item);
    modal.current?.open();
  }, []);

  const keyExtractor = useCallback((item) => `row-${item.id}`, []);

  const renderItem = useCallback(
    ({ item, index }: { item: TMergeRequest; index: number }) => {
      return <MergeRequestRow item={item} onLongPress={onLongPress} />;
    },
    [onLongPress]
  );

  const onRealEndReached = useCallback(() => {
    dispatch(fetchMoreMergeRequests({ project_id }));
  }, []);

  return (
    <Container>
      <Header center={TitleComp} right={RightComp} />
      <View style={{ flex: 1 }}>
        {merge_requests.state === CRUDState.loading &&
          merge_requests.entities === undefined && (
            <EmptyState loading={true} />
          )}
        {merge_requests.entities !== undefined && (
          <FlatList
            data={merge_requests.entities}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            refreshControl={
              <RefreshControlCommon
                refreshing={merge_requests.state === CRUDState.loading}
                onRefresh={onRefresh}
              />
            }
            ListEmptyComponent={
              <EmptyState
                loading={merge_requests.state === CRUDState.loading}
              />
            }
            ListFooterComponent={
              merge_requests.state === CRUDState.loading_more ? (
                <Spinner />
              ) : (
                undefined
              )
            }
            onRealEndReached={onRealEndReached}
          />
        )}
      </View>
      <Modalvski ref={modal} cancelBtn>
        {selected_mr && (
          <ItemGroup>
            {selected_mr.state == MergeRequestState.OPENED && (
              <ItemPressable
                title="Accep MR"
                onPress={() =>
                  navigation.dispatch(goToAcceptMergeRequest(selected_mr))
                }
              />
            )}
            <ItemPressable
              title={
                selected_mr.state === MergeRequestState.CLOSED
                  ? "Reopen MR"
                  : "Close MR"
              }
              onPress={() => {
                updateMRStatus(
                  selected_mr,
                  selected_mr.state === MergeRequestState.CLOSED
                    ? RequestStateEvent.REOPEN
                    : RequestStateEvent.CLOSE
                );
              }}
            />
            <ItemPressable
              title="Delete MR"
              titleStyle={{ color: iOSColors.red }}
              onPress={() => deleteMR(selected_mr)}
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
      </Modalvski>
    </Container>
  );
};

export default ProjectMergeRequests;
