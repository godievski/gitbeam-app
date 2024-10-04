import React, { useState, useCallback, useMemo } from "react";
import Editor from "../../../../components/Tools/Editor";
import Header from "../../../../components/Header/Header";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import { StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import {
  FileEditorScreenParams,
  FILE_EDITOR_SCREEN_NAME,
} from "../config/navigation";
import Container from "../../../../components/Layouts/Container";
import { ActionChange } from "../../../../core/gitlab/types/repository_files_types";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  saveActionFileWrite,
  selectBranchChanges,
} from "../../changes/config/changesSlice";
import { getBranchChangesKey } from "../../changes/config/utils";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";

interface ScreenProps {}

export type FileEditorScreenProps = ScreenProps &
  StackScreenTmpProps<FileEditorScreenParams, typeof FILE_EDITOR_SCREEN_NAME>;

const FileEditor: React.FC<FileEditorScreenProps> = (props) => {
  const dispatch = useAppDispatch();
  const { navigation, route } = props;
  const {
    project_id,
    branch,
    title,
    file_name,
    last_commit_id,
    path,
    content: route_content = "",
  } = route.params;

  const changes_key = useMemo(() => getBranchChangesKey(project_id, branch), [
    project_id,
    branch,
  ]);
  const changes = useAppSelector((state) =>
    selectBranchChanges(state)(changes_key)
  );

  const [content, setContent] = useState(route_content ?? "");

  const saveFile = useCallback(() => {
    const data: ActionChange = {
      file_name: file_name,
      file_path: path,
      action: "update",
      content: content,
      encoding: "text",
      last_commit_id: last_commit_id,
    };

    dispatch(saveActionFileWrite({ project_id, branch, data }))
      .then(() => {
        navigation.goBack();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [content]);

  const TitleComp = useCallback(() => <TitleHeader title={title} />, []);

  const RightComp = useCallback(
    () =>
      changes.fs_state === "writting" ? (
        <HeaderIndicator />
      ) : (
        <ButtonHeader title="Save" onPress={saveFile} />
      ),
    [saveFile, changes.fs_state]
  );

  return (
    <Container>
      <Header center={TitleComp} right={RightComp} />
      <Editor content={route_content ?? ""} onChangeText={setContent} />
    </Container>
  );
};

export default FileEditor;
