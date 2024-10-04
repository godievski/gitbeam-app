import React from "react";
import { StyleSheet, SafeAreaView, View, Text } from "react-native";

import { useTheme } from "../../theme/hooks";
import { GENERAL_CONTAINER_PADDING_VERTICAL } from "../../core/styles/general";
import {
  GENERAL_BORDER,
  GENERAL_CONTAINER_PADDING_HORIZONTAL,
} from "../../core/styles/general";

interface ItemGroupProps {
  children?: React.ReactNode;
  label?: string;
}

const ItemGroup: React.FC<ItemGroupProps> = (props) => {
  const { label } = props;
  const theme = useTheme();

  return (
    <SafeAreaView>
      <View style={styles.containerWrapper}>
        {label && (
          <Text style={[styles.label, { color: theme.colors.text_primary }]}>
            {label}
          </Text>
        )}
        <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.bg_tertary_color },
          ]}
        >
          {props.children}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    paddingHorizontal: GENERAL_CONTAINER_PADDING_HORIZONTAL,
    paddingVertical: GENERAL_CONTAINER_PADDING_VERTICAL,
    // marginTop: GENERAL_CONTAINER_PADDING_VERTICAL,
    width: "100%",
  },
  container: {
    borderRadius: GENERAL_BORDER,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    paddingBottom: 8,
    paddingHorizontal: GENERAL_CONTAINER_PADDING_HORIZONTAL / 2,
  },
  dividerWrapper: {
    paddingHorizontal: GENERAL_CONTAINER_PADDING_HORIZONTAL * 0.75,
    margin: 0,
    opacity: 0.7,
  },
});

export default React.memo(ItemGroup);
