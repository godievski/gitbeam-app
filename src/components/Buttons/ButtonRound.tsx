import React, { memo } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TouchableOpacityProps, StyleSheet } from "react-native";

type Props = TouchableOpacityProps & {
  children?: React.ReactNode;
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
});

const ButtonRound: React.FC<Props> = ({ style, children, ...props }) => {
  return (
    <TouchableOpacity
      {...props}
      style={[styles.touchable, style]}
      activeOpacity={0.66}
    >
      {children}
    </TouchableOpacity>
  );
};

export default memo(ButtonRound);
