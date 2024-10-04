import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Image from "./Image";

export type AvatarSize = number | "small" | "medium" | "large" | "xlarge";

export interface CustomeAvatarProps {
  avatar_url: string | null;
  type: string;
  letter: string;
  size: AvatarSize;
  dimension?: "rounded" | "square";
  containerStyle?;
}

const BORDER_RADIUS = 8;

const sizes = {
  smal: 34,
  medium: 50,
  large: 75,
  xlarge: 150,
};

const style = StyleSheet.create({
  avatar: {
    flex: 1,
    width: null,
    height: null,
  } as any,
});

const Avatar: React.FC<CustomeAvatarProps> = (props) => {
  const { avatar_url, type, letter, size, dimension = "square" } = props;

  const avatar_dimension = Number.isInteger(size) ? size : sizes[size];

  const { width, height } = {
    width: avatar_dimension,
    height: avatar_dimension,
  };

  const source =
    avatar_url == null || type === "private" ? undefined : { uri: avatar_url };

  const rounded = dimension === "rounded";
  const borderRadius = rounded ? height / 2 : BORDER_RADIUS;

  return (
    <View style={{ width, height, backgroundColor: "transparent" }}>
      <Image
        source={source}
        style={style.avatar}
        containerStyle={{ flex: 1, borderRadius }}
        borderRadius={rounded ? borderRadius : undefined}
        renderPlaceholder={() => {
          return (
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontSize: height / 2,
              }}
            >
              {letter.toUpperCase()}
            </Text>
          );
        }}
      />
    </View>
  );
};

export default memo(Avatar);
