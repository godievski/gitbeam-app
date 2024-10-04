import React, { useState, useCallback } from "react";
import Header from "../../../../components/Header/Header";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import moment from "moment";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemInput from "../../../../components/Group/ItemInput";
import ItemComponent from "../../../../components/Group/ItemComponent";
import { View } from "react-native";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";
import Container from "../../../../components/Layouts/Container";
import { CRUDState, StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import {
  EditMilestoneScreenParams,
  EDIT_MILESTONE_SCREEN_NAME,
} from "../config/navigation";
import {
  TOAST_TYPES,
  useToast,
} from "../../../../components/Toast/ToastContext";
import DatePicker from "../../../../components/Commons/DatePicker";
import { KeyboardAwareScrollView } from "../../../../components/Commons/KeyboardAware";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  selectMilestoneByProject,
  updateProjectMilestone,
} from "../config/milestonesSlice";
import { unwrapResult } from "@reduxjs/toolkit";

const DATE_FORMAT = "YYYY-MM-DD";

interface ScreenProps {}

type EditMilestoneScreenProps = ScreenProps &
  StackScreenTmpProps<
    EditMilestoneScreenParams,
    typeof EDIT_MILESTONE_SCREEN_NAME
  >;

const EditMilestone: React.FC<EditMilestoneScreenProps> = ({
  navigation,
  route,
}) => {
  const { project_id, milestone } = route.params;

  const dispatch = useAppDispatch();
  const toast = useToast();
  const milestones = useAppSelector((state) =>
    selectMilestoneByProject(state)(project_id)
  );

  const [title, setTitle] = useState(milestone.title);
  const [description, setDescription] = useState(milestone.description);
  const [start_date, setStartDate] = useState<string | undefined>(
    milestone.start_date
  );
  const [due_date, setDueDate] = useState<string | undefined>(
    milestone.due_date
  );

  const updateMilestoneHandler = useCallback(() => {
    const data: {
      title: string;
      description?: string | null;
      due_date?: string | null;
      start_date?: string | null;
    } = { title, description, due_date, start_date };

    if (!data.description || data.description.length === 0) {
      data.description = null;
    }
    if (!data.start_date) {
      data.start_date = null;
    }
    if (!data.due_date) {
      data.due_date = null;
    }

    if (!data.title || data.title.length === 0) {
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

    dispatch(
      updateProjectMilestone({
        project_id,
        identifier: milestone.id,
        data,
      })
    )
      .then(unwrapResult)
      .then(() => {
        navigation.goBack();
      })
      .catch(toast.updateError);
  }, [title, description, start_date, due_date, project_id, milestone]);

  const renderTitle = useCallback(
    () => <TitleHeader title={"Edit Milestone"} />,
    []
  );

  const renderRight = useCallback(
    () =>
      milestones.state === CRUDState.updating ? (
        <HeaderIndicator />
      ) : (
        <ButtonHeader title={"Update"} onPress={updateMilestoneHandler} />
      ),
    [updateMilestoneHandler, milestones.state]
  );

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
            value={title!}
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

export default React.memo(EditMilestone);
