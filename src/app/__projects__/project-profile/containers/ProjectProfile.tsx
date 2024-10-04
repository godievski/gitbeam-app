import React, { useEffect, useCallback, useMemo } from "react";
import ProjectSummary from "../components/ProjectSummary";
import ProjectLinks from "../components/ProjectLinks";
import _ from "lodash";
import RefreshControlCommon from "../../../../components/RN/RefreshControlCommon";
import Header from "../../../../components/Header/Header";
import Container from "../../../../components/Layouts/Container";
import {
  PROJECT_PROFILE_SCREEN_NAME,
  ProjectProfileParams,
} from "../config/navigation";
import { StackScreenTmpProps, DispatchProps } from "../../../../core/utils";
import ScrollView from "../../../../components/RN/ScrollView";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { fetchProject } from "../config/currentProjectSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import ProjectHeader from "../components/ProjectHeader";
import ProjectBadges from "../components/ProjectBadges";
type Props = {};

type ProjectProfileProps = Props &
  DispatchProps &
  StackScreenTmpProps<ProjectProfileParams, typeof PROJECT_PROFILE_SCREEN_NAME>;

const ProjectProfile: React.FC<ProjectProfileProps> = ({}) => {
  const dispatch = useAppDispatch();

  const project = useAppSelector((state) => state.current_project);

  const changes = useAppSelector((state) => state.changes);

  const { changes_count, default_branch } = useMemo(() => {
    let changes_count = 0;
    let default_branch = "";
    let max_count = 0;
    if (project.data !== undefined) {
      const project_data = project.data;
      //find branches for current project
      const keys = Object.keys(changes)
        .filter((change_key) => change_key.startsWith(`${project_data.id}`))
        .map((change_key) => change_key.split("|"));

      keys.forEach((change_key) => {
        const branch_name = change_key[1];
        const change_branch = changes[`${change_key[0]}|${change_key[1]}`];
        changes_count += change_branch.actions.length;
        if (change_branch.actions.length >= max_count) {
          default_branch = branch_name;
          max_count = change_branch.actions.length;
        }
      });
    }
    if (max_count === 0) {
      default_branch = project.data?.default_branch ?? "";
    }
    return {
      changes_count,
      default_branch,
    };
  }, [project.data, changes]);

  useEffect(() => {
    dispatch(fetchProject({ project_id: project.basic.id }));
  }, []);

  const onRefresh = useCallback(() => {
    dispatch(fetchProject({ project_id: project.basic.id }));
  }, [project.basic]);

  return (
    <Container>
      <Header />
      <ScrollView
        refreshControl={
          <RefreshControlCommon
            refreshing={project.loading}
            onRefresh={onRefresh}
          />
        }
        style={{ flex: 1 }}
        paddingTop={true}
        showsVerticalScrollIndicator={false}
      >
        {project.data && (
          <>
            <SafeAreaView edges={["left", "right"]}>
              <ProjectHeader project={project.data} />
              <ProjectSummary
                project={project.data}
                branches_count={project.branches_count}
              />
              <ProjectBadges project={project.data} />
            </SafeAreaView>

            <ProjectLinks
              project={project.data}
              default_branch_change={default_branch}
              changesCount={changes_count}
              empty={!project.data.default_branch}
            />
          </>
        )}
      </ScrollView>
    </Container>
  );
};

export default ProjectProfile;
