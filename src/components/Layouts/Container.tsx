import React, { useMemo } from "react";
import { useTheme } from "../../theme/hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, StyleProp, ViewStyle } from "react-native";

type ContainerProps = {
  children?: React.ReactNode;
  primary?: boolean;
  backgroundColor?: string;
};

const Container: React.FC<ContainerProps> = (props) => {
  const { primary = true, children, backgroundColor } = props;

  const theme = useTheme();

  const style: StyleProp<ViewStyle> = useMemo(() => {
    return {
      backgroundColor:
        backgroundColor ?? primary
          ? theme.colors.bg_color
          : theme.colors.bg_sec_color,
      position: "relative",
      flex: 1,
    };
  }, [primary, theme.isDark, backgroundColor]);

  return <View style={style}>{children}</View>;
};

export default Container;
