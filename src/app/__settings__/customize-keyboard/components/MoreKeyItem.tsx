import React, { useCallback } from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { iOSColors } from "react-native-typography";
import { GENERAL_ICON_HEADER_SIZE } from "../../../../core/styles/general";
import TextThemed from "../../../../components/Commons/TextThemed";
import { useTheme } from "../../../../theme/hooks";
import Button from "../../../../components/Buttons/Button";
import { KeyHelper } from "../config/types";

interface MoreKeyItemProps {
  item: KeyHelper;
  index: number;
  addItem: (item: KeyHelper) => void;
}

const MoreKeyItem: React.FC<MoreKeyItemProps> = ({ item, index, addItem }) => {
  const theme = useTheme();

  const onPressItem = useCallback(() => {
    addItem(item);
  }, [item, addItem]);

  return (
    <SafeAreaView>
      <View style={styles.itemWrapper}>
        <View
          style={[styles.item, { backgroundColor: theme.colors.bg_sec_color }]}
        >
          <Button type="clear" onPress={onPressItem}>
            <Icon
              size={GENERAL_ICON_HEADER_SIZE}
              color={iOSColors.green}
              name="add-circle"
            />
          </Button>
          <TextThemed style={styles.itemLabel}>{item.label}</TextThemed>
          <View />
        </View>
      </View>
    </SafeAreaView>
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

export default MoreKeyItem;
