import React, { useCallback } from "react";
import FlatList from "../../../../components/RN/FlatList";
import MoreKeyItem from "../components/MoreKeyItem";
import Container from "../../../../components/Layouts/Container";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { addKeyConfig } from "../config/keyboardConfigSlice";
import { View } from "react-native";

interface ScreenProps {}

type KeyboardMoreProps = ScreenProps;

const KeyboardMore: React.FC<KeyboardMoreProps> = (props) => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const keyboardConfig = useAppSelector((state) => state.keyboardConfig);

  const addItem = useCallback((item) => {
    dispatch(addKeyConfig(item));
  }, []);

  const renderItem = useCallback(({ item, index }) => {
    return <MoreKeyItem item={item} index={index} addItem={addItem} />;
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
        <FlatList
          keyExtractor={(item) => `key-more-${item.id}`}
          data={keyboardConfig.more}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingBottom: insets.bottom,
            paddingTop: 10,
          }}
        />
      </View>
    </Container>
  );
};

export default KeyboardMore;
