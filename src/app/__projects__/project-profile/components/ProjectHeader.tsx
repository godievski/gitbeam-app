import React from "react";
import { StyleSheet, View } from "react-native";
import Avatar from "../../../../components/Avatar/Avatar";
import TextThemed from "../../../../components/Commons/TextThemed";
import {
  GENERAL_CONTAINER_PADDING_HORIZONTAL,
  GENERAL_CONTAINER_PADDING_VERTICAL,
} from "../../../../core/styles/general";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { TProject } from "../../../../core/gitlab/types/projects_types";

type ProjectHeaderProp = {
  project: TProject;
};
const ProjectHeader: React.FC<ProjectHeaderProp> = ({ project }) => {
  return (
    <View style={styles.header}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <Avatar
          size="medium"
          avatar_url={project.avatar_url}
          letter={project.name[0]}
          type={project.visibility}
          dimension="square"
        />
        <View style={styles.haderTitlecontainer}>
          <TextThemed style={styles.headerTitle}>{project.name}</TextThemed>
          <View style={styles.subtitleWrapper}>
            <TextThemed>
              <FontAwesome
                size={12}
                name={project.visibility == "private" ? "lock" : "unlock"}
              />
            </TextThemed>
            <TextThemed type="secondary" style={styles.headerSubtitle}>
              {project.name_with_namespace}
            </TextThemed>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerSummary: {
    width: "100%",
    paddingVertical: 6,
    paddingHorizontal: GENERAL_CONTAINER_PADDING_HORIZONTAL * 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    width: "auto",
    paddingTop: GENERAL_CONTAINER_PADDING_VERTICAL,
    paddingHorizontal: GENERAL_CONTAINER_PADDING_HORIZONTAL * 1.5,
  },
  haderTitlecontainer: {
    paddingLeft: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 12,
    paddingLeft: 6,
  },
  subtitleWrapper: {
    flexDirection: "row",
    marginTop: 4,
  },
});

export default React.memo(ProjectHeader);
