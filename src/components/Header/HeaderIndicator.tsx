import React, { memo } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "../../theme/hooks";

interface HeaderIndicatorProps {
  color?: string;
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

const HeaderIndicator: React.FC<HeaderIndicatorProps> = ({
  color = "#fff",
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={color} />
    </View>
  );
};

export const HeaderIndicatorThemed: React.FC<{}> = memo(() => {
  const theme = useTheme();
  return <HeaderIndicator color={theme.colors.text_primary} />;
});

export default memo(HeaderIndicator);
