import React, { useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { iOSColors } from "react-native-typography";
import TextThemed from "../../../../components/Commons/TextThemed";
import Badge from "../../../../components/Commons/Badge";
import { BADGE_STYLES } from "../../../../components/Commons/Badge";
import IconThemed from "../../../../components/Icons/IconThemed";
import TouchableItem from "../../../../components/TouchableItem/TouchableItem";
import { renderIconCheck } from "../../../../components/Icons/Icons";
import { TBranch } from "../../../../core/gitlab/types/branches_types";
// Add locale-specific relative date/time formatting rules.
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

const ICON_SIZE = 12;

interface BranchRowProps {
  item: TBranch;
  showSubtitle: boolean;
  onPressItem;
  onLongPressItem?;
  selected: boolean;
}

const BranchRow: React.FC<BranchRowProps> = ({
  item,
  onPressItem,
  onLongPressItem,
  showSubtitle,
  selected,
}) => {
  const onPress = useCallback(() => {
    onPressItem(item);
  }, [item, onPressItem]);

  const onLongPress = useCallback(() => {
    !!onLongPressItem && onLongPressItem(item);
  }, [item, onLongPressItem]);

  const renderContent = useCallback(() => {
    return (
      <View style={styles.container}>
        <View style={styles.contentTitle}>
          <IconThemed type="git" name="branch" size={ICON_SIZE} />
          <TextThemed style={{ flexWrap: "wrap" }}> {item.name}</TextThemed>
          {item.default && (
            <Badge style={styles.status_default}>
              <Text style={BADGE_STYLES.text}>default</Text>
            </Badge>
          )}
          {item.merged && (
            <Badge style={styles.status_merged}>
              <Text style={BADGE_STYLES.text}>merged</Text>
            </Badge>
          )}
          {item.protected && (
            <Badge style={styles.status_protected}>
              <Text style={BADGE_STYLES.text}>protected</Text>
            </Badge>
          )}
        </View>
        {showSubtitle && (
          <View style={styles.contentSubtitle}>
            <TextThemed>
              <IconThemed type="git" name="commit" size={ICON_SIZE} />
              <TextThemed style={styles.commit_id}>
                {`  ${item.commit.short_id}`}
              </TextThemed>
              <TextThemed style={styles.commit_text}>
                {" · "}
                {item.commit.message}
                {" · "}
                {timeAgo.format(new Date(item.commit.committed_date))}
              </TextThemed>
            </TextThemed>
          </View>
        )}
      </View>
    );
  }, [item, showSubtitle]);

  return (
    <TouchableItem
      onPress={onPress}
      onLongPress={onLongPress}
      renderContent={renderContent}
      renderRight={selected ? renderIconCheck : undefined}
    />
  );
};

const styles = StyleSheet.create({
  branch_name: {
    fontSize: 13,
  },
  commit_text: {
    fontSize: 13,
    flex: 1,
    flexWrap: "wrap",
  },
  commit_id: {
    fontSize: 12,
    color: iOSColors.blue,
    // color: "#1b69b6"
  },
  //content
  container: { flex: 1, width: "100%" },
  contentTitle: { flexDirection: "row", alignItems: "center" },
  contentSubtitle: {
    marginTop: 6,
  },
  badge: {
    marginLeft: 6,
  },
  //badges
  status_default: { backgroundColor: "#007bff", marginLeft: 6 },
  status_merged: { backgroundColor: "#1f78d1", marginLeft: 6 },
  status_protected: { backgroundColor: "#1aaa55", marginLeft: 6 },
});

export default React.memo(BranchRow);
