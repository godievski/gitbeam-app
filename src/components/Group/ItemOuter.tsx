import React, { memo } from "react";
import { View, SafeAreaView } from "react-native";
import {
  GENERAL_CONTAINER_PADDING_HORIZONTAL,
  GENERAL_CONTAINER_PADDING_VERTICAL,
} from "../../core/styles/general";

const ItemOuter: React.FC<any> = (props) => {
  return (
    <SafeAreaView>
      <View
        style={{
          paddingHorizontal: GENERAL_CONTAINER_PADDING_HORIZONTAL * 1.5,
          paddingVertical: GENERAL_CONTAINER_PADDING_VERTICAL,
          ...props.style,
        }}
      >
        {props.children}
      </View>
    </SafeAreaView>
  );
};

export default memo(ItemOuter);
