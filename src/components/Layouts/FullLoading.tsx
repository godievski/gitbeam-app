import React, { memo } from "react";
import { View, ActivityIndicator } from "react-native";
import { PRIMARY_COLOR } from "../../core/styles/colors";

type FullLoadingProps = {
  backgroundColor?: string;
};

const FullLoading: React.FC<FullLoadingProps> = (props) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        backgroundColor: props.backgroundColor ?? PRIMARY_COLOR,
      }}
    >
      <ActivityIndicator color="white" />
    </View>
  );
};

export default memo(FullLoading);
