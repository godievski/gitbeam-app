import React, { useCallback } from "react";
import ProjectItemBox, { ProjectItemBoxInvisible } from "./ProjectItemBox";
import { ProjectItemProps } from "./types";
import ProjectItemRow from "./ProjectItemRow";

const ProjectItem: React.FC<ProjectItemProps> = ({
  project,
  onPressItem,
  onLongPressItem,
  view,
}) => {
  const onPress = useCallback(() => {
    onPressItem(project);
  }, [onPressItem, project]);

  const onLongPress = useCallback(() => {
    onLongPressItem(project);
  }, [onLongPressItem, project]);

  if (project.id == -1) {
    return <ProjectItemBoxInvisible />;
  }

  if (view == "list") {
    return (
      <ProjectItemRow
        project={project}
        onPress={onPress}
        onLongPress={onLongPress}
      />
    );
  } else {
    return (
      <ProjectItemBox
        project={project}
        onPress={onPress}
        onLongPress={onLongPress}
      />
    );
  }
};

export default React.memo(ProjectItem);
