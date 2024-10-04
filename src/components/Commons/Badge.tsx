import React, { memo } from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  StyleSheet,
  Text,
  TextStyle,
} from "react-native";
import { GREEN_COLOR } from "../../core/styles/colors";

type BadgeProps = {
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactChild | React.ReactChild[];
};

export const BADGE_STYLES = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    justifyContent: "center",
    borderRadius: 13.5,
    padding: 3,
    paddingHorizontal: 6,
    height: 27,
    minWidth: 27,
    backgroundColor: GREEN_COLOR,
  },
  text: {
    fontSize: 13,
    textAlign: "center",
    color: "#fff",
  },
});

const Badge: React.FC<BadgeProps> = (props) => {
  return (
    <View style={[BADGE_STYLES.container, props.style]}>
      {typeof props.children == "string" ||
      typeof props.children == "number" ? (
        <Text style={[BADGE_STYLES.text, props.textStyle]}>
          {props.children}
        </Text>
      ) : (
        props.children
      )}
    </View>
  );
};

export default memo(Badge);
