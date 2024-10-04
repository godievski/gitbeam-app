import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import Avatar from "../../../../components/Avatar/Avatar";
import TextThemed from "../../../../components/Commons/TextThemed";
import TouchableItem from "../../../../components/TouchableItem/TouchableItem";
import { renderIconCheck } from "../../../../components/Icons/Icons";
import { TMember } from "../../../../core/gitlab/types/members_types";

interface ProjectMemberRowProps {
  item: TMember;
  selected: boolean;
  onPress: (item: TMember) => void;
}

const ProjectMemberRowSelection: React.FC<ProjectMemberRowProps> = ({
  item,
  selected,
  onPress,
}) => {
  const onPressItem = useCallback(() => {
    onPress(item);
  }, [onPress, item]);

  const renderContent = useCallback(() => {
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <TextThemed style={styles.name}>{item.name} </TextThemed>
        </View>
        <View style={styles.subtitle}>
          <TextThemed type="secondary" style={styles.username}>
            @{item.username}
          </TextThemed>
        </View>
      </View>
    );
  }, [item]);

  const renderLeft = useCallback(() => {
    return (
      <Avatar
        avatar_url={item.avatar_url}
        type="public"
        letter={item.username[0]}
        size={36}
        dimension="rounded"
      />
    );
  }, [item]);

  return (
    <TouchableItem
      onPress={onPressItem}
      renderContent={renderContent}
      renderLeft={renderLeft}
      renderRight={selected ? renderIconCheck : undefined}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    // color: DEFAULT_TEXT_COLOR
  },
  username: {
    fontSize: 13,
    // color: DEFAULT_TEXT_COLOR
  },
  subtitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
  },
  date: {},
  access: {},
});

export default React.memo(ProjectMemberRowSelection);
