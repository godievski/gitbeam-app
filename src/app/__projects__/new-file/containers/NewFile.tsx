import React, { useCallback, useState } from "react";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemInput from "../../../../components/Group/ItemInput";
import Header from "../../../../components/Header/Header";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import Container from "../../../../components/Layouts/Container";
import { StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import {
  TOAST_TYPES,
  useToast,
} from "../../../../components/Toast/ToastContext";
import { goToNewFileContent } from "../config/navigation";
import {
  NewFileScreenParams,
  NEW_FILE_SCREEN_NAME,
} from "../config/navigation";
import validFilename from "valid-filename";
import { KeyboardAwareScrollView } from "../../../../components/Commons/KeyboardAware";

interface ScreenProps {}

interface ScreenState {
  file_name: string;
}

export type NewFileScreenProps = ScreenProps &
  StackScreenTmpProps<NewFileScreenParams, typeof NEW_FILE_SCREEN_NAME>;

export type NewFileState = ScreenState;

const NewFile: React.FC<NewFileScreenProps> = ({ navigation, route }) => {
  const { branch, path, current_files, project_id } = route.params;

  const [file_name, setFileName] = useState("");

  const toast = useToast();

  const continueCreation = useCallback(() => {
    if (file_name.length == 0) {
      return toast.updateMessage({
        status: TOAST_TYPES.WARNING,
        message: "Enter a file name",
      });
    }

    if (!validFilename(file_name)) {
      return toast.updateMessage({
        status: TOAST_TYPES.ERROR,
        message: "Invalid file name",
      });
    }

    if (current_files.find((f) => f.name == file_name)) {
      return toast.updateMessage({
        status: TOAST_TYPES.ERROR,
        message: "File name already in use",
      });
    }

    navigation.dispatch(
      goToNewFileContent(branch, path, file_name, project_id)
    );
  }, [file_name, branch, path, project_id, current_files]);

  const renderTitle = useCallback(() => <TitleHeader title={"New File"} />, []);

  const renderRight = useCallback(
    () => <ButtonHeader onPress={continueCreation} title="Next" />,
    [continueCreation]
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
            label="FILE NAME"
            onChangeText={setFileName}
            value={file_name}
            borderBottom={false}
          />
        </ItemGroup>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default React.memo(NewFile);
