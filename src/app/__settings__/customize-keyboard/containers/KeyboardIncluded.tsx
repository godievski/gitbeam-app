import React, { useCallback, memo } from "react";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import IncludedKeyItem from "../components/IncludedKeyItem";
import Container from "../../../../components/Layouts/Container";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { KeyHelper } from "../config/types";
import {
  removeKeyConfig,
  updateOrderKeyboardConfig,
} from "../config/keyboardConfigSlice";
import { View } from "react-native";

type KeyboardIncludedProps = {};

const KeyboardIncluded: React.FC<KeyboardIncludedProps> = (props) => {
  const dispatch = useAppDispatch();
  const keyboardConfig = useAppSelector((state) => state.keyboardConfig);

  const insets = useSafeAreaInsets();

  const removeItem = useCallback((item) => {
    dispatch(removeKeyConfig(item));
  }, []);

  const renderItem = useCallback(
    ({ item, index, drag, isActive }: RenderItemParams<KeyHelper>) => {
      return (
        <IncludedKeyItem
          item={item}
          index={index}
          drag={drag}
          isActive={isActive}
          removeItem={removeItem}
        />
      );
    },
    []
  );

  const onDragBegin = useCallback((index) => {}, []);

  const onDragEnd = useCallback(({ data }: { data: KeyHelper[] }) => {
    dispatch(updateOrderKeyboardConfig(data));
  }, []);

  return (
    <Container>
      <View
        style={{
          flex: 1,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
        <DraggableFlatList
          data={keyboardConfig.included}
          renderItem={renderItem}
          keyExtractor={(item, index) => `key-included-${item.id}`}
          onDragBegin={onDragBegin}
          onDragEnd={onDragEnd}
          contentContainerStyle={{
            minHeight: "100%",
            paddingTop: 10,
            paddingBottom: insets.bottom,
          }}
          activationDistance={20}
        />
      </View>
    </Container>
  );
};

export default memo(KeyboardIncluded);
