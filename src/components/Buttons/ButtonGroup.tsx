import React from "react";
import { StyleSheet, View } from "react-native";

type ButtonGroupProps = {
  spacing?: number;
  direction?: "left" | "right" | "center";
  children: React.ReactElement[];
};

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  spacing = 6,
  direction = "right",
  children,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          justifyContent:
            direction === "right"
              ? "flex-end"
              : direction === "left"
              ? "flex-start"
              : "center",
        },
      ]}
    >
      {children.map((child, index) => {
        let paddingLeft = 0;
        let paddingRight = 0;
        if (children.length > 1 && spacing > 0) {
          if (direction === "left") {
            if (index !== children.length - 1) {
              paddingRight = spacing;
            }
          } else if (direction === "right") {
            if (index !== 0) {
              paddingLeft = spacing;
            }
          } else {
            paddingLeft = spacing / 2;
            paddingRight = spacing / 2;
            if (index === 0) {
              paddingLeft = 0;
            } else if (index === children.length - 1) {
              paddingRight = 0;
            }
          }
        }
        return (
          <View
            key={`button-group-item-${index}`}
            style={{
              paddingRight,
              paddingLeft,
            }}
          >
            {child}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default React.memo(ButtonGroup);
