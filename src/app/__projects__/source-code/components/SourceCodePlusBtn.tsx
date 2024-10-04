import React, { useCallback, useEffect, useRef, memo } from "react";
import { Animated, Easing, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../../../../theme/hooks";
// import Icon from "react-native-vector-icons/FontAwesome5";
import Icon from "react-native-vector-icons/Ionicons";
import { GENERAL_CONTAINER_PADDING_HORIZONTAL } from "../../../../core/styles/general";

type SourceCodePlusBtnProps = {
  onPress: () => any;
  onLongPress: () => any;
};
const SourceCodePlusBtn: React.FC<SourceCodePlusBtnProps> = (props) => {
  const scale = useRef(new Animated.Value(1)).current;

  const theme = useTheme();
  const { onLongPress, onPress } = props;

  useEffect(() => {
    return () => scale.stopAnimation();
  }, []);

  const onPressInButton = useCallback(() => {
    Animated.timing(scale, {
      toValue: 0.75,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const onPressOutButton = useCallback(() => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scale }],
        position: "absolute",
        bottom: 45,
        right: GENERAL_CONTAINER_PADDING_HORIZONTAL,
      }}
    >
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: theme.colors.button_bg_color },
        ]}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={onPressInButton}
        onPressOut={onPressOutButton}
        activeOpacity={1}
      >
        <Icon
          name="add-outline"
          color={theme.colors.button_text_color}
          size={42}
          style={{ paddingLeft: 4, paddingTop: 4 }}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    backgroundColor: "transparent",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0,0,0, 0.5)", // IOS
    shadowOffset: { height: 2, width: 0 }, // IOS
    shadowOpacity: 0.7, // IOS
    shadowRadius: 2, //IOS
    elevation: 2, // Android
  },
});

export default memo(SourceCodePlusBtn);
