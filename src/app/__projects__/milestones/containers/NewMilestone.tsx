import React, { useState, useCallback } from "react";
import Header from "../../../../components/Header/Header";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemInput from "../../../../components/Group/ItemInput";
import ItemComponent from "../../../../components/Group/ItemComponent";
import { View } from "react-native";
import moment from "moment";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";
import Container from "../../../../components/Layouts/Container";
import { CRUDState, StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import {
  TOAST_TYPES,
  useToast,
} from "../../../../components/Toast/ToastContext";
import {
  NewMilestoneScreenParams,
  NEW_MILESTONE_SCREEN_NAME,
} from "../config/navigation";
import DatePicker from "../../../../components/Commons/DatePicker";
import { KeyboardAwareScrollView } from "../../../../components/Commons/KeyboardAware";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  addProjectMilestone,
  selectMilestoneByProject,
} from "../config/milestonesSlice";
import { AddMilestoneData } from "../../../../core/gitlab/types/milestones_types";
import { unwrapResult } from "@reduxjs/toolkit";

const DATE_FORMAT = "YYYY-MM-DD";

interface ScreenProps {}

type NewMilestoneScreenProps = ScreenProps &
  StackScreenTmpProps<
    NewMilestoneScreenParams,
    typeof NEW_MILESTONE_SCREEN_NAME
  >;

const NewMilestone: React.FC<NewMilestoneScreenProps> = ({
  navigation,
  route,
}) => {
  const { project_id } = route.params;

  const milestones = useAppSelector((state) =>
    selectMilestoneByProject(state)(project_id)
  );
  const toast = useToast();
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start_date, setStartDate] = useState<string | undefined>(undefined);
  const [due_date, setDueDate] = useState<string | undefined>(undefined);

  const createMilestoneHandler = useCallback(() => {
    const data: AddMilestoneData = {
      title,
      description,
      start_date,
      due_date,
    };

    if (!!data.description && data.description.length == 0) {
      data.description = undefined;
    }

    if (!data.title || data.title.length == 0) {
      return toast.updateMessage({
        status: TOAST_TYPES.WARNING,
        message: "You need a title",
      });
    }

    if (!!data.start_date && !!data.due_date) {
      const s = moment(data.start_date, DATE_FORMAT);
      const d = moment(data.due_date, DATE_FORMAT);
      if (s.isSameOrAfter(d)) {
        return toast.updateMessage({
          status: TOAST_TYPES.WARNING,
          message: "Invalid range date",
        });
      }
    }

    dispatch(addProjectMilestone({ project_id, data: data }))
      .then(unwrapResult)
      .then(() => {
        navigation.goBack();
      })
      .catch(toast.updateError);
  }, [title, description, start_date, due_date, project_id]);

  const renderTitle = useCallback(
    () => <TitleHeader title={"New Milestone"} />,
    []
  );

  const renderRight = useCallback(() => {
    if (milestones.state === CRUDState.creating) {
      return <HeaderIndicator />;
    } else {
      return <ButtonHeader title={"Create"} onPress={createMilestoneHandler} />;
    }
  }, [milestones.state, createMilestoneHandler]);

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
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        <ItemGroup>
          <ItemInput
            label="TITLE"
            placeholder="(required)"
            onChangeText={setTitle}
            value={title}
          />

          {/* TODO: add markdown editor */}
          <ItemInput
            label="DESCRIPTION"
            placeholder="(optional)"
            onChangeText={setDescription}
            value={description!}
          />

          <ItemComponent label="START DATE">
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <DatePicker
                value={start_date}
                placeholder="Select start date"
                format={DATE_FORMAT}
                onChange={setStartDate}
              />
            </View>
          </ItemComponent>

          <ItemComponent label="DUE DATE" borderBottom={false}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <DatePicker
                value={due_date}
                placeholder="Select due date"
                format={DATE_FORMAT}
                onChange={setDueDate}
              />
            </View>
          </ItemComponent>
        </ItemGroup>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default React.memo(NewMilestone);
