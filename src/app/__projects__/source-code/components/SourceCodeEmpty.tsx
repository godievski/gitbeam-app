import React from "react";
import { Text, View } from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";
import { GREEN_COLOR } from "../../../../core/styles/colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
    marginBottom: 10,
  },
  text: {
    opacity: 0.75,
    fontSize: 18,
  },
  sub: {
    opacity: 0.6,
    fontSize: 14,
  },
});

const SourceCodeEmpty: React.FC<{}> = () => {
  return (
    <View style={styles.content}>
      <Icon size={128} name="gitlab" color={GREEN_COLOR} />
      <Text style={styles.text}>Empty data</Text>
    </View>
  );
};

export default React.memo(SourceCodeEmpty);
