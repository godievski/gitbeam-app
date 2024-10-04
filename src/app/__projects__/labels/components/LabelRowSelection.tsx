import React, { useCallback } from "react";
import { View } from "react-native";
import TextThemed from "../../../../components/Commons/TextThemed";
import TouchableItem from "../../../../components/TouchableItem/TouchableItem";
import { renderIconCheck } from "../../../../components/Icons/Icons";
import { TLabel } from "../../../../core/gitlab/types/labels_types";

interface LabelRowProps {
  item: TLabel;
  onPress: (item: TLabel) => void;
  selected: boolean;
}

const LabelRowSelection: React.FC<LabelRowProps> = ({
  item,
  onPress,
  selected,
}) => {
  const onPressItem = useCallback(() => {
    onPress(item);
  }, [onPress, item]);

  const renderContent = useCallback(() => {
    return (
      <TextThemed numberOfLines={1} ellipsizeMode="tail">
        {item.name}
      </TextThemed>
    );
  }, [item]);

  const renderLeft = useCallback(() => {
    return (
      <View
        style={{
          height: 24,
          width: 24,
          backgroundColor: item.color,
          borderRadius: 6,
        }}
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

export default React.memo(LabelRowSelection);
