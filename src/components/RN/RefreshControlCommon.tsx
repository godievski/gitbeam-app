import React, { useMemo } from "react";
import {
  RefreshControl,
  RefreshControlProperties,
  Platform,
} from "react-native";
import { useTheme } from "../../theme/hooks";

const RefreshControlIOS: React.FC<RefreshControlProperties> = (props) => {
  const { refreshing, onRefresh } = props;
  const theme = useTheme();

  const color = useMemo(
    () => (theme.isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"),
    [theme.isDark]
  );

  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      progressBackgroundColor={color}
      tintColor={color}
      colors={[color]}
      style={{ zIndex: 2 }}
    />
  );
};

const RefreshControlCommon =
  Platform.OS == "ios" ? RefreshControlIOS : RefreshControl;

export default RefreshControlCommon;
