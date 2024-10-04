import React, { useCallback, memo, useMemo } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "../../../../theme/hooks";

type TextSizeItemProps = {
  item: number;
  isSelected: boolean;
  isFirst: boolean;
  isLast: boolean;
  selectItem: (val: number) => any;
};

const TextSizeItem: React.FC<TextSizeItemProps> = ({
  item,
  isSelected,
  isFirst,
  isLast,
  selectItem,
}) => {
  const theme = useTheme();

  const onPress = useCallback(() => {
    selectItem(item);
  }, [selectItem, item]);

  const container = useMemo(
    () =>
      StyleSheet.flatten([
        styles.container,
        {
          borderColor: isSelected
            ? theme.colors.border_item_selected
            : "transparent",
          backgroundColor: theme.colors.bg_color,

          marginRight: isLast ? 0 : 5,
          marginLeft: isFirst ? 0 : 5,
        },
      ]),
    [isSelected, theme, isLast, isFirst]
  );

  return (
    <TouchableOpacity onPress={onPress} style={container}>
      <Text
        style={{
          fontSize: item,
          color: theme.colors.text_primary,
        }}
      >
        {"Aa"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 3,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default memo(TextSizeItem);
