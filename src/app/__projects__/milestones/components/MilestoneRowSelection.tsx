import React, { useCallback } from "react";
import moment from "moment";
import { StyleSheet, View } from "react-native";
import TextThemed from "../../../../components/Commons/TextThemed";
import TouchableItem from "../../../../components/TouchableItem/TouchableItem";
import { renderIconCheck } from "../../../../components/Icons/Icons";
import { TMilestone } from "../../../../core/gitlab/types/milestones_types";

interface MilestoneRowProps {
  item: TMilestone;
  onPress: (item: TMilestone) => void;
  selected: boolean;
}

const MilestoneRowSelection: React.FC<MilestoneRowProps> = ({
  item,
  onPress,
  selected,
}) => {
  const onPressItem = useCallback(() => {
    onPress(item);
  }, [onPress, item]);

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
      renderContent={renderContent}
      renderRight={selected ? renderIconCheck : undefined}
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
export default React.memo(MilestoneRowSelection);
