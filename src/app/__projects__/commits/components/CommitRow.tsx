import React, { useCallback } from "react";
import { iOSColors } from "react-native-typography";
import { View, StyleSheet, Text } from "react-native";

import TextThemed from "../../../../components/Commons/TextThemed";
import IconThemed from "../../../../components/Icons/IconThemed";
import { TCommit } from "../../../../core/gitlab/types/commits_types";
import TouchableItem from "../../../../components/TouchableItem/TouchableItem";
import moment from "moment";

interface CommitRowProps {
  item: TCommit;
  index: number;
  utcOffset: number;
  onPressItem: (item: TCommit) => void;
  onLongPressItem: (item: TCommit) => void;
  timeAgo;
}

const CommitRow: React.FC<CommitRowProps> = ({
  item,
  utcOffset,
  onPressItem,
  onLongPressItem,
  timeAgo,
}) => {
  const onPress = useCallback(() => {
    onPressItem(item);
  }, [item, onPressItem]);

  const onLongPress = useCallback(() => {
    onLongPressItem(item);
  }, [item, onLongPressItem]);

  const renderContent = useCallback(() => {
    const date = moment
      .parseZone(item.authored_date)
      .utcOffset(utcOffset)
      .toDate();

    return (
      <View style={styles.container}>
        <View style={styles.contentTitle}>
          <TextThemed>
            <IconThemed type="git" name="commit" size={14} />
            {`  `}
            {item.title}
          </TextThemed>
        </View>
        <View style={styles.contentTitle}>
          <View style={[styles.statsWrapper, styles.statsWrapperAdditions]}>
            <Text style={styles.statsTxt}>+{item.stats.additions}</Text>
          </View>
          <View style={[styles.statsWrapper, styles.statsWrapperDeletions]}>
            <Text style={styles.statsTxt}>-{item.stats.deletions}</Text>
          </View>
        </View>
        <View style={styles.contentSubtitle}>
          <TextThemed style={styles.subtitle}>
            {item.author_name}
            {" authored "}
            {timeAgo.format(date)}
          </TextThemed>
        </View>
      </View>
    );
  }, [item, utcOffset]);

  return (
    <TouchableItem
      onPress={onPress}
      onLongPress={onLongPress}
      renderContent={renderContent}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  contentTitle: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    flexWrap: "wrap",
  },
  contentSubtitle: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap",
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.8,
    flexWrap: "wrap",
  },
  statsWrapper: {
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 6,
    marginRight: 6,
    fontSize: 12,
  },
  statsWrapperAdditions: {
    backgroundColor: "#168f48",
  },
  statsWrapperDeletions: {
    backgroundColor: iOSColors.red,
  },
  statsTxt: {
    color: "#fff",
    fontSize: 12,
  },
});

export default React.memo(CommitRow);
