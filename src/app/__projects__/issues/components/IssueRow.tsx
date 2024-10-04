import React, { useMemo, useCallback, memo } from "react";
import { View, StyleSheet } from "react-native";
import moment from "moment";
import IconFA from "react-native-vector-icons/FontAwesome5";
import { iOSColors } from "react-native-typography";
import TextThemed from "../../../../components/Commons/TextThemed";
import { IssueState } from "../../../../core/gitlab/types";
import TouchableItem from "../../../../components/TouchableItem/TouchableItem";
import { TIssue } from "../../../../core/gitlab/types/issues_types";

type IssueRowProps = {
  item: TIssue;
  onPress: (item: TIssue) => any;
  onLongPress: (item: TIssue) => any;
  timeAgo: any;
};

const utfOffset = moment().utcOffset();

const FORMAT = "MMMM DD, YYYY";

const IssueRow: React.FC<IssueRowProps> = ({
  item,
  onLongPress,
  onPress,
  timeAgo,
}) => {
  const onLongPressItem = useCallback(() => {
    onLongPress(item);
  }, [item]);

  const onPressItem = useCallback(() => {
    onPress(item);
  }, [item]);

  const renderContent = useCallback(() => {
    const created_at = moment
      .parseZone(item.created_at)
      .utcOffset(utfOffset)
      .toDate();
    const due_date = item.due_date
      ? moment(item.due_date, FORMAT).format(FORMAT)
      : null;

    return (
      <View style={styles.container}>
        <TextThemed>{item.title}</TextThemed>
        <View style={styles.contentSubtitle}>
          <TextThemed type="secondary">{`#${item.iid} ~ opened ${timeAgo.format(
            created_at
          )} by ${item.author.name}`}</TextThemed>
          {!!due_date && (
            <TextThemed type="secondary" style={{ color: iOSColors.red }}>
              <IconFA name="calendar" />
              {` `}
              {due_date}
            </TextThemed>
          )}
        </View>
      </View>
    );
  }, [item]);

  const renderRight = useCallback(() => {
    return (
      <View style={{ paddingLeft: 5 }}>
        <View>
          {!(item.state == IssueState.OPENED) && (
            <View style={{ marginRight: 5 }}>
              <TextThemed type="primary">{item.state.toUpperCase()}</TextThemed>
            </View>
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {item.upvotes > 0 && (
            <View style={{ marginRight: 5 }}>
              <TextThemed type="primary">
                <IconFA name="thumbs-up" solid />
                {" " + item.upvotes}
              </TextThemed>
            </View>
          )}
          {item.downvotes > 0 && (
            <View style={{ marginRight: 5 }}>
              <TextThemed type="primary">
                <IconFA name="thumbs-down" solid />
                {" " + item.downvotes}
              </TextThemed>
            </View>
          )}
          <View>
            <TextThemed
              type={item.user_notes_count > 0 ? "primary" : "secondary"}
            >
              <IconFA name="comments" solid />
              {" " + item.user_notes_count}
            </TextThemed>
          </View>
        </View>
      </View>
    );
  }, [item]);

  return (
    <TouchableItem
      onPress={onPressItem}
      onLongPress={onLongPressItem}
      renderContent={renderContent}
      renderRight={renderRight}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
  contentSubtitle: {
    width: "100%",
    flexDirection: "column",
  },
});

export default memo(IssueRow);
