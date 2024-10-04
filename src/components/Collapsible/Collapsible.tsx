import React, { memo, useMemo, useRef } from "react";
import { View, ViewStyle, Dimensions } from "react-native";
import Animated, {
  interpolate,
  Extrapolate,
  Easing,
  useValue,
  useCode,
  set,
  cond,
  eq,
  not,
} from "react-native-reanimated";
import {
  withTimingTransition,
  useGestureHandler,
  useConst,
} from "react-native-redash";
import { State, TapGestureHandler } from "react-native-gesture-handler";

export type CollapsibleParamsRender = {
  transition: Animated.Node<number>;
};

export type CollapsibleProps = {
  renderHeader: (params: CollapsibleParamsRender) => React.ReactNode;
  renderContent: (params: CollapsibleParamsRender) => React.ReactNode;
  contentHeight: number;
  //optional props
  initState?: boolean;
  forceDuration?: number;
  containerStyle?: ViewStyle;
  containerHeaderStyle?: ViewStyle;
  containerContentStyle?: ViewStyle;
};

const BASE_DURATION = 200;
const INCREMENT_DURATION = 50;
const W_HEIGHT = Math.max(
  Dimensions.get("window").height,
  Dimensions.get("window").width
);

const Collapsible: React.FC<CollapsibleProps> = ({
  renderHeader,
  renderContent,
  contentHeight,
  initState = false,
  forceDuration,
  containerStyle = {},
  containerHeaderStyle = {},
  containerContentStyle = {},
}) => {
  const duration = useMemo(() => {
    if (forceDuration) {
      return forceDuration;
    }
    const factor = 1 + Math.floor(contentHeight / W_HEIGHT);
    return BASE_DURATION + factor * INCREMENT_DURATION;
  }, [contentHeight, forceDuration]);

  const open = useValue(initState ? 1 : 0);
  const state = useValue(State.UNDETERMINED);
  const gestureHandler = useGestureHandler({ state });

  const transition = withTimingTransition(open, {
    duration,
    easing: Easing.inOut(Easing.ease),
  });

  const height = useConst(
    interpolate(transition, {
      inputRange: [0, 1],
      outputRange: [0, contentHeight],
      extrapolate: Extrapolate.CLAMP,
    })
  );

  useCode(() => {
    return cond(eq(state, State.END), set(open, not(open)));
  }, [state, open]);

  return (
    <View style={containerStyle}>
      <View style={containerHeaderStyle}>
        <TapGestureHandler {...gestureHandler}>
          <Animated.View>{renderHeader({ transition })}</Animated.View>
        </TapGestureHandler>
      </View>
      <View style={{ width: "100%", overflow: "hidden" }}>
        <Animated.View style={[containerContentStyle, { height }]}>
          {renderContent({ transition })}
        </Animated.View>
      </View>
    </View>
  );
};

export default memo(Collapsible);
