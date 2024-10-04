import React, { useState, useCallback } from "react";
import ItemGroup from "../../../../components/Group/ItemGroup";
import Header from "../../../../components/Header/Header";
import { TouchableOpacity } from "react-native-gesture-handler";
import { View, Text } from "react-native";
import RadioBtn from "../../../../components/Buttons/RadioBtn";
import { getDefaultCommitMsg } from "../config/utils";
import { CRUDState, StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import {
  TOAST_TYPES,
  useToast,
} from "../../../../components/Toast/ToastContext";
import {
  AcceptMRScreenParams,
  ACCEPT_MERGE_REQUEST_SCREEN_NAME,
} from "../config/navigation";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";
import Container from "../../../../components/Layouts/Container";
import TextThemed from "../../../../components/Commons/TextThemed";
import ItemComponent from "../../../../components/Group/ItemComponent";
import ItemInput from "../../../../components/Group/ItemInput";
import { KeyboardAwareScrollView } from "../../../../components/Commons/KeyboardAware";
import { HttpGitlabError } from "../../../../core/gitlab/utils";
import Button from "../../../../components/Buttons/Button";
import {
  GENERAL_CONTAINER_PADDING_HORIZONTAL,
  GENERAL_CONTAINER_PADDING_VERTICAL,
} from "../../../../core/styles/general";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  acceptMergeRequest,
  selectMergeRequestsByProject,
} from "../config/mergeRequestsSlice";
import { unwrapResult } from "@reduxjs/toolkit";

interface ScreenProps {}
type AcceptMRScreenProps = ScreenProps &
  StackScreenTmpProps<
    AcceptMRScreenParams,
    typeof ACCEPT_MERGE_REQUEST_SCREEN_NAME
  >;

const AcceptMergeRequest: React.FC<AcceptMRScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) => state.current_project).data!;
  const merge_requests = useAppSelector((state) =>
    selectMergeRequestsByProject(state)(project.id)
  );
  const toast = useToast();

  const { mr_item } = route.params;

  const [merge_commit_message, setMergeMessage] = useState(() =>
    getDefaultCommitMsg(mr_item)
  );
  const [squash_commit_message, setSquashMessage] = useState("");
  const [squash, setSquash] = useState(mr_item.squash ?? false);
  const [should_remove_source_branch, setRemoveBranch] = useState(
    mr_item.should_remove_source_branch ?? false
  );
  const [merge_when_pipeline_succeeds, setPipeline] = useState(
    mr_item.merge_when_pipeline_succeeds ?? false
  );

  const acceptMR = useCallback(() => {
    const data = {
      merge_commit_message: merge_commit_message
        ? merge_commit_message
        : undefined,
      squash_commit_message:
        squash && squash_commit_message ? squash_commit_message : undefined,
      squash,
      should_remove_source_branch,
      merge_when_pipeline_succeeds,
    };

    dispatch(
      acceptMergeRequest({
        project_id: project.id,
        entity_iid: mr_item.iid,
        data,
      })
    )
      .then(unwrapResult)
      .then((res) => {
        toast.updateMessage({
          status: TOAST_TYPES.NORMAL,
          message: "MR accepted",
        });
        navigation.goBack();
      })
      .catch((err: HttpGitlabError) => {
        if (err) {
          let err_msg = "";
          if (err.status == 405) {
            err_msg =
              "Method not allowed.\nPossible reasons: Work in Progress, Closed, Pipeline Pending Completion, or Failed while requiren Success";
          } else if (err.status == 406) {
            err_msg = "MR has some conflicts and cannot be merged";
          } else if (err.status == 409) {
            err_msg = "SHA does not match HEAD of source branch";
          } else if (err.status == 401) {
            err_msg = "You don't have permissions to accept this MR";
          } else {
            err_msg = "Unknown error, try later";
          }
          toast.updateMessage({
            status: TOAST_TYPES.ERROR,
            message: err_msg,
          });
        }
      });
  }, [
    project,
    mr_item,
    merge_commit_message,
    squash,
    squash_commit_message,
    should_remove_source_branch,
    merge_when_pipeline_succeeds,
  ]);

  const toggleSquash = useCallback(() => {
    setSquash((old) => !old);
  }, []);

  const toggleRemoveSourceBranch = useCallback(() => {
    setRemoveBranch((old) => !old);
  }, []);

  const togglePipeline = useCallback(() => {
    setPipeline((old) => !old);
  }, []);

  const renderTitle = useCallback(() => {
    return <TitleHeader title={"New Merge Request"} />;
  }, []);

  const rightComp = useCallback(
    () =>
      merge_requests.state === CRUDState.updating ? (
        <HeaderIndicator />
      ) : (
        undefined
      ),
    [merge_requests.state]
  );

  return (
    <Container>
      <Header
        center={renderTitle}
        right={rightComp}
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
            label="Merge commit message"
            value={merge_commit_message}
            onChangeText={setMergeMessage}
            borderBottom={false}
          />
        </ItemGroup>

        <ItemGroup>
          <ItemComponent borderBottom={squash}>
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
                  <TextThemed style={{ paddingLeft: 6 }}>
                    Squash commits
                  </TextThemed>
                </View>
              </View>
            </TouchableOpacity>
          </ItemComponent>
          {squash && (
            <ItemInput
              label="Squash commit message"
              value={squash_commit_message}
              onChangeText={setSquashMessage}
              borderBottom={false}
            />
          )}
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
                  selected={should_remove_source_branch}
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
            <TouchableOpacity onPress={togglePipeline} activeOpacity={0.5}>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  flexWrap: "wrap",
                  flexDirection: "row",
                }}
              >
                <RadioBtn
                  selected={merge_when_pipeline_succeeds}
                  onPress={togglePipeline}
                  type="square"
                />
                <View style={{ flex: 1 }}>
                  <TextThemed
                    style={{ paddingLeft: 6, flex: 1, flexWrap: "wrap" }}
                  >
                    Merge the MR when the pipeline succeeds.
                  </TextThemed>
                </View>
              </View>
            </TouchableOpacity>
          </ItemComponent>
        </ItemGroup>
        <View
          style={{
            paddingVertical: GENERAL_CONTAINER_PADDING_VERTICAL,
            paddingHorizontal: GENERAL_CONTAINER_PADDING_HORIZONTAL,
            marginTop: 20,
            width: "100%",
          }}
        >
          <Button
            style={{ width: "100%" }}
            onPress={acceptMR}
            disabled={merge_requests.state === CRUDState.updating}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
              MERGE
            </Text>
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default React.memo(AcceptMergeRequest);
