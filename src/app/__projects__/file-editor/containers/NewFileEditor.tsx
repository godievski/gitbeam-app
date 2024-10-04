import React, { useState, useCallback, useMemo } from "react";
import Editor from "../../../../components/Tools/Editor";
import Header from "../../../../components/Header/Header";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import { StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import {
  NewFileEditorScreenParams,
  NEW_FILE_EDITOR_SCREEN_NAME,
} from "../config/navigation";
import Container from "../../../../components/Layouts/Container";
import {
  saveActionFileWrite,
  selectBranchChanges,
} from "../../changes/config/changesSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { getBranchChangesKey } from "../../changes/config/utils";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";

interface ScreenProps {}

export type NewFileEditorScreenProps = ScreenProps &
  StackScreenTmpProps<
    NewFileEditorScreenParams,
    typeof NEW_FILE_EDITOR_SCREEN_NAME
  >;

const NewFileEditor: React.FC<NewFileEditorScreenProps> = (props) => {
  const dispatch = useAppDispatch();
  const { route, navigation } = props;

  const {
    project_id,
    title,
    branch,
    path,
    file_name,
    content: route_content,
  } = route.params;

  const [content, setContent] = useState(route_content);

  const changes_key = useMemo(() => getBranchChangesKey(project_id, branch), [
    project_id,
    branch,
  ]);
  const changes = useAppSelector((state) =>
    selectBranchChanges(state)(changes_key)
  );

  const saveFile = useCallback(() => {
    dispatch(
      saveActionFileWrite({
        project_id,
        branch,
        data: {
          file_name,
          file_path: path,
          content,
          action: "create",
          encoding: "text",
        },
      })
    )
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
      <Editor content={route_content} onChangeText={setContent} />
    </Container>
  );
};

export default React.memo(NewFileEditor);
