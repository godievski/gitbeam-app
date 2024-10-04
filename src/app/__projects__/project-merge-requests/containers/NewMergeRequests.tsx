import React, { useState, useCallback } from "react";
import ItemSelect from "../../../../components/Group/ItemSelect";
import ItemGroup from "../../../../components/Group/ItemGroup";
import Header from "../../../../components/Header/Header";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import Container from "../../../../components/Layouts/Container";
import { goToBranchesFromNewMergeRequest } from "../../branches/config/navigation";
import { goToNewMRCreation } from "./NewMRCreation";
import { StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import { KeyboardAwareScrollView } from "../../../../components/Commons/KeyboardAware";
import {
  NewMRScreenParams,
  NEW_MERGE_REQUEST_SCREEN_NAME,
} from "../config/navigation";
import {
  TOAST_TYPES,
  useToast,
} from "../../../../components/Toast/ToastContext";
import ItemOuter from "../../../../components/Group/ItemOuter";
import TextThemed from "../../../../components/Commons/TextThemed";
import { useAppSelector } from "../../../../store/hooks";

interface ScreenProps {}

type NewMRScreenProps = ScreenProps &
  StackScreenTmpProps<NewMRScreenParams, typeof NEW_MERGE_REQUEST_SCREEN_NAME>;

const NewMergeRequests: React.FC<NewMRScreenProps> = ({
  navigation,
  route,
}) => {
  const { ref = "" } = route.params;

  const [target, setTarget] = useState("");
  const [source, setSource] = useState(ref);

  const project = useAppSelector((state) => state.current_project).data!;

  const toast = useToast();

  const createBranch = useCallback(() => {
    if (source.length == 0) {
      toast.updateMessage({
        status: TOAST_TYPES.WARNING,
        message: "Select a Source Branch",
      });
    } else if (target.length == 0) {
      toast.updateMessage({
        status: TOAST_TYPES.WARNING,
        message: "Select a Target Branch",
      });
    } else if (source == target) {
      toast.updateMessage({
        status: TOAST_TYPES.ERROR,
        message: "You must select different branches",
      });
    } else {
      navigation.dispatch(goToNewMRCreation(source, target));
    }
  }, [source, target]);

  const onPressTarget = useCallback(() => {
    navigation.dispatch(
      goToBranchesFromNewMergeRequest(
        project.id,
        target,
        project.name,
        setTarget
      )
    );
  }, [project, target]);

  const onPressSource = useCallback(() => {
    navigation.dispatch(
      goToBranchesFromNewMergeRequest(
        project.id,
        source,
        project.name,
        setSource
      )
    );
  }, [project, source]);

  const renderTitle = useCallback(() => {
    return <TitleHeader title="New Merge Request" />;
  }, []);

  const renderRight = useCallback(() => {
    return <ButtonHeader onPress={createBranch} title="Next" />;
  }, [createBranch]);

  return (
    <Container>
      <Header
        center={renderTitle}
        right={renderRight}
        isModal={true}
        backBtn={true}
      />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        enableOnAndroid={true}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        <ItemGroup>
          <ItemSelect
            label="SOURCE BRANCH"
            value={source.length ? source : "(no branch selected)"}
            onPress={onPressSource}
          />
          <ItemSelect
            label="TARGET BRANCH"
            value={target.length ? target : "(no branch selected)"}
            onPress={onPressTarget}
            borderBottom={false}
          />
        </ItemGroup>
        <ItemOuter>
          <TextThemed type="foot">{`Any conflicts will not be displayed.`}</TextThemed>
        </ItemOuter>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default React.memo(NewMergeRequests);
