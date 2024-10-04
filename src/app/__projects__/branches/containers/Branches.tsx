import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from "react";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import BranchList from "../components/BranchList";
import { View, Alert } from "react-native";
import RefreshControlCommon from "../../../../components/RN/RefreshControlCommon";
import Header from "../../../../components/Header/Header";
import ButtonHeader, {
  IconPlus,
} from "../../../../components/Buttons/ButtonHeader";
import { iOSColors } from "react-native-typography";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";
import { MemberAccess } from "../../../../core/gitlab/types";
import Container from "../../../../components/Layouts/Container";
import { CRUDState, StackScreenTmpProps } from "../../../../core/utils";
import TitleHeader from "../../../../components/Header/TitleHeader";
import { getPermissionLevel } from "../../../../core/gitlab/api";
import { goToSourceCode } from "../../source-code/config/navigation";
import { goToNewMergeRequest } from "../../project-merge-requests/config/navigation";
import { GENERAL_ICON_SIZE } from "../../../../core/styles/general";
import {
  BRANCHES_SCREEN_NAME,
  BranchesScreenParams,
  goToNewBranch,
} from "../config/navigation";
import { ToastContext } from "../../../../components/Toast/ToastContext";
import { Modalvski } from "../../../../components/Modalvski/Modalvski";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemPressable from "../../../../components/Group/ItemPressable";
import IconThemed from "../../../../components/Icons/IconThemed";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  deleteBranch,
  fetchBranches,
  fetchMoreBranches,
  selectBranchesByProject,
} from "../config/branchesSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { TBranch } from "../../../../core/gitlab/types/branches_types";
import EmptyState from "../../../../components/Commons/EmptyState";

interface ScreenProps {}

type BranchesViewProps = ScreenProps &
  StackScreenTmpProps<BranchesScreenParams, typeof BRANCHES_SCREEN_NAME>;

const Branches: React.FC<BranchesViewProps> = (props) => {
  const dispatch = useAppDispatch();
  const [filterText, setFilterText] = useState("");

  const { route, navigation } = props;

  const { project_id } = route.params;

  const branches = useAppSelector((state) =>
    selectBranchesByProject(state)(project_id)
  );
  const project = useAppSelector((state) => state.current_project).data!;
  const user = useAppSelector((state) => state.user).data;

  const access_level = useMemo(() => getPermissionLevel(project, user), [
    project,
    user,
  ]);

  const modal = useRef<Modalvski>(null);

  const toast = useContext(ToastContext);

  const [branch_selected, setBranchSelected] = useState<TBranch | null>(null);

  const onRefreshHandler = useCallback(() => {
    const project_id = route.params.project_id;
    dispatch(fetchBranches({ project_id }));
  }, []);

  useEffect(() => {
    onRefreshHandler();
  }, []);

  const renderTitle = useCallback(() => {
    const subtitle = route.params.title;
    return <TitleHeader title={"Branches"} subtitle={subtitle} />;
  }, []);

  const renderRightHeader = useCallback(() => {
    if (
      branches.state === CRUDState.loading ||
      branches.state === CRUDState.deleting
    ) {
      return <HeaderIndicator />;
    } else if (access_level >= MemberAccess.DEVELOPER) {
      return (
        <ButtonHeader
          onPress={() => {
            navigation.dispatch(goToNewBranch());
          }}
          icon={IconPlus}
        />
      );
    } else {
      return undefined;
    }
  }, [branches.state, access_level]);

  const updateFilterText = useCallback(
    (text) => {
      const stop =
        branches.state === CRUDState.loading ||
        branches.state === CRUDState.loading_more;
      if (!stop) {
        setFilterText(text);
      }
    },
    [branches.state]
  );

  const onPressItemHandler = useCallback((item: TBranch) => {
    const title = route.params.title;
    const project_id = route.params.project_id;
    const new_branch = item.name;

    return navigation.dispatch(
      goToSourceCode(project_id, new_branch, "", title, title)
    );
  }, []);

  const deleteBranchHandler = useCallback((item: TBranch) => {
    Alert.alert(
      "Delete Branch",
      "Are you sure you want to delete this branch?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            dispatch(deleteBranch({ project_id, identifier: item.name }))
              .then(unwrapResult)
              .catch(toast.updateError);
          },
          style: "destructive",
        },
      ],
      {
        cancelable: true,
      }
    );
  }, []);

  const mergeBranchHandler = useCallback((item: TBranch) => {
    navigation.dispatch(goToNewMergeRequest(item.name));
  }, []);

  const onLongPressItemHandler = useCallback((item: TBranch) => {
    setBranchSelected(item);
    modal.current?.open();
  }, []);

  const items = useMemo(() => {
    if (branches.entities) {
      return branches.entities.filter((item) => item.name.includes(filterText));
    } else {
      return [];
    }
  }, [branches, filterText]);

  const onRealEndReached = useCallback(() => {
    dispatch(fetchMoreBranches({ project_id }));
  }, []);

  return (
    <Container>
      <Header center={renderTitle} right={renderRightHeader} />
      <SearchBar
        onChangeText={updateFilterText}
        placeholder="Quick filter by name"
      />
      <View style={{ flex: 1 }}>
        <BranchList
          items={items}
          onPressItem={onPressItemHandler}
          onLongPressItem={onLongPressItemHandler}
          showSubtitle={true}
          refreshControl={
            <RefreshControlCommon
              refreshing={branches.state === CRUDState.loading}
              onRefresh={onRefreshHandler}
            />
          }
          onRealEndReached={onRealEndReached}
          showFooter={branches.state === CRUDState.loading_more}
        />
      </View>
      <Modalvski cancelBtn ref={modal}>
        {access_level >= MemberAccess.DEVELOPER && (
          <ItemGroup>
            <ItemPressable
              title="Create branch here"
              renderIcon={() => (
                <IconThemed type="git" size={GENERAL_ICON_SIZE} name="branch" />
              )}
              onPress={() => {
                branch_selected &&
                  navigation.dispatch(goToNewBranch(branch_selected.name));
              }}
            />
            <ItemPressable
              title="Merge into ..."
              renderIcon={() => (
                <IconThemed
                  type="git"
                  size={GENERAL_ICON_SIZE}
                  name="merge-request"
                />
              )}
              onPress={() => {
                branch_selected && mergeBranchHandler(branch_selected);
              }}
            />
            <ItemPressable
              title="Delete branch"
              titleStyle={{ color: iOSColors.red }}
              renderIcon={() => (
                <IconThemed
                  type="ionicon"
                  name="trash-outline"
                  size={GENERAL_ICON_SIZE}
                  color={iOSColors.red}
                />
              )}
              onPress={() => {
                branch_selected && deleteBranchHandler(branch_selected);
              }}
              borderBottom={false}
            />
          </ItemGroup>
        )}
      </Modalvski>
    </Container>
  );
};

export default Branches;
