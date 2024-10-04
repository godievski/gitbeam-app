import React, { memo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import TextThemed from "./TextThemed";
import { GENERAL_CONTAINER_PADDING_HORIZONTAL } from "../../core/styles/general";

const SectionListEmpty: React.FC<any> = (props) => {
  return (
    <SafeAreaView edges={["left", "right"]}>
      <View
        style={{
          paddingHorizontal: GENERAL_CONTAINER_PADDING_HORIZONTAL,
          paddingVertical: 16,
        }}
      >
        <TextThemed type="secondary">There's nothing here yet</TextThemed>
      </View>
    </SafeAreaView>
  );
};

export default memo(SectionListEmpty);
