import React, { useMemo, memo } from "react";
import { ActivityIndicator } from "react-native";
import { useTheme } from "../../theme/hooks";

interface SpinnerProps {
  inverted?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ inverted = false }) => {
  const theme = useTheme();
  const color = useMemo(
    () =>
      theme.isDark && !inverted ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)",
    [theme, inverted]
  );

  return <ActivityIndicator color={color} size="small" animating={true} />;
};

export default memo(Spinner);
