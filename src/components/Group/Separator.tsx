import React from "react";
import { View, StyleSheet } from "react-native";
import { GENERAL_CONTAINER_PADDING_HORIZONTAL } from "../../core/styles/general";
import { useTheme } from "../../theme/hooks";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: GENERAL_CONTAINER_PADDING_HORIZONTAL * 0.75,
    margin: 0,
    // opacity: 0.7,
  },
  separator: {
    width: "100%",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

type SeparatorProps = {
  full?: boolean;
};

const Separator: React.FC<SeparatorProps> = ({ full = false }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, full ? { paddingHorizontal: 0 } : {}]}>
      <View
        style={[
          styles.separator,
          { borderBottomColor: theme.colors.divider_color },
        ]}
      />
    </View>
  );
};

export default React.memo(Separator);
