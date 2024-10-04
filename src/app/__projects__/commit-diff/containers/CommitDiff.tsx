import React, { useCallback, useEffect, useMemo } from "react";
import Container from "../../../../components/Layouts/Container";
import Header from "../../../../components/Header/Header";
import TitleHeader from "../../../../components/Header/TitleHeader";
import { View } from "react-native";
import { StackScreenTmpProps } from "../../../../core/utils";
import {
  CommitDiffScreenParams,
  COMMIT_DIFF_SCREEN_NAME,
} from "../config/navigation";
import { FlatList } from "react-native-gesture-handler";
import { TCommitDiffParsed } from "../../../../core/gitlab/types/commits_types";
import CommitDiffFiles from "../components/CommitDiffFiles";
import RefreshControlCommon from "../../../../components/RN/RefreshControlCommon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CommitDiffHeader from "../components/CommitDiffHeader";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { getCommitDiffKey } from "../config/utils";
import { selectCommitDiffItem } from "../config/commitDiffSlice";
import { fetchCommitDiff } from "../config/commitDiffSlice";

type Props = {};

type CommitDifProps = Props &
  StackScreenTmpProps<CommitDiffScreenParams, typeof COMMIT_DIFF_SCREEN_NAME>;

const CommitDiff: React.FC<CommitDifProps> = ({ route }) => {
  const dispatch = useAppDispatch();

  const { project_id, commit, project_name } = route.params;

  const key = useMemo(
    () => getCommitDiffKey({ project_id, commit_sha: commit.id }),
    []
  );
  const diff = useAppSelector((state) => selectCommitDiffItem(state)(key));

  const insets = useSafeAreaInsets();

  useEffect(() => {
    const params = {
      project_id,
      commit_sha: commit.id,
      force_fetch: false,
    };
    dispatch(fetchCommitDiff(params));
  }, []);

  const renderTitle = useCallback(() => {
    return <TitleHeader title="Commit" />;
  }, []);

  const keyExtractor = useCallback(
    (item: TCommitDiffParsed) => `row-${item.old_path}`,
    []
  );
  const renderHeader = useCallback(() => {
    return (
      <CommitDiffHeader
        commit={commit}
        files_changed={diff.entities?.length ?? 0}
      />
    );
  }, [diff]);
  const renderItem = useCallback(({ item }) => {
    return <CommitDiffFiles diff={item} />;
  }, []);

  const onRefresh = useCallback(() => {
    const params = {
      project_id,
      commit_sha: commit.id,
      force_fetch: true,
    };
    dispatch(fetchCommitDiff(params));
  }, []);

  return (
    <Container primary={false}>
      <Header center={renderTitle} />
      <View style={{ flex: 1 }}>
        <FlatList
          keyExtractor={keyExtractor}
          data={diff.entities ?? []}
          ListHeaderComponent={renderHeader}
          renderItem={renderItem}
          refreshControl={
            <RefreshControlCommon
              refreshing={diff.loading}
              onRefresh={onRefresh}
            />
          }
          contentContainerStyle={{
            paddingBottom: insets.bottom,
            paddingTop: 10,
          }}
        />
      </View>
    </Container>
  );
};

export default CommitDiff;
