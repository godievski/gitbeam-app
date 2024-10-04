import React, { useCallback, useRef } from "react";
import {
  FlatList as RNFlatList,
  FlatListProps,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props<ItemT> extends FlatListProps<ItemT> {
  onRealEndReached?: () => void;
}

const FlatList = function<T>({
  onRealEndReached = () => {},
  contentContainerStyle,
  style,
  ...res
}: Props<T>) {
  const insets = useSafeAreaInsets();

  const callOnScrollEnd = useRef(false);

  const onEndReached = useCallback(() => {
    callOnScrollEnd.current = true;
  }, []);

  const onMomentumScrollEnd = useCallback(() => {
    callOnScrollEnd.current && onRealEndReached();
    callOnScrollEnd.current = false;
  }, [onRealEndReached]);

  return (
    <RNFlatList
      {...res}
      style={StyleSheet.flatten([{ flex: 1 }, style])}
      contentContainerStyle={StyleSheet.flatten([
        {
          paddingBottom: insets.bottom,
          minHeight: "100%",
          width: "100%",
        },
        contentContainerStyle,
      ])}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.2}
      onMomentumScrollEnd={onMomentumScrollEnd}
    />
  );
};

export default FlatList;
