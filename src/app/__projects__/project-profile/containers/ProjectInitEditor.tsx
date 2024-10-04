import React, { useState, useCallback } from "react";
import Editor from "../../../../components/Tools/Editor";
import Header from "../../../../components/Header/Header";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import {
  goToProjectInitCommit,
  ProjectInitEditorParams,
  PROJECT_INIT_EDITOR_SCREEN_NAME,
} from "../config/navigation";
import { StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import {
  TOAST_TYPES,
  useToast,
} from "../../../../components/Toast/ToastContext";
import Container from "../../../../components/Layouts/Container";

interface ScreenProps {}

type ProjectInitEditorProps = ScreenProps &
  StackScreenTmpProps<
    ProjectInitEditorParams,
    typeof PROJECT_INIT_EDITOR_SCREEN_NAME
  >;

const ProjectInitEditor: React.FC<ProjectInitEditorProps> = ({
  navigation,
  route,
}) => {
  const { file_name } = route.params;

  const title = file_name;
  const [content, setContent] = useState("");
  const toast = useToast();

  const createFile = useCallback(() => {
    if (content.length == 0) {
      return toast.updateMessage({
        status: TOAST_TYPES.WARNING,
        message: "Empty content",
      });
    }
    navigation.dispatch(goToProjectInitCommit(file_name, content));
  }, [file_name, content]);

  const renderTitle = useCallback(() => <TitleHeader title={title} />, [title]);

  const renderRight = useCallback(
    () => <ButtonHeader onPress={createFile} title="Next" />,
    [createFile]
  );

  return (
    <Container>
      <Header center={renderTitle} right={renderRight} />
      <Editor onChangeText={setContent} autoFocus={true} />
    </Container>
  );
};

export default React.memo(ProjectInitEditor);
