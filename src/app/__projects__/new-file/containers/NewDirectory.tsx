import React, { useState, useCallback, useMemo } from "react";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemInput from "../../../../components/Group/ItemInput";
import Header from "../../../../components/Header/Header";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import Container from "../../../../components/Layouts/Container";
import { CRUDState, StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import { useToast } from "../../../../components/Toast/ToastContext";
import validFilename from "valid-filename";
import ItemStatic from "../../../../components/Group/ItemStatic";
import { TOAST_TYPES } from "../../../../components/Toast/ToastContext";
import { KeyboardAwareScrollView } from "../../../../components/Commons/KeyboardAware";
import {
  NEW_DIRECTORY_SCREEN_NAME,
  NewDirectoryScreenParams,
} from "../config/navigation";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  createNewDirectory,
  fetchSourceCode,
  selectSourceCodeTree,
} from "../../source-code/config/sourceCodeSlice";
import { getKeySourceCodeTree } from "../../source-code/config/utils";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";

interface ScreenProps {}

type NewDirectoryScreenProps = ScreenProps &
  StackScreenTmpProps<
    NewDirectoryScreenParams,
    typeof NEW_DIRECTORY_SCREEN_NAME
  >;

const NewDirectory: React.FC<NewDirectoryScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useAppDispatch();
  const { branch, path, current_files } = route.params;

  const [directory_name, setDirectoryName] = useState("");
  const [commit_message, setCommit] = useState("");
  const project = useAppSelector((state) => state.current_project).data!;
  const project_id = project.id;

  const key_tree = useMemo(
    () => getKeySourceCodeTree({ project_id, ref: branch, path }),
    []
  );

  const source_code = useAppSelector((state) =>
    selectSourceCodeTree(state)(key_tree)
  );

  const toast = useToast();

  const createHandler = useCallback(() => {
    if (source_code.state === CRUDState.creating) {
      return;
    }

    if (directory_name.length == 0) {
      return toast.updateMessage({
        status: TOAST_TYPES.WARNING,
        message: "Enter a directory name",
      });
    }

    if (!validFilename(directory_name)) {
      return toast.updateMessage({
        status: TOAST_TYPES.ERROR,
        message: "Invalid directory name",
      });
    }

    if (current_files.find((f) => f.name == directory_name)) {
      return toast.updateMessage({
        status: TOAST_TYPES.ERROR,
        message: "The name already in use",
      });
    }

    if (commit_message.length == 0) {
      return toast.updateMessage({
        status: TOAST_TYPES.ERROR,
        message: "Enter a commit message",
      });
    }

    dispatch(
      createNewDirectory({
        project_id,
        ref: branch,
        path,
        directory_name,
        commit_message,
      })
    )
      .then(unwrapResult)
      .then(() => {
        toast.updateMessage({
          status: TOAST_TYPES.NORMAL,
          message: "Directory created",
        });
        dispatch(fetchSourceCode({ project_id, ref: branch, path }));
        navigation.goBack();
      })
      .catch(toast.updateError);
  }, [
    commit_message,
    directory_name,
    project_id,
    branch,
    path,
    source_code.state,
  ]);

  const renderTitle = useCallback(
    () => <TitleHeader title={"New Directory"} />,
    []
  );

  const renderRight = useCallback(
    () =>
      source_code.state === CRUDState.creating ? (
        <HeaderIndicator />
      ) : (
        <ButtonHeader onPress={createHandler} title={"Create"} />
      ),
    [source_code.state, createHandler]
  );

  return (
    <Container>
      <Header center={renderTitle} right={renderRight} />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        enableOnAndroid={true}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        <ItemGroup>
          <ItemInput
            label="FOLDER NAME"
            onChangeText={setDirectoryName}
            value={directory_name}
          />
          <ItemInput
            label="COMMIT MESSAGE"
            onChangeText={setCommit}
            value={commit_message}
            multiline={true}
          />
          <ItemStatic
            value={branch}
            label="TARGET BRANCH"
            borderBottom={false}
          />
        </ItemGroup>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default NewDirectory;
