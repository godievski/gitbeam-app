import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from "react";
import { shallowEqual } from "react-redux";
import CommitsList from "../components/CommitsList";
import { goToBranchesFromCommits } from "../../branches/config/navigation";
import IconGit from "../../../../components/Icons/IconGit";
import RefreshControlCommon from "../../../../components/RN/RefreshControlCommon";
import Header from "../../../../components/Header/Header";
import { View } from "react-native";
import Container from "../../../../components/Layouts/Container";
import Spinner from "../../../../components/Commons/Spinner";
import { StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import { CommitsScreenParams, COMMITS_SCREEN_NAME } from "../config/navigation";
import { GENERAL_ICON_SIZE } from "../../../../core/styles/general";

import {
  TOAST_TYPES,
  ToastContext,
} from "../../../../components/Toast/ToastContext";
import Clipboard from "@react-native-community/clipboard";
import { Modalvski } from "../../../../components/Modalvski/Modalvski";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemPressable from "../../../../components/Group/ItemPressable";
import IconThemed from "../../../../components/Icons/IconThemed";
import { goToCommitDiff } from "../../commit-diff/config/navigation";
import { TCommit } from "../../../../core/gitlab/types/commits_types";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  fetchCommits,
  fetchMoreCommits,
  selectCommitsByProject,
} from "../config/commitsSlice";
import EmptyState from "../../../../components/Commons/EmptyState";

interface ScreenProps {}

type CommitsScreenProps = ScreenProps &
  StackScreenTmpProps<CommitsScreenParams, typeof COMMITS_SCREEN_NAME>;

const Commits: React.FC<CommitsScreenProps> = (props) => {
  const dispatch = useAppDispatch();
  const { route, navigation } = props;

  const { project_id, branch, project_name } = route.params;

  const commits = useAppSelector(
    (state) => selectCommitsByProject(state)(project_id),
    shallowEqual
  );

  const toast = useContext(ToastContext);

  const modal = useRef<Modalvski>(null);

  const [commit_selected, setCommitSelected] = useState<TCommit>();

  const onRefresh = useCallback(() => {
    dispatch(fetchCommits({ project_id, branch }));
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  const onPressItemHandler = useCallback((item: TCommit) => {
    navigation.dispatch(
      goToCommitDiff({
        project_id,
        project_name,
        commit: item,
      })
    );
  }, []);

  const copySHAHandler = useCallback((item: TCommit) => {
    Clipboard.setString(item.id);
    toast.updateMessage({
      status: TOAST_TYPES.NORMAL,
      message: "Coppied",
    });
  }, []);

  const onLongPressHandler = useCallback((item: TCommit) => {
    setCommitSelected(item);
    modal.current?.open();
  }, []);

  const onRealEndReached = useCallback(() => {
    dispatch(fetchMoreCommits({ project_id, branch }));
  }, []);

  const Footer = useCallback(() => {
    const { loading_more, next_page } = commits;
    if (loading_more === "pending" && next_page.length > 0) {
      return <Spinner />;
    } else {
      return null;
    }
  }, [commits.loading_more, commits.next_page]);

  const TitleHeaderComp = useCallback(() => {
    return <TitleHeader title={"Commits"} subtitle={route.params.branch} />;
  }, []);

  const goToBranchesFromCommitsHandler = useCallback(() => {
    const { project_id, project_name, branch } = route.params;
    navigation.dispatch(
      goToBranchesFromCommits(project_id, branch, project_name)
    );
  }, []);

  const RightHeader = useCallback(() => {
    return (
      <ButtonHeader
        onPress={goToBranchesFromCommitsHandler}
        icon={
          <IconGit
            name="branch"
            size={18}
            color="#fff"
            style={{ paddingHorizontal: 6 }}
          />
        }
      />
    );
  }, [goToBranchesFromCommitsHandler]);

  return (
    <Container>
      <Header center={TitleHeaderComp} right={RightHeader} />
      <View style={{ flex: 1 }}>
        {commits.loading === "pending" && commits.entities === null && (
          <EmptyState loading={true} />
        )}
        {commits.entities !== null && (
          <CommitsList
            items={commits.entities}
            onPressItem={onPressItemHandler}
            onLongPress={onLongPressHandler}
            refreshControl={
              <RefreshControlCommon
                refreshing={commits.loading == "pending"}
                onRefresh={onRefresh}
              />
            }
            refreshing={commits.loading == "pending"}
            renderFooter={Footer}
            onRealEndReached={onRealEndReached}
          />
        )}
      </View>
      <Modalvski ref={modal} cancelBtn>
        <ItemGroup>
          <ItemPressable
            title="Copy commit SHA"
            onPress={() => {
              commit_selected && copySHAHandler(commit_selected);
            }}
            renderIcon={() => (
              <IconThemed
                type="fontawesome"
                name="clipboard"
                size={GENERAL_ICON_SIZE}
              />
            )}
            borderBottom={false}
          />
        </ItemGroup>
      </Modalvski>
    </Container>
  );
};

export default Commits;
