import React, {
  useState,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from "react";
import ItemGroup from "../../../../components/Group/ItemGroup";
import Header from "../../../../components/Header/Header";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import { goToProjectMembersSelection } from "../../project-members/config/navigation";
import { goToMilestonesSelection } from "../../milestones/config/navigation";
import { goToLabelsSelection } from "../../labels/config/navigation";
import { View } from "react-native";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";
import { CRUDState, StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import { TouchableOpacity } from "react-native-gesture-handler/touchables";
import {
  TOAST_TYPES,
  ToastContext,
} from "../../../../components/Toast/ToastContext";
import RadioBtn from "../../../../components/Buttons/RadioBtn";
import {
  NewIssueScreenParams,
  NEW_ISSUE_SCREEN_NAME,
} from "../config/navigation";
import Container from "../../../../components/Layouts/Container";
import TextThemed from "../../../../components/Commons/TextThemed";
import DatePicker from "../../../../components/Commons/DatePicker";
import ItemInput from "../../../../components/Group/ItemInput";
import ItemComponent from "../../../../components/Group/ItemComponent";
import ItemSelect from "../../../../components/Group/ItemSelect";
import { KeyboardAwareScrollView } from "../../../../components/Commons/KeyboardAware";
import { Modalvski } from "../../../../components/Modalvski/Modalvski";
import ItemPressable from "../../../../components/Group/ItemPressable";
import {
  ThunkDispatchType,
  useAppDispatch,
  useAppSelector,
} from "../../../../store/hooks";
import { addIssue, selectIssuesByProject } from "../config/issuesSlice";
import { shallowEqual } from "react-redux";

import { unwrapResult } from "@reduxjs/toolkit";
import { NewIssueData } from "../../../../core/gitlab/types/issues_types";
import { TMember } from "../../../../core/gitlab/types/members_types";
import { TMilestone } from "../../../../core/gitlab/types/milestones_types";

interface ScreenProps {}

type NewIssueScreenProps = ScreenProps &
  StackScreenTmpProps<NewIssueScreenParams, typeof NEW_ISSUE_SCREEN_NAME>;

const DATE_FORMAT = "YYYY-MM-DD";

const NewIssue: React.FC<NewIssueScreenProps> = (props) => {
  const dispatch: ThunkDispatchType = useAppDispatch();
  // States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState<TMember | null>(null);
  const [labels, setLabels] = useState<{ [id: string]: string }>({});
  const [milestone, setMilestone] = useState<TMilestone | null>(null);
  const [due_date, setDueDate] = useState<string | undefined>(undefined);
  const [confidential, setConfidential] = useState(false);

  const { navigation, route } = props;

  const { project_id, project_name } = route.params;
  const issues = useAppSelector(
    (state) => selectIssuesByProject(state)(project_id),
    shallowEqual
  );

  const toast = useContext(ToastContext);

  const onPressSubmitBtnHandler = useCallback(async () => {
    const labels_keys = Object.keys(labels);
    if (title.length != 0) {
      const new_issue: NewIssueData = {
        id: project_id,
        title: title,
        assignee_ids: assignee ? [assignee.id] : undefined,
        description: !!description ? description : undefined,
        labels:
          labels_keys.length > 0
            ? labels_keys.map((l_id) => labels[l_id]).join(",")
            : undefined,
        milestone_id: milestone?.id,
        confidential: confidential,
        due_date: due_date ?? undefined,
      };

      try {
        const res = await dispatch(
          addIssue({
            project_id,
            data: new_issue,
          })
        );
        unwrapResult(res);
        toast.updateMessage({
          status: TOAST_TYPES.NORMAL,
          message: "Issue created",
        });
        navigation.goBack();
      } catch (e) {
        toast.updateError(e);
      }
    } else {
      toast.updateMessage({
        status: TOAST_TYPES.WARNING,
        message: "You need a title",
      });
    }
  }, [labels, title, assignee, description, milestone, confidential, due_date]);

  const TitleComp = useCallback(() => {
    return <TitleHeader title={"New Issue"} subtitle={project_name} />;
  }, []);

  const RightHeaderComp = useCallback(() => {
    if (issues.state === CRUDState.creating) {
      return <HeaderIndicator />;
    } else {
      return <ButtonHeader onPress={onPressSubmitBtnHandler} title="Submit" />;
    }
  }, [onPressSubmitBtnHandler, issues.state]);

  const modalAssignee = useRef<Modalvski>(null);
  const onPressAssigneeHandler = useCallback(() => {
    modalAssignee.current?.open();
  }, []);

  const toggleConfidential = useCallback(() => {
    setConfidential(!confidential);
  }, [confidential]);

  //TODO: show options "add milestone", "manage milestone"
  const modalMilestone = useRef<Modalvski>(null);
  const onPressMilestoneHandler = useCallback(() => {
    modalMilestone.current?.open();
  }, []);

  //TODO: show options "add label", "manage labels"
  const modalLabel = useRef<Modalvski>(null);
  const onPressLabelsHandler = useCallback(() => {
    modalLabel.current?.open();
  }, []);

  const assignee_value = useMemo(
    () => (assignee ? assignee.name : "Unassigned"),
    [assignee]
  );

  const milestone_value = useMemo(
    () => (milestone ? milestone.title : "No Milestone"),
    [milestone]
  );

  const label_value = useMemo(() => {
    const label_keys = Object.keys(labels);
    return label_keys.length == 0
      ? "No Label"
      : labels[label_keys[0]] +
          (label_keys.length > 1 ? ` +${label_keys.length - 1} more` : "");
  }, [labels]);

  return (
    <Container>
      <Header
        center={TitleComp}
        right={RightHeaderComp}
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
            label="Title"
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <ItemInput
            label="Description"
            placeholder="Write a comment..."
            value={description}
            onChangeText={setDescription}
            multiline={true}
          />
          <ItemComponent borderBottom={false}>
            <TouchableOpacity
              onPress={toggleConfidential}
              activeOpacity={0.5}
              style={{ width: "100%" }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <RadioBtn
                  selected={confidential}
                  onPress={toggleConfidential}
                  type="square"
                />
                <View style={{ flex: 1 }}>
                  <TextThemed
                    style={{
                      paddingLeft: 6,
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    This issue is confidential and should only be visible to
                    team members with at least Reporter access.
                  </TextThemed>
                </View>
              </View>
            </TouchableOpacity>
          </ItemComponent>
        </ItemGroup>
        <ItemGroup>
          <ItemSelect
            label="Assigne"
            value={assignee_value}
            onPress={onPressAssigneeHandler}
          />
          <ItemSelect
            label="Milestone"
            value={milestone_value}
            onPress={onPressMilestoneHandler}
          />
          <ItemSelect
            label="Labels"
            value={label_value}
            onPress={onPressLabelsHandler}
          />
          <ItemComponent label="Due Date" borderBottom={false}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <DatePicker
                value={due_date}
                placeholder="Select start date"
                format={DATE_FORMAT}
                onChange={setDueDate}
              />
            </View>
          </ItemComponent>
        </ItemGroup>
      </KeyboardAwareScrollView>
      <Modalvski ref={modalAssignee} cancelBtn>
        <ItemGroup>
          <ItemPressable title="Unassigned" onPress={() => setAssignee(null)} />
          <ItemPressable
            title="Select a Member"
            onPress={() =>
              navigation.dispatch(
                goToProjectMembersSelection(
                  project_id,
                  project_name,
                  assignee ? assignee.id : null,
                  setAssignee
                )
              )
            }
            borderBottom={false}
          />
        </ItemGroup>
      </Modalvski>
      <Modalvski ref={modalMilestone} cancelBtn>
        <ItemGroup>
          <ItemPressable
            title="No Milestone"
            onPress={() => setMilestone(null)}
          />
          <ItemPressable
            title="Select a Milestone"
            onPress={() => {
              navigation.dispatch(
                goToMilestonesSelection(
                  project_id,
                  project_name,
                  milestone ? milestone.id : null,
                  setMilestone
                )
              );
            }}
            borderBottom={false}
          />
        </ItemGroup>
      </Modalvski>
      <Modalvski ref={modalLabel} cancelBtn>
        <ItemGroup>
          <ItemPressable title="No Label" onPress={() => setLabels({})} />
          <ItemPressable
            title="Select Labels"
            onPress={() => {
              navigation.dispatch(
                goToLabelsSelection(project_id, project_name, labels, setLabels)
              );
            }}
            borderBottom={false}
          />
        </ItemGroup>
      </Modalvski>
    </Container>
  );
};

export default NewIssue;
