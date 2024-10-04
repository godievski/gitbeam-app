import React, { useCallback } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import Button from "./Button";
import { GENERAL_ICON_HEADER_SIZE } from "../../core/styles/general";

const ICON_NAME = "menu-outline";

const ButtonBurger: React.FC<{}> = (props) => {
  const navigation = useNavigation();
  const onPress = useCallback(() => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  }, []);

  return (
    <Button type="clear" onPress={onPress}>
      <Icon size={GENERAL_ICON_HEADER_SIZE} name={ICON_NAME} color="#fff" />
    </Button>
  );
};

export default React.memo(ButtonBurger);
