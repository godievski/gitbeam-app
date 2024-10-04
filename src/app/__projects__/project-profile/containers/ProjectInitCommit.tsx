import React, { useState, useCallback } from "react";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemInput from "../../../../components/Group/ItemInput";
import Header from "../../../../components/Header/Header";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import { StackActions } from "@react-navigation/native";
import { StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import {
  ProjectInitCommitParams,
  PROJECT_INIT_COMMIT_SCREEN_NAME,
} from "../config/navigation";
import {
  TOAST_TYPES,
  useToast,
} from "../../../../components/Toast/ToastContext";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";
import Container from "../../../../components/Layouts/Container";
import { KeyboardAwareScrollView } from "../../../../components/Commons/KeyboardAware";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";

import { createFile } from "../config/currentProjectSlice";

interface ScreenProps {}

export type ProjectInitCommitProps = ScreenProps &
  StackScreenTmpProps<
    ProjectInitCommitParams,
    typeof PROJECT_INIT_COMMIT_SCREEN_NAME
  >;

const ProjectInitCommit: React.FC<ProjectInitCommitProps> = ({
  navigation,
  route,
}) => {
  const { file_name, content } = route.params;

  const dispatch = useAppDispatch();
  const project = useAppSelector((state) => state.current_project);

  const [commit, setCommit] = useState("");
  const [branch, setBranch] = useState("main");

  const toast = useToast();

  const createFileHandler = useCallback(() => {
    if (commit.length == 0) {
      return toast.updateMessage({
        status: TOAST_TYPES.WARNING,
        message: "Don't be shy, write a commit",
      });
    }

    dispatch(
      createFile({
        project_id: project.basic.id,
        file_name,
        content,
        commit_message: commit,
        branch,
      })
    )
      .then((res) => {
        navigation.dispatch(StackActions.pop(3));
      })
      .catch((err) => {
        toast.updateError(err);
      });
  }, [commit, branch, project, file_name, content]);

  const renderTitle = useCallback(() => <TitleHeader title="Commit" />, []);

  const renderRight = useCallback(() => {
    if (project.creating_file) {
      return <HeaderIndicator />;
    } else {
      return <ButtonHeader onPress={createFileHandler} title="Create" />;
    }
  }, [createFileHandler, project.creating_file]);

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
            label="BRANCH NAME"
            onChangeText={setBranch}
            value={branch}
            multiline={true}
            borderBottom={true}
          />
          <ItemInput
            label="COMMIT MESSAGE"
            onChangeText={setCommit}
            value={commit}
            multiline={true}
            borderBottom={false}
          />
        </ItemGroup>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default React.memo(ProjectInitCommit);
