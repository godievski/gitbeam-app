import React, { memo } from "react";
import { View, Image } from "react-native";
import TextThemed from "../Commons/TextThemed";

const RoseImgBlue = require("../../../assets/img/rose_blue.png");

type EmptyStateProps = {
  message?: string;
  loading?: boolean;
};

const EmptyState: React.FC<EmptyStateProps> = ({ message, loading }) => {
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
      }}
    >
      <View
        style={{
          width: 140,
          height: 140,
        }}
      >
        <Image
          style={{ flex: 1, width: undefined, height: undefined }}
          resizeMode="contain"
          source={RoseImgBlue}
        />
      </View>
      <View style={{ paddingTop: 10, paddingBottom: 80 }}>
        <TextThemed
          type="secondary"
          style={{ fontSize: 18, fontWeight: "600" }}
        >
          {loading ? "Loading..." : message ?? "There's nothing here yet"}
        </TextThemed>
      </View>
    </View>
  );
};

export default memo(EmptyState);
