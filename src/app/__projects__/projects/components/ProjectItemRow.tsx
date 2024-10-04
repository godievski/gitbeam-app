import React, { useCallback } from "react";
import { ProjectItemWrapperProps } from "./types";
import TouchableItem from "../../../../components/TouchableItem/TouchableItem";
import Avatar from "../../../../components/Avatar/Avatar";
import { View } from "react-native";
import TextThemed from "../../../../components/Commons/TextThemed";

const ProjectItemRow: React.FC<ProjectItemWrapperProps> = ({
  project,
  onPress,
  onLongPress,
}) => {
  const renderContent = useCallback(
    () => (
      <View style={{ width: "100%" }}>
        <View>
          <TextThemed style={{ fontWeight: "600", fontSize: 18 }}>
            {project.name}
          </TextThemed>
        </View>
        {!!project.description && project.description.length > 0 && (
          <View>
            <TextThemed type="secondary" ellipsizeMode="tail" numberOfLines={1}>
              {project.description}
            </TextThemed>
          </View>
        )}
      </View>
    ),
    [project]
  );

  const renderLeft = useCallback(
    () => (
      <Avatar
        size="medium"
        avatar_url={project.avatar_url}
        letter={project.name[0]}
        type="visible"
        dimension="square"
      />
    ),
    [project]
  );

  return (
    <TouchableItem
      onPress={onPress}
      onLongPress={onLongPress}
      renderContent={renderContent}
      renderLeft={renderLeft}
    />
  );
};

export default React.memo(ProjectItemRow);
