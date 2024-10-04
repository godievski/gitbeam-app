import React, { useCallback } from "react";
import moment from "moment";
import { StyleSheet, View } from "react-native";
import TextThemed from "../../../../components/Commons/TextThemed";
import TouchableItem from "../../../../components/TouchableItem/TouchableItem";
import { TMilestone } from "../../../../core/gitlab/types/milestones_types";

interface MilestoneRowProps {
  item: TMilestone;
  onPress: (item: TMilestone) => void;
  onLongPress: (item: TMilestone) => void;
  toggleState: (item: TMilestone) => void;
  showBtnState: boolean;
}

const MilestoneRow: React.FC<MilestoneRowProps> = ({
  item,
  onPress,
  onLongPress,
  toggleState,
  showBtnState,
}) => {
  const onPressItem = useCallback(() => {
    onPress(item);
  }, [onPress, item]);

  const onLongPressItem = useCallback(() => {
    onLongPress(item);
  }, [onLongPress, item]);

  const toggleStateItem = useCallback(() => {
    toggleState(item);
  }, [toggleState, item]);

  const renderContent = useCallback(() => {
    const s = item.start_date
      ? moment(item.start_date, "YYYY-MM-DD").format("MMM DD, YYYY")
      : "No start date";
    const d = item.due_date
      ? moment(item.due_date, "YYYY-MM-DD").format("MMM DD, YYYY")
      : "No due date";

    return (
      <View>
        <TextThemed style={styles.title}>{item.title}</TextThemed>
        <TextThemed
          type="secondary"
          style={styles.subtitle}
        >{`${s} - ${d}`}</TextThemed>
      </View>
    );
  }, [item]);

  return (
    <TouchableItem
      onPress={onPressItem}
      onLongPress={onLongPressItem}
      renderContent={renderContent}
    />
  );
};

const styles = StyleSheet.create({
  title: {
    flexWrap: "wrap",
  },
  subtitle: {
    fontSize: 13,
    flexWrap: "wrap",
  },
  contentRight: {
    flexDirection: "row",
    alignItems: "center",
  },
});
export default React.memo(MilestoneRow);
