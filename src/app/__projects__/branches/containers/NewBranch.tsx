import React, { useState, useCallback } from "react";
import ItemInput from "../../../../components/Group/ItemInput";
import ItemSelect from "../../../../components/Group/ItemSelect";
import ItemGroup from "../../../../components/Group/ItemGroup";
import Header from "../../../../components/Header/Header";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";
import Container from "../../../../components/Layouts/Container";
import { CRUDState, StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import { KeyboardAwareScrollView } from "../../../../components/Commons/KeyboardAware";
import {
  TOAST_TYPES,
  useToast,
} from "../../../../components/Toast/ToastContext";
import {
  goToBranchesFromNewBranch,
  NewBranchScreenParams,
  NEW_BRANCH_SCREEN_NAME,
} from "../config/navigation";
import ItemOuter from "../../../../components/Group/ItemOuter";
import TextThemed from "../../../../components/Commons/TextThemed";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { addBranch, selectBranchesByProject } from "../config/branchesSlice";
import { unwrapResult } from "@reduxjs/toolkit";

interface ScreenProps {}

type NewBranchScreenProps = ScreenProps &
  StackScreenTmpProps<NewBranchScreenParams, typeof NEW_BRANCH_SCREEN_NAME>;

const NewBranch: React.FC<NewBranchScreenProps> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();

  const { ref = "" } = route.params;

  const project = useAppSelector((state) => state.current_project).basic;
  const branches = useAppSelector((state) =>
    selectBranchesByProject(state)(project.id)
  );

  const toast = useToast();

  //states
  const [branch, setBranch] = useState("");
  const [ref_branch, setRefBranch] = useState(() => {
    if (branches.entities) {
      const branch_def = branches.entities.filter((b) => b.default);
      return !ref || ref.length == 0 ? branch_def[0].name : ref ?? "";
    } else {
      return "";
    }
  });

  const createBranchHandler = useCallback(() => {
    if (!branch.length) {
      toast.updateMessage({
        status: TOAST_TYPES.WARNING,
        message: "You need a branch name",
      });
    } else if (!ref_branch.length) {
      toast.updateMessage({
        status: TOAST_TYPES.WARNING,
        message: "Select a source branch",
      });
    } else {
      dispatch(
        addBranch({
          project_id: project.id,
          data: {
            branch,
            ref: ref_branch,
          },
        })
      )
        .then(unwrapResult)
        .then(() => {
          navigation.goBack();
        })
        .catch(toast.updateError);
    }
  }, [project, branch, ref_branch]);

  const onPressSelect = useCallback(() => {
    navigation.dispatch(
      goToBranchesFromNewBranch(
        project.id,
        ref_branch,
        project.name,
        setRefBranch
      )
    );
  }, [ref_branch, project]);

  const renderTitle = useCallback(() => {
    return <TitleHeader title={"New Branch"} />;
  }, []);

  const renderRight = useCallback(() => {
    if (branches.state === CRUDState.creating) {
      return <HeaderIndicator />;
    } else {
      return <ButtonHeader onPress={createBranchHandler} title="Create" />;
    }
  }, [createBranchHandler, branches.state]);

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
          <ItemInput
            label="NAME"
            placeholder="(required)"
            onChangeText={setBranch}
            value={branch}
            borderBottom={false}
          />
        </ItemGroup>

        <ItemGroup>
          <ItemSelect
            label="SOURCE BRANCH"
            value={ref_branch.length ? ref_branch : "(no branch selected)"}
            onPress={onPressSelect}
            borderBottom={false}
          />
        </ItemGroup>

        <ItemOuter>
          <TextThemed type="foot">{`All the changes made will not be copied to the new branch`}</TextThemed>
        </ItemOuter>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default React.memo(NewBranch);
