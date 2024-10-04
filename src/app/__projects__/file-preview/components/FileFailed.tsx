import React from "react";
// import IconGit from '../../../components/IconGit';
import { Text, View } from "react-native";
import { GREEN_COLOR } from "../../../../core/styles/colors";

import IconFA from "react-native-vector-icons/FontAwesome5";

const FileFailed = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <IconFA name="file-alt" size={128} color={GREEN_COLOR} />
      <Text
        style={{
          fontSize: 24,
          opacity: 0.8,
          textAlign: "center",
          marginTop: 12,
          color: "#fff",
          backgroundColor: "#000",
        }}
      >
        This file cannot be shown
      </Text>
    </View>
  );
};

export default FileFailed;
