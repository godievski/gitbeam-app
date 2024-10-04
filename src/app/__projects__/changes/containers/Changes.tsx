import React, { useState, useCallback, useMemo } from "react";
import { goToBranchesFromChanges } from "../../branches/config/navigation";
import _ from "lodash";
import { Alert, View } from "react-native";
import ChangesAction from "../components/ChangesAction";
import { MemberAccess } from "../../../../core/gitlab/types";
import Container from "../../../../components/Layouts/Container";
import { DispatchProps, StackScreenTmpProps } from "../../../../core/utils";
import { getPermissionLevel } from "../../../../core/gitlab/api";
import { ChangesScreenParams, CHANGES_SCREEN_NAME } from "../config/navigation";
import EmptyState from "../../../../components/Commons/EmptyState";
import FlatList from "../../../../components/RN/FlatList";
import ChangesHeader from "../components/ChangesHeader";
import ChangesCommitBtn from "../components/ChangesCommitBtn";
import { useTimingTransition } from "react-native-redash";
import { Easing } from "react-native-reanimated";
import { useSelectorUser } from "../../../__profile__/profile/config/selectors";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { ActionChange } from "../../../../core/gitlab/types/repository_files_types";
import {
  deleteMultipleActionChange,
  selectBranchChanges,
} from "../config/changesSlice";
import { getBranchChangesKey } from "../config/utils";
import { unwrapResult } from "@reduxjs/toolkit";
import { useToast } from "../../../../components/Toast/ToastContext";

interface ScreenProps {}

type ChangesProps = ScreenProps &
  DispatchProps &
  StackScreenTmpProps<ChangesScreenParams, typeof CHANGES_SCREEN_NAME>;

const Changes: React.FC<ChangesProps> = ({ navigation, route }) => {
  const { project_id, branch, project_name } = route.params;

  const dispatch = useAppDispatch();

  const toast = useToast();

  const project = useAppSelector((state) => state.current_project).data!;
  const user = useSelectorUser().data;
  const key = useMemo(() => getBranchChangesKey(project_id, branch), []);
  const changes = useAppSelector((state) => selectBranchChanges(state)(key));

  const [actions_delete, setActionsDelete] = useState<{
    [file_path: string]: ActionChange;
  }>({});
  const [editing, setEditing] = useState(false);

  const animation = useTimingTransition(editing, {
    duration: 250,
    easing: Easing.inOut(Easing.ease),
  });

  const goToBranchesFromChangesHandler = useCallback(() => {
    navigation.dispatch(
      goToBranchesFromChanges(project_id, branch, project_name)
    );
  }, []);

  const toggleEditing = useCallback(
    (action?: ActionChange) => {
      const new_editing = !editing;

      const new_actions_delete = !new_editing
        ? {}
        : action && action.file_path
        ? {
            ...actions_delete,
            [action.file_path]: action,
          }
        : {};

      setActionsDelete(new_actions_delete);
      setEditing(new_editing);
    },
    [editing, actions_delete]
  );

  const selectAll = useCallback(() => {
    setActionsDelete(_.keyBy(changes.actions, (action) => action.file_path));
  }, [changes]);

  const deleteChangeSelected = useCallback(() => {
    Alert.alert(
      "Delete Changes",
      "Are you sure you want to delete these changes?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            dispatch(
              deleteMultipleActionChange({
                project_id,
                branch,
                data: _.map(
                  actions_delete,
                  (action: ActionChange) => action.file_path
                ),
              })
            )
              .then(unwrapResult)
              .then(() => {
                toggleEditing();
              })
              .catch(toast.updateError);
          },
          style: "destructive",
        },
      ],
      {
        cancelable: true,
      }
    );
  }, [toggleEditing, actions_delete, project_id, branch]);

  const onLongPress = useCallback(
    (action: ActionChange) => {
      if (!editing) {
        toggleEditing(action);
      }
    },
    [editing, toggleEditing]
  );

  const onPress = useCallback(
    (action: ActionChange) => {
      if (editing) {
        setActionsDelete((old) => {
          if (!old[action.file_path]) {
            return {
              ...old,
              [action.file_path]: action,
            };
          } else {
            return _.omit(old, [action.file_path]);
          }
        });
      } else {
        //TODO: go to preview or something else
      }
    },
    [editing]
  );

  const access_level = useMemo(() => getPermissionLevel(project, user), [
    user,
    project,
  ]);

  const renderItem = useCallback(
    ({ item, index }) => (
      <ChangesAction
        action={item}
        index={index}
        selected={!!actions_delete[item.file_path]}
        animation={animation}
        onLongPress={onLongPress}
        onPress={onPress}
      />
    ),
    [actions_delete, onPress, onLongPress, animation]
  );

  const show_btn =
    changes.actions.length > 0 && access_level >= MemberAccess.DEVELOPER;

  return (
    <Container>
      <ChangesHeader
        editing={editing}
        subtitle={branch}
        selectAll={selectAll}
        deleteChangeSelected={deleteChangeSelected}
        toggleEditing={toggleEditing}
        goToBranchesFromChanges={goToBranchesFromChangesHandler}
      />
      <View style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={show_btn ? { paddingBottom: 100 } : {}}
          keyExtractor={(item) => `item-${item.file_path}`}
          extraData={actions_delete}
          data={changes.actions}
          renderItem={renderItem}
          ListEmptyComponent={<EmptyState />}
        />
      </View>
      <ChangesCommitBtn
        project_id={project_id}
        branch={branch}
        project_name={project_name}
        animation={animation}
        disabled={editing}
        show={changes.actions.length > 0}
      />
    </Container>
  );
};

export default React.memo(Changes);
