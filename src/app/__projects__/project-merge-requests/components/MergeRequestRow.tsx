import React, { useCallback } from "react";
import { View } from "react-native";
import moment from "moment";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import IconFA from "react-native-vector-icons/FontAwesome5";
import TextThemed from "../../../../components/Commons/TextThemed";
import { MergeRequestState } from "../../../../core/gitlab/types";
import TouchableItem from "../../../../components/TouchableItem/TouchableItem";
import { TMergeRequest } from "../../../../core/gitlab/types/merge_requests_types";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

interface MergeRequestRowProps {
  item: TMergeRequest;
  onLongPress: (item: TMergeRequest) => any;
}

//TODO: add left icon for state
const MergeRequestRow: React.FC<MergeRequestRowProps> = ({
  item,
  onLongPress,
}) => {
  const onLongPressItem = useCallback(() => {
    onLongPress(item);
  }, [item, onLongPress]);

  const renderContent = useCallback(() => {
    const utfOffset = moment().utcOffset();

    const created_at = moment
      .parseZone(item.created_at)
      .utcOffset(utfOffset)
      .toDate();

    return (
      <View>
        <TextThemed>{item.title}</TextThemed>
        <TextThemed type="secondary">{`!${item.iid} opened ${timeAgo.format(
          created_at
        )} by ${item.author.name}`}</TextThemed>
      </View>
    );
  }, [item]);

  const renderRight = useCallback(() => {
    return (
      <View style={{ flexDirection: "row" }}>
        {item.state !== MergeRequestState.OPENED && (
          <View style={{ marginRight: 5 }}>
            <TextThemed type="primary" style={{ fontSize: 14 }}>
              {item.state.toUpperCase()}
            </TextThemed>
          </View>
        )}
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
    );
  }, [item]);

  return (
    <TouchableItem
      onLongPress={onLongPressItem}
      renderContent={renderContent}
      renderRight={renderRight}
    />
  );
};

export default React.memo(MergeRequestRow);
