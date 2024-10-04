import React, { useState, useCallback, useMemo } from "react";
import Editor from "../../../../components/Tools/Editor";
import Header from "../../../../components/Header/Header";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import { StackActions } from "@react-navigation/native";
import { StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import {
  NewFileContentParams,
  NEW_FILE_CONTENT_SCREEN_NAME,
} from "../config/navigation";
import {
  TOAST_TYPES,
  useToast,
} from "../../../../components/Toast/ToastContext";
import Container from "../../../../components/Layouts/Container";
import { ActionChange } from "../../../../core/gitlab/types/repository_files_types";
import {
  saveActionFileWrite,
  selectBranchChanges,
} from "../../changes/config/changesSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { getBranchChangesKey } from "../../changes/config/utils";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";

interface ScreenProps {}

type NewFileContentProps = ScreenProps &
  StackScreenTmpProps<
    NewFileContentParams,
    typeof NEW_FILE_CONTENT_SCREEN_NAME
  >;

const NewFileContent: React.FC<NewFileContentProps> = ({
  navigation,
  route,
}) => {
  const { file_name, project_id, branch, path } = route.params;
  const title = file_name;

  const [content, setContent] = useState("");
  const toast = useToast();
  const dispatch = useAppDispatch();

  const changes_key = useMemo(() => getBranchChangesKey(project_id, branch), [
    project_id,
    branch,
  ]);
  const changes = useAppSelector((state) =>
    selectBranchChanges(state)(changes_key)
  );

  const createFile = useCallback(() => {
    const data: ActionChange = {
      file_name: file_name,
      file_path: path ? `${path}/${file_name}` : file_name,
      action: "create",
      content: content,
      encoding: "text",
    };

    if (content.length == 0) {
      return toast.updateMessage({
        status: TOAST_TYPES.WARNING,
        message: "Empty content",
      });
    }

    dispatch(saveActionFileWrite({ project_id, branch, data }))
      .then(unwrapResult)
      .then(() => {
        navigation.dispatch(StackActions.pop(2));
      })
      .catch((err) => {
        toast.updateMessage({
          status: TOAST_TYPES.ERROR,
          message: "Couldn't save the content, report it.",
        });
      });
  }, [content, file_name, project_id, branch, path]);

  const renderTitle = useCallback(() => <TitleHeader title={title} />, [title]);

  const renderRight = useCallback(
    () =>
      changes.fs_state === "writting" ? (
        <HeaderIndicator />
      ) : (
        <ButtonHeader onPress={createFile} title="Create" />
      ),
    [createFile, changes.fs_state]
  );

  return (
    <Container>
      <Header center={renderTitle} right={renderRight} />
      <Editor onChangeText={setContent} />
    </Container>
  );
};

export default React.memo(NewFileContent);
