import React, { useCallback, useRef, useEffect } from "react";
import {
  View,
  Image as RNImage,
  NativeSyntheticEvent,
  ImageLoadEventData,
  Platform,
  ImageProperties,
  ImageSourcePropType,
} from "react-native";
import Animated, { useValue, timing, Easing } from "react-native-reanimated";
import { StyleSheet, ViewStyle } from "react-native";

interface ImageProps extends Omit<ImageProperties, "source"> {
  source?: ImageSourcePropType;
  containerStyle?: ViewStyle;
  renderPlaceholder: () => React.ReactNode;
}

const Image: React.FC<ImageProps> = ({
  renderPlaceholder,
  source,
  containerStyle,
  ...props
}) => {
  const placeholderOpacity = useValue(1);

  const animation = useRef(
    timing(placeholderOpacity, {
      duration: 350,
      toValue: 0,
      easing: Easing.linear,
    })
  ).current;

  // useEffect(() => {
  //   return () => {
  //     animation.stop();
  //   };
  // }, []);

  const onLoad = useCallback(
    (e: NativeSyntheticEvent<ImageLoadEventData>) => {
      const minimumWait = 100;
      const staggerNonce = 200 * Math.random();

      setTimeout(
        () => {
          animation.start();
        },
        Platform.OS === "android" ? 0 : Math.floor(minimumWait + staggerNonce)
      );

      props.onLoad && props.onLoad(e);
    },
    [props.onLoad]
  );

  const { width, height, ...styleProps } = StyleSheet.flatten(props.style);

  return (
    <View style={StyleSheet.flatten([styles.container, containerStyle])}>
      {!!source && (
        <RNImage
          {...props}
          source={source}
          style={StyleSheet.flatten([
            StyleSheet.absoluteFillObject,
            {
              width,
              height,
            },
            styleProps,
          ])}
          onLoad={onLoad}
        />
      )}
      <Animated.View
        style={[
          StyleSheet.flatten(styles.placeholderContainer),
          { opacity: placeholderOpacity },
        ]}
      >
        <View
          style={StyleSheet.flatten([props.style, styles.placeholderContent])}
        >
          {renderPlaceholder()}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
  placeholderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#bdbdbd",
  },
  placeholderContent: {
    // backgroundColor: "#bdbdbd",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default React.memo(Image);
