import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { MemberAccessDesc } from "../../../../core/gitlab/types";
import Avatar from "../../../../components/Avatar/Avatar";
import TextThemed from "../../../../components/Commons/TextThemed";
import TouchableItem from "../../../../components/TouchableItem/TouchableItem";
import { TMember } from "../../../../core/gitlab/types/members_types";

interface ProjectMemberRowProps {
  item: TMember;
  onPress: (item: TMember) => void;
  onLongPress?: (item: TMember) => void;
}

const ProjectMemberRow: React.FC<ProjectMemberRowProps> = ({
  item,
  onPress,
  onLongPress,
}) => {
  const onPressItem = useCallback(() => {
    onPress(item);
  }, [onPress, item]);

  const onLongPressItem = useCallback(() => {
    !!onLongPress && onLongPress(item);
  }, [onLongPress, item]);

  const renderContent = useCallback(() => {
    return (
      <View>
        <View style={styles.contentTitle}>
          <TextThemed>
            {item.name}
            {`  ·  `}
            <TextThemed style={styles.username}>@{item.username}</TextThemed>
          </TextThemed>
        </View>
        <View style={styles.contentSubtitle}>
          <View style={styles.date}>
            <TextThemed type="secondary">
              {item.expires_at || "No exp. date"}
            </TextThemed>
          </View>
          <View>
            <TextThemed style={styles.access}>
              {MemberAccessDesc[item.access_level]}
            </TextThemed>
          </View>
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
      onLongPress={onLongPressItem}
      renderContent={renderContent}
      renderLeft={renderLeft}
    />
  );
};

const styles = StyleSheet.create({
  contentTitle: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: 14,
  },
  contentSubtitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
    width: "100%",
  },
  date: {},
  access: {
    fontSize: 14,
  },
});

export default React.memo(ProjectMemberRow);
