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
import Container from "../../../../components/Layouts/Container";
import NewMRFooterTitle from "../components/NewMRFooterTitle";
import { goToMilestonesSelection } from "../../milestones/config/navigation";
import { goToLabelsSelection } from "../../labels/config/navigation";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import RadioBtn from "../../../../components/Buttons/RadioBtn";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";
import { CommonActions, StackActions } from "@react-navigation/native";
import {
  CRUDState,
  DispatchProps,
  StackScreenTmpProps,
} from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import { goToProjectMembersSelection } from "../../project-members/config/navigation";
import {
  TOAST_TYPES,
  ToastContext,
} from "../../../../components/Toast/ToastContext";
import TextThemed from "../../../../components/Commons/TextThemed";
import ItemInput from "../../../../components/Group/ItemInput";
import ItemComponent from "../../../../components/Group/ItemComponent";
import ItemSelect from "../../../../components/Group/ItemSelect";
import { KeyboardAwareScrollView } from "../../../../components/Commons/KeyboardAware";
import { Modalvski } from "../../../../components/Modalvski/Modalvski";
import ItemPressable from "../../../../components/Group/ItemPressable";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  addMergeRequest,
  selectMergeRequestsByProject,
} from "../config/mergeRequestsSlice";
import { NewMergeRequestData } from "../../../../core/gitlab/types/merge_requests_types";
import { TMember } from "../../../../core/gitlab/types/members_types";
import { TMilestone } from "../../../../core/gitlab/types/milestones_types";

export const NEW_MERGE_REQUEST_CREATION_SCREEN_NAME =
  "NEW_MERGE_REQUEST_CREATION_SCREEN_NAME";

export type NewMRScreenParams = {
  [NEW_MERGE_REQUEST_CREATION_SCREEN_NAME]: {
    source: string;
    target: string;
  };
};

interface ScreenProps {}

type NewMRScreenProps = ScreenProps &
  DispatchProps &
  StackScreenTmpProps<
    NewMRScreenParams,
    typeof NEW_MERGE_REQUEST_CREATION_SCREEN_NAME
  >;

export const goToNewMRCreation = (source: string, target: string) =>
  CommonActions.navigate({
    name: NEW_MERGE_REQUEST_CREATION_SCREEN_NAME,
    params: {
      source,
      target,
    },
    key: "new-merge-request-creation",
  });

