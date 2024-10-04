import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { sizeOptions } from "../config/constants";
import TextSizeItem from "./TextSizeItem";

interface TextSizeOptionsProps {
  selectSize: (size: number) => any;
  selectedSize: number;
}

const TextSizeOptions: React.FC<TextSizeOptionsProps> = ({
  selectSize,
  selectedSize,
}) => {
  return (
    <FlatList
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      data={sizeOptions}
      extraData={selectedSize}
      style={styles.full}
      contentContainerStyle={styles.container}
      keyExtractor={(item, index) => `font-size-${index}`}
      renderItem={({ item: size, index }) => (
        <TextSizeItem
          item={size}
          selectItem={selectSize}
          isSelected={size == selectedSize}
          isFirst={index == 0}
          isLast={index == sizeOptions.length - 1}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  full: {
    width: "100%",
  },
  container: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    flex: 1,
    justifyContent: "space-between",
  },
});

export default React.memo(TextSizeOptions);
