import React, { useCallback, memo } from "react";
import { View, StyleSheet, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { iOSColors } from "react-native-typography";
import { useTheme } from "../../../../theme/hooks";
import { GENERAL_ICON_HEADER_SIZE } from "../../../../core/styles/general";
import Button from "../../../../components/Buttons/Button";
import { useTransition } from "react-native-redash";
import Animated, { Easing } from "react-native-reanimated";
import { KeyHelper } from "../config/types";
const { interpolate } = Animated;

type IncludedKeyItemProps = {
  item: KeyHelper;
  index: number | undefined;
  drag;
  isActive: boolean;
  removeItem;
  // scale: Animated.Value;
};

const IncludedKeyItem: React.FC<IncludedKeyItemProps> = ({
  removeItem,
  item,
  isActive,
  drag,
}) => {
  const theme = useTheme();

  const onPressRemoveBtn = useCallback(() => {
    removeItem(item);
  }, [removeItem, item]);

  const transition = useTransition(isActive, {
    duration: 250,
    easing: Easing.inOut(Easing.ease),
  });

  const scale = interpolate(transition, {
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  return (
    <Animated.View
      style={[
        styles.itemWrapper,
        {
          transform: [{ scale }],
        },
      ]}
    >
      <View
        style={[styles.item, { backgroundColor: theme.colors.bg_sec_color }]}
      >
        <Button type="clear" onPress={onPressRemoveBtn}>
          <Icon
            size={GENERAL_ICON_HEADER_SIZE}
            color={iOSColors.red}
            name="remove-circle"
          />
        </Button>
        <Text style={[styles.itemLabel, { color: theme.colors.text_primary }]}>
          {item.label}
        </Text>
        <Button type="clear" onLongPress={drag}>
          <Icon
            size={GENERAL_ICON_HEADER_SIZE}
            color={theme.colors.text_secondary}
            name="reorder-three-outline"
          />
        </Button>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  itemWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 11,
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  itemLabel: {
    paddingRight: 10,
  },
});

export default memo(IncludedKeyItem);
