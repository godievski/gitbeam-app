import React, { useCallback } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import ButtonHeader from "./ButtonHeader";
import { GENERAL_ICON_HEADER_SIZE } from "../../core/styles/general";

type ButtonBackProps = {
  modal?: boolean;
};

const ICON_NAME = "chevron-back-outline";

const ButtonBack: React.FC<ButtonBackProps> = ({ modal = false }) => {
  const navigation = useNavigation();

  const goBack = useCallback(() => {
    navigation.goBack();
  }, []);

  return modal ? (
    <ButtonHeader onPress={goBack} title="Cancel" />
  ) : (
    <ButtonHeader
      onPress={goBack}
      icon={
        <Icon size={GENERAL_ICON_HEADER_SIZE} name={ICON_NAME} color="#fff" />
      }
    />
  );
};

export default React.memo(ButtonBack);
