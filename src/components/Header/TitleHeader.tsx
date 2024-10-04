import React, { memo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";

interface TitleHeaderProps {
  title: string;
  subtitle?: string;
}

const TitleHeader: React.FC<TitleHeaderProps> = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {props.title}
      </Text>
      {!!props.subtitle && (
        <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
          {props.subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    width: "100%",
    // flex: 1,
  },
  title: {
    ...iOSUIKit.bodyEmphasizedWhiteObject,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: 16,
  },
  subtitle: {
    ...iOSUIKit.footnoteWhiteObject,
    opacity: 0.8,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});

export default memo(TitleHeader);
