import React, { useCallback } from "react";
import { View } from "react-native";
import TextThemed from "../../../../components/Commons/TextThemed";
import TouchableItem from "../../../../components/TouchableItem/TouchableItem";
import { renderIconCheck } from "../../../../components/Icons/Icons";
import { FontFamilyEditor } from "../config/types";

interface FontFamilyItemProps {
  item: FontFamilyEditor;
  onPress;
  selected: boolean;
}

const FontFamilyItem: React.FC<FontFamilyItemProps> = ({
  item,
  onPress,
  selected,
}) => {
  const _onPress = useCallback(() => {
    onPress(item);
  }, [onPress, item]);

  const renderContent = useCallback(() => {
    return (
      <View style={styles.container}>
        <TextThemed style={{ fontFamily: item.value }}>{item.name}</TextThemed>
      </View>
    );
  }, [item]);

  return (
    <TouchableItem
      onPress={_onPress}
      renderContent={renderContent}
      renderRight={selected ? renderIconCheck : undefined}
    />
  );
};

const styles = {
  container: {
    width: "100%",
  },
};

export default React.memo(FontFamilyItem);
