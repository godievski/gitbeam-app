import React, { useCallback, useState } from "react";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemInput from "../../../../components/Group/ItemInput";
import Header from "../../../../components/Header/Header";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import Container from "../../../../components/Layouts/Container";
import {
  goToProjectInitEditor,
  ProjectInitFilenameParams,
  PROJECT_INIT_FILENAME_SCREEN_NAME,
} from "../config/navigation";
import { StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import {
  TOAST_TYPES,
  useToast,
} from "../../../../components/Toast/ToastContext";
import validFilename from "valid-filename";
import { KeyboardAwareScrollView } from "../../../../components/Commons/KeyboardAware";

interface ScreenProps {}

export type ProjectInitFilenameProps = ScreenProps &
  StackScreenTmpProps<
    ProjectInitFilenameParams,
    typeof PROJECT_INIT_FILENAME_SCREEN_NAME
  >;

const ProjectInitFilename: React.FC<ProjectInitFilenameProps> = ({
  navigation,
  route,
}) => {
  const [file_name, setFileName] = useState(route.params.file_name ?? "");
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

    navigation.dispatch(goToProjectInitEditor(file_name));
  }, [file_name]);

  const renderTitle = useCallback(() => <TitleHeader title={"New File"} />, []);

  const rednerRight = useCallback(
    () => <ButtonHeader onPress={continueCreation} title="Next" />,
    [continueCreation]
  );

  return (
    <Container>
      <Header center={renderTitle} right={rednerRight} />
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

export default React.memo(ProjectInitFilename);
