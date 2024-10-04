import React, { useCallback, memo, useMemo } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import Animated, { useValue, timing, Easing } from "react-native-reanimated";
import { useTheme } from "../../theme/hooks";
import { PALETTE } from "../../core/styles/colors";
import { TouchableOpacity } from "react-native-gesture-handler/touchables";

type AnimationProps = {
  duration: number;
  scale: number;
};

type ButtonProps = {
  animate?: boolean;
  animationProps?: AnimationProps;
  type?: "solid" | "outline" | "clear";
  onPress?: () => void;
  onLongPress?: () => void;
  children: React.ReactElement;
  style?: ViewStyle;
  disabled?: boolean;
  activeOpacity?: number;
  containerStyle?: ViewStyle;
};

const Button: React.FC<ButtonProps> = ({
  animate = true,
  animationProps = { duration: 200, scale: 0.98 },
  activeOpacity = 0.7,
  type = "solid",
  onPress = () => {},
  onLongPress = () => {},
  style,
  children,
  disabled = false,
  containerStyle,
}) => {
  const theme = useTheme();
  const scale = useValue(1);

  const animation = useCallback(
    (toValue: number) => {
      if (animate) {
        timing(scale, {
          toValue,
          duration: animationProps.duration,
          easing: Easing.inOut(Easing.ease),
        }).start();
      } else {
        scale.setValue(1);
      }
    },
    [animate, animationProps]
  );

  const onPressIn = useCallback(() => {
    animation(animationProps.scale);
  }, [animation, animationProps]);

  const onPressOut = useCallback(() => {
    animation(1);
  }, [animation]);

  const style_button = useMemo(() => {
    return StyleSheet.flatten([
      styles.button,
      {
        borderColor:
          type === "clear" ? "transparent" : theme.colors.divider_color,
        backgroundColor: type === "solid" ? PALETTE.blue : "transparent",
      },
      style,
    ]);
  }, [type, style]);

  return (
    <Animated.View style={[containerStyle, { transform: [{ scale }] }]}>
      <TouchableOpacity
        style={style_button}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        activeOpacity={activeOpacity}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 38,
    minWidth: 38,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    overflow: "hidden",
  },
});

export default memo(Button);
