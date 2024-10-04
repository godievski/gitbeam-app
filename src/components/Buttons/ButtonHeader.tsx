import React, { useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { GENERAL_ICON_HEADER_SIZE } from "../../core/styles/general";
import Button from "./Button";

interface ButtonHeaderProps {
  icon?: React.ReactElement;
  title?: string;
  onPress?: () => void;
  backBtn?: boolean;
}

const ButtonHeader: React.FC<ButtonHeaderProps> = (props) => {
  const { onPress, icon, title, backBtn = false } = props;

  const navigation = useNavigation();

  const onPressBtn = useCallback(() => {
    if (!!onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  }, [onPress, backBtn]);

  return (
    <Button type="clear" onPress={onPressBtn}>
      <View style={styles.container}>
        {!!icon && <View style={{ marginRight: !!title ? 6 : 0 }}>{icon}</View>}
        {!!title && <Text style={styles.title}>{title}</Text>}
      </View>
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    paddingHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 40,
  },
  title: {
    ...iOSUIKit.subheadEmphasizedWhiteObject,
    fontSize: 14,
    textTransform: "uppercase",
    color: "#fff",
  },
});

export const IconPlus = (
  <Icon size={GENERAL_ICON_HEADER_SIZE} name="add-outline" color="#fff" />
);

export const IconSearch = (
  <Icon size={GENERAL_ICON_HEADER_SIZE} name="search-outline" color="#fff" />
);

export default React.memo(ButtonHeader);