const NewMRCreation: React.FC<NewMRScreenProps> = (props) => {
  const dispatch = useAppDispatch();
  const { route, navigation } = props;
  const { source: source_branch, target: target_branch } = route.params;

  const project = useAppSelector((state) => state.current_project).data!;
  const merge_requests = useAppSelector((state) =>
    selectMergeRequestsByProject(state)(project.id)
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState<TMember | null>(null);
  const [labels, setLabels] = useState<{ [id: string]: string }>({});
  const [milestone, setMilestone] = useState<TMilestone | null>(null);
  const [remove_source_branch, setRemoveSourceBranch] = useState(false);
  const [squash, setSquash] = useState(false);

  const toast = useContext(ToastContext);

  const onPressSubmitBtnHandler = useCallback(() => {
    const labels_keys = Object.keys(labels);
    if (title.length > 0) {
      const data: NewMergeRequestData = {
        id: project.id,
        source_branch: source_branch,
        target_branch: target_branch,
        title: title,
        assignee_id: assignee?.id,
        description: description ? description : undefined,
        labels:
          labels_keys.length > 0
            ? labels_keys.map((l_id) => labels[l_id]).join(",")
            : undefined,
        milestone_id: milestone?.id,
        remove_source_branch: remove_source_branch,
        squash: squash,
      };
      dispatch(addMergeRequest({ project_id: project.id, data: data }))
        .then(() => {
          toast.updateMessage({
            status: TOAST_TYPES.NORMAL,
            message: "Merge request created",
          });
          const pop = StackActions.pop(2);
          navigation.dispatch(pop);
        })
        .catch((err) => {
          //show error
          toast.updateError(err);
        });
    } else {
      toast.updateMessage({
        status: TOAST_TYPES.WARNING,
        message: "You need a title",
      });
    }
  }, [
    project,
    title,
    assignee,
    description,
    labels,
    milestone,
    remove_source_branch,
    squash,
  ]);

  const TitleComp = useCallback(() => {
    return <TitleHeader title={"New Merge Request"} />;
  }, []);

  const RightHeaderComp = useCallback(() => {
    if (merge_requests.state === CRUDState.creating) {
      return <HeaderIndicator />;
    } else {
      return <ButtonHeader onPress={onPressSubmitBtnHandler} title="Submit" />;
    }
  }, [merge_requests.state, onPressSubmitBtnHandler]);

  const addWIPHandler = useCallback(() => {
    if (title.startsWith(" ")) {
      setTitle("WIP:" + title);
    } else {
      setTitle("WIP: " + title);
    }
  }, [title]);

  const removeWIPHandler = useCallback(() => {
    if (title.startsWith("WIP: ")) {
      setTitle(title.substring(5));
    } else if (title.startsWith("WIP:")) {
      setTitle(title.substring(4));
    }
  }, [title]);

  const modalMember = useRef<Modalvski>(null);
  const onPressAssigneeHandler = useCallback(() => {
    modalMember.current?.open();
  }, []);

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

  const toggleRemoveSourceBranch = useCallback(() => {
    setRemoveSourceBranch(!remove_source_branch);
  }, [remove_source_branch]);

  const toggleSquash = useCallback(() => setSquash(!squash), [squash]);

  const label_value = useMemo(() => {
    const label_keys = Object.keys(labels);
    return label_keys.length == 0
      ? "No Label"
      : labels[label_keys[0]] +
          (label_keys.length > 1 ? ` +${label_keys.length - 1} more` : "");
  }, [labels]);

  const assignee_value = useMemo(
    () => (assignee ? assignee.name : "Unassigned"),
    [assignee]
  );

  const milestone_value = useMemo(
    () => (milestone ? milestone.title : "No Milestone"),
    [milestone]
  );

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
            borderBottom={false}
          />
        </ItemGroup>
        <NewMRFooterTitle
          title={title}
          addWIP={addWIPHandler}
          removeWIP={removeWIPHandler}
        />
        <ItemGroup>
          <ItemInput
            label="Description"
            placeholder="Describe the goal of the changes and what reviewers should be aware of."
            value={description}
            onChangeText={setDescription}
            multiline={true}
            borderBottom={false}
          />
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
            borderBottom={false}
          />
        </ItemGroup>
        <ItemGroup label="Merge Options">
          <ItemComponent>
            <TouchableOpacity
              onPress={toggleRemoveSourceBranch}
              activeOpacity={0.5}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  flexWrap: "wrap",
                  flexDirection: "row",
                }}
              >
                <RadioBtn
                  selected={remove_source_branch}
                  onPress={toggleRemoveSourceBranch}
                  type="square"
                />
                <View style={{ flex: 1 }}>
                  <TextThemed
                    style={{ paddingLeft: 6, flex: 1, flexWrap: "wrap" }}
                  >
                    Delete source branch when merge request is accepted.
                  </TextThemed>
                </View>
              </View>
            </TouchableOpacity>
          </ItemComponent>
          <ItemComponent borderBottom={false}>
            <TouchableOpacity onPress={toggleSquash} activeOpacity={0.5}>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  flexWrap: "wrap",
                  flexDirection: "row",
                }}
              >
                <RadioBtn
                  selected={squash}
                  onPress={toggleSquash}
                  type="square"
                />
                <View style={{ flex: 1 }}>
                  <TextThemed
                    style={{ paddingLeft: 6, flexWrap: "wrap", flex: 1 }}
                  >
                    Squash commits when merge request is accepted.
                  </TextThemed>
                </View>
              </View>
            </TouchableOpacity>
          </ItemComponent>
        </ItemGroup>
      </KeyboardAwareScrollView>
      <Modalvski ref={modalMember} cancelBtn>
        <ItemGroup>
          <ItemPressable title="Unassigned" onPress={() => setAssignee(null)} />
          <ItemPressable
            title="Select a Member"
            onPress={() => {
              navigation.dispatch(
                goToProjectMembersSelection(
                  project.id,
                  project.name,
                  assignee ? assignee.id : null,
                  setAssignee
                )
              );
            }}
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
                  project.id,
                  project.name,
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
                goToLabelsSelection(project.id, project.name, labels, setLabels)
              );
            }}
            borderBottom={false}
          />
        </ItemGroup>
      </Modalvski>
    </Container>
  );
};

export default NewMRCreation;
