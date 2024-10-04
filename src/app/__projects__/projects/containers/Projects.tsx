import React, { useState, useEffect, useCallback, useMemo } from "react";
import { goToProjectProfile } from "../../project-profile/config/navigation";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import RefreshControlCommon from "../../../../components/RN/RefreshControlCommon";
import Header from "../../../../components/Header/Header";
import { View, StyleProp, ViewStyle } from "react-native";
import ProjectItem from "../components/ProjectItem";
import ButtonHeader from "../../../../components/Buttons/ButtonHeader";
import { IconPlus } from "../../../../components/Buttons/ButtonHeader";
import {
  goToNewProject,
  ProjectsScreenParams,
  PROJECTS_SCREEN_NAME,
} from "../config/navigation";
import TitleHeader from "../../../../components/Header/TitleHeader";
import EmptyState from "../../../../components/Commons/EmptyState";
import { StackScreenTmpProps } from "../../../../core/utils";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";
import Container from "../../../../components/Layouts/Container";
import Icon from "react-native-vector-icons/Ionicons";
import { GENERAL_ICON_HEADER_SIZE } from "../../../../core/styles/general";
import useDimensions from "../../../../core/hooks/useDimensions";
import FlatList from "../../../../components/RN/FlatList";
import { TProjectSimple } from "../../../../core/gitlab/types/projects_types";
import { useTheme } from "../../../../theme/hooks";
import { fetchProjects, fetchMoreProjects } from "../config/projectsSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import Spinner from "../../../../components/Commons/Spinner";
import { selectProject } from "../../project-profile/config/currentProjectSlice";
import { toggleProjectView } from "../../../../theme/themeSlice";

type Props = {};

type ProjectsViewProps = Props &
  StackScreenTmpProps<ProjectsScreenParams, typeof PROJECTS_SCREEN_NAME>;

export interface ProjectViewState {
  filterText: string;
}

const Projects: React.FC<ProjectsViewProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const theme = useTheme();

  const {
    entities: projects,
    loading,
    loading_more,
    // creating,
  } = useAppSelector((state) => state.projects);

  const { projectView } = theme;

  const [filter_text, setFilterText] = useState("");

  const dimensions = useDimensions();

  const onRefresh = useCallback(async () => {
    dispatch(fetchProjects());
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  const updateFilterText = useCallback(
    (text: string) => {
      if (loading == "idle") {
        setFilterText(text);
      }
    },
    [loading]
  );

  const onPressItem = useCallback((project: TProjectSimple) => {
    dispatch(selectProject(project));
    navigation.dispatch(goToProjectProfile(project.id));
  }, []);

  const onLongPressItem = useCallback((item: TProjectSimple) => {}, []);

  const renderHeader = useCallback(() => {
    return <React.Fragment></React.Fragment>;
  }, []);

  const renderTitle = useCallback(() => {
    return <TitleHeader title="Projects" />;
  }, []);

  const toggleView = useCallback(() => {
    dispatch(toggleProjectView());
  }, []);

  const goToNewProjectHandler = useCallback(() => {
    navigation.dispatch(goToNewProject());
  }, []);

  const renderRightHeader = useCallback(() => {
    if (loading === "pending") {
      return <HeaderIndicator />;
    } else {
      return (
        <View style={{ flexDirection: "row" }}>
          <ButtonHeader
            onPress={toggleView}
            icon={
              <Icon
                size={GENERAL_ICON_HEADER_SIZE - 4}
                name={projectView == "list" ? "list-outline" : "grid-outline"}
                color="#fff"
              />
            }
          />
          <ButtonHeader onPress={goToNewProjectHandler} icon={IconPlus} />
        </View>
      );
    }
  }, [loading, toggleView, projectView]);

  const num_cols = useMemo(() => {
    return projectView === "square" ? (dimensions.isLandscape ? 5 : 3) : 1;
  }, [dimensions.isLandscape, projectView]);

  const projects_to_show = useMemo(() => {
    if (!projects) {
      return [];
    }
    const filter_text_low = filter_text.toLowerCase();
    let filtered = projects.filter((project) =>
      project.name_with_namespace!.toLowerCase().includes(filter_text_low)
    );

    if (projectView === "square") {
      let number_of_full_rows = Math.floor(filtered.length / num_cols);
      let number_of_elements_last_row =
        filtered.length - number_of_full_rows * num_cols;
      while (
        number_of_elements_last_row !== num_cols &&
        number_of_elements_last_row !== 0
      ) {
        filtered.push({ id: -1 } as TProjectSimple);
        number_of_elements_last_row = number_of_elements_last_row + 1;
      }
    }
    return filtered as TProjectSimple[];
  }, [filter_text, num_cols, projects]);

  const keyList = useMemo(() => {
    if (projectView === "list") {
      return projectView;
    } else {
      {
        return projectView + (dimensions.isLandscape ? "h" : "v");
      }
    }
  }, [projectView, dimensions.isLandscape]);

  const columnWrapperStyle: StyleProp<ViewStyle> = useMemo(() => {
    return projectView === "square"
      ? {
          flex: 1,
          justifyContent: "space-around",
        }
      : undefined;
  }, [projectView]);

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <ProjectItem
          project={item}
          onPressItem={onPressItem}
          onLongPressItem={onLongPressItem}
          view={projectView}
        />
      );
    },
    [onPressItem, onLongPressItem, projectView]
  );

  const renderFooter = useCallback(() => {
    if (loading_more === "pending") {
      return <Spinner />;
    } else {
      return null;
    }
  }, [loading_more]);

  const onRealEndReached = useCallback(() => {
    dispatch(fetchMoreProjects());
  }, []);

  return (
    <Container>
      <Header
        backBtn={false}
        burgerBtn={true}
        center={renderTitle}
        right={renderRightHeader}
      />
      <SearchBar
        onChangeText={updateFilterText}
        placeholder="Quick filter by project name"
      />
      <View style={{ flex: 1 }}>
        {loading === "pending" && projects === null && (
          <EmptyState loading={true} />
        )}
        {projects !== null && (
          <FlatList
            key={keyList}
            keyExtractor={(item) => item.id.toString()}
            data={projects_to_show}
            refreshControl={
              <RefreshControlCommon
                refreshing={loading == "pending"}
                onRefresh={onRefresh}
              />
            }
            renderItem={renderItem}
            columnWrapperStyle={columnWrapperStyle}
            numColumns={num_cols}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={EmptyState}
            ListFooterComponent={renderFooter}
            onRealEndReached={onRealEndReached}
          />
        )}
      </View>
    </Container>
  );
};

export default React.memo(Projects);
