import React, { useState, useCallback, useEffect, useMemo } from "react";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import BranchList from "../components/BranchList";
import { View } from "react-native";
import {
  COMMITS_SCREEN_NAME,
  goToCommits,
} from "../../commits/config/navigation";
import {
  CHANGES_SCREEN_NAME,
  goToChanges,
} from "../../changes/config/navigation";
import RefreshControlCommon from "../../../../components/RN/RefreshControlCommon";
import Header from "../../../../components/Header/Header";
import Container from "../../../../components/Layouts/Container";
import { StackActions } from "@react-navigation/native";
import { CRUDState, StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import {
  BranchesSelectionScreenParams,
  BRANCHES_SELECTION_SCREEN_NAME,
} from "../config/navigation";
import {
  goToSourceCode,
  SOURCE_CODE_SCREEN_NAME,
} from "../../source-code/config/navigation";
import {
  FILTERS_MERGE_REQUESTS_SCREEN_NAME,
  NEW_MERGE_REQUEST_SCREEN_NAME,
} from "../../project-merge-requests/config/navigation";
import { NEW_BRANCH_SCREEN_NAME } from "../config/navigation";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  fetchBranches,
  fetchMoreBranches,
  selectBranchesByProject,
} from "../config/branchesSlice";
import { TBranch } from "../../../../core/gitlab/types/branches_types";

interface ScreenProps {}

type BranchesSelectionViewProps = ScreenProps &
  StackScreenTmpProps<
    BranchesSelectionScreenParams,
    typeof BRANCHES_SELECTION_SCREEN_NAME
  >;

const BranchesSelection: React.FC<BranchesSelectionViewProps> = (props) => {
  const dispatch = useAppDispatch();
  const { route, navigation } = props;

  const {
    title,
    project_id,
    path = "",
    from_branch,
    from_screen,
    selectBranch,
  } = route.params;

  const branches = useAppSelector((state) =>
    selectBranchesByProject(state)(project_id)
  );

  const [filter_text, setFilterText] = useState("");

  const renderTitle = useCallback(() => {
    return <TitleHeader title={"Branches"} subtitle={title} />;
  }, []);

  const onRefreshHandler = useCallback(() => {
    dispatch(fetchBranches({ project_id }));
  }, []);

  useEffect(() => {
    onRefreshHandler();
  }, []);

  const updateFilterText = useCallback(
    (text) => {
      if (
        !(
          branches.state === CRUDState.loading ||
          branches.state === CRUDState.loading_more
        )
      ) {
        setFilterText(text);
      }
    },
    [branches.state]
  );

  const onPressItem = useCallback((item: TBranch) => {
    const new_branch = item.name;

    if (from_screen == null) {
      return navigation.goBack();
    }

    const pop = StackActions.pop(1);

    if (from_branch === new_branch) {
      return navigation.goBack();
    } else if (from_screen === SOURCE_CODE_SCREEN_NAME) {
      navigation.goBack();
      // navigation.dispatch(pop);
      return navigation.dispatch(
        goToSourceCode(
          project_id,
          new_branch,
          path,
          path.length ? path : title,
          title
        )
      );
    } else if (from_screen === COMMITS_SCREEN_NAME) {
      navigation.goBack();
      navigation.dispatch(pop);
      return navigation.dispatch(goToCommits(project_id, new_branch, title));
    } else if (from_screen === CHANGES_SCREEN_NAME) {
      navigation.goBack();
      navigation.dispatch(pop);
      return navigation.dispatch(goToChanges(project_id, new_branch, title));
    } else if (
      [
        FILTERS_MERGE_REQUESTS_SCREEN_NAME,
        NEW_BRANCH_SCREEN_NAME,
        NEW_MERGE_REQUEST_SCREEN_NAME,
      ].indexOf(from_screen) >= 0
    ) {
      selectBranch && selectBranch(new_branch);
      navigation.goBack();
    }

    return null;
  }, []);

  const items = useMemo(() => {
    if (branches.entities) {
      return branches.entities.filter((item) =>
        item.name.includes(filter_text)
      );
    } else {
      return [];
    }
  }, [branches, filter_text]);

  const onRealEndReached = useCallback(() => {
    dispatch(fetchMoreBranches({ project_id }));
  }, []);

  return (
    <Container>
      <Header center={renderTitle} isModal={true} backBtn={false} />
      <SearchBar
        onChangeText={updateFilterText}
        placeholder="Quick filter by name"
      />
      <View style={{ flex: 1 }}>
        <BranchList
          selectedBranch={from_branch}
          items={items}
          onPressItem={onPressItem}
          showSubtitle={false}
          refreshControl={
            <RefreshControlCommon
              refreshing={branches.state === CRUDState.loading}
              onRefresh={onRefreshHandler}
            />
          }
          showFooter={branches.state === CRUDState.loading_more}
          onRealEndReached={onRealEndReached}
        />
      </View>
    </Container>
  );
};

export default BranchesSelection;
