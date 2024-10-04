import React, { memo } from "react";
import { formatBytes } from "../../../../core/utils";
import { StyleSheet, View } from "react-native";
import ProjectBoxSummary from "./ProjectBoxSummary";
import { GENERAL_CONTAINER_PADDING_HORIZONTAL } from "../../../../core/styles/general";
import TextThemed from "../../../../components/Commons/TextThemed";
import ItemOuter from "../../../../components/Group/ItemOuter";
import { TProject } from "../../../../core/gitlab/types/projects_types";

type ProjectSummaryProps = {
  project: TProject;
  branches_count: number;
};

const ProjectSummary: React.FC<ProjectSummaryProps> = ({
  project,
  branches_count,
}) => {
  const size = !project.statistics ? 0 : project.statistics.repository_size;
  const commits = !project.statistics ? 0 : project.statistics.commit_count;

  return (
    <>
      <View style={styles.containerSummary}>
        <ProjectBoxSummary icon_name="commit" desc="commits" value={commits} />
        <ProjectBoxSummary
          icon_name="branch"
          desc="branches"
          value={branches_count}
        />
        <ProjectBoxSummary
          icon_name="tag"
          desc="tags"
          value={project.tag_list.length}
        />
        <ProjectBoxSummary
          icon_name="doc_code"
          desc="files"
          value={size}
          formatter={(val) => formatBytes(val, 1)}
        />
      </View>
      <View>
        {!!project.description && project.description.length > 0 && (
          <ItemOuter>
            <TextThemed type="primary">{project.description}</TextThemed>
          </ItemOuter>
        )}
      </View>
    </>
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
});

export default memo(ProjectSummary);
