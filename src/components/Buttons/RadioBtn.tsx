import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../theme/hooks";
import { interpolate, Easing, Extrapolate } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useTimingTransition } from "react-native-redash";

type RadioBtnProps = {
  selected: boolean;
  onPress: () => void;
  type?: "round" | "square";
};

const BTN_SIZE = 22;
const BTN_INNER_SIZE = 12;
const DURATION = 250;
const FACTOR = BTN_INNER_SIZE / BTN_SIZE;

//TODO: change colors
const RadioBtn: React.FC<RadioBtnProps> = ({
  selected,
  onPress,
  type = "round",
}) => {
  const theme = useTheme();

  const transition = useTimingTransition(selected, {
    duration: DURATION,
    easing: Easing.inOut(Easing.ease),
  });

  const scale = interpolate(transition, {
    inputRange: [0, 1],
    outputRange: [5, 1],
  });
  const opacity = interpolate(transition, {
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
    extrapolate: Extrapolate.CLAMP,
  });

  const { borderRadiusContainer, borderRadiusCheck } = useMemo(
    () =>
      type == "round"
        ? { borderRadiusContainer: BTN_SIZE, borderRadiusCheck: BTN_INNER_SIZE }
        : {
            borderRadiusContainer: 7,
            borderRadiusCheck: 3,
          },
    [type]
  );

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View
          style={[
            styles.btn,
            {
              borderColor: theme.colors.radio_btn,
              borderRadius: borderRadiusContainer,
            },
          ]}
        >
          <Animated.View
            style={{
              backgroundColor: theme.colors.radio_btn,
              borderRadius: borderRadiusCheck,
              width: BTN_INNER_SIZE,
              height: BTN_INNER_SIZE,
              opacity,
              transform: [{ scale }],
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 3,
  },
  btn: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: BTN_SIZE,
    borderWidth: 2,
    backgroundColor: "transparent",
    overflow: "visible",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default memo(RadioBtn);
