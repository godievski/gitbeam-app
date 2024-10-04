import React, { useState, useCallback, useMemo } from "react";
import ItemInput from "../../../../components/Group/ItemInput";
import ItemGroup from "../../../../components/Group/ItemGroup";
import Header from "../../../../components/Header/Header";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";
import Container from "../../../../components/Layouts/Container";
import { StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import { KeyboardAwareScrollView } from "../../../../components/Commons/KeyboardAware";
import { useSelectorUser } from "../../../__profile__/profile/config/selectors";
import {
  TOAST_TYPES,
  useToast,
} from "../../../../components/Toast/ToastContext";
import {
  CommitChangesScreenParams,
  COMMIT_CHANGES_SCREEN_NAME,
} from "../config/navigation";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { getBranchChangesKey } from "../config/utils";
import { commitChanges, selectBranchChanges } from "../config/changesSlice";
import { unwrapResult } from "@reduxjs/toolkit";

type ScreenProps = {};

type CommitChangesProps = ScreenProps &
  StackScreenTmpProps<
    CommitChangesScreenParams,
    typeof COMMIT_CHANGES_SCREEN_NAME
  >;

const CommitChanges: React.FC<CommitChangesProps> = ({ navigation, route }) => {
  const { project_id, branch } = route.params;

  const dispatch = useAppDispatch();

  const key = useMemo(() => getBranchChangesKey(project_id, branch), []);
  const changes = useAppSelector((state) => selectBranchChanges(state)(key));
  const user = useSelectorUser().data;

  const toast = useToast();

  const [author_name, setAuthorName] = useState(user.email);
  const [author_email, setAuthorEmail] = useState(user.name);
  const [message, setMessage] = useState("");

  const commitChangesHandler = useCallback(() => {
    const payload = {
      actions: changes.actions,
      author_email:
        !author_email || author_email.length == 0 ? undefined : author_email,
      author_name:
        !author_name || author_name.length == 0 ? undefined : author_name,
      commit_message: message,
      branch,
    };

    dispatch(commitChanges({ project_id, data: payload }))
      .then(unwrapResult)
      .then((res) => {
        if (res) {
          navigation.goBack();
        } else {
          toast.updateMessage({
            message: "Couldn't push changes",
            status: TOAST_TYPES.ERROR,
          });
        }
      })
      .catch(toast.updateError);
  }, [author_name, author_email, message, branch, project_id, changes]);

  const renderTitle = useCallback(() => <TitleHeader title={"Changes"} />, []);

  const renderRight = useCallback(
    () =>
      changes.committing ? (
        <HeaderIndicator />
      ) : (
        <ButtonHeader onPress={commitChangesHandler} title="Push" />
      ),
    [changes.committing, commitChangesHandler]
  );

  return (
    <Container>
      <Header center={renderTitle} right={renderRight} />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        <ItemGroup>
          <ItemInput
            label={`AUTHOR'S NAME`}
            value={author_name}
            onChangeText={setAuthorName}
            placeholder="(optional)"
          />

          <ItemInput
            label={`AUTHOR'S EMAIL`}
            value={author_email}
            onChangeText={setAuthorEmail}
            placeholder="(optional)"
            borderBottom={false}
          />
        </ItemGroup>

        <ItemGroup>
          <ItemInput
            label="COMMIT MESSAGE"
            value={message}
            onChangeText={setMessage}
            placeholder="Message"
            multiline={true}
            borderBottom={false}
          />
        </ItemGroup>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default React.memo(CommitChanges);
