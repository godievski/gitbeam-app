import React, { useCallback, useContext } from "react";
import {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  TextStyle,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../theme/hooks";
import {
  GENERAL_ICON_SIZE,
  GENERAL_CONTAINER_PADDING_VERTICAL,
} from "../../core/styles/general";
import { GENERAL_CONTAINER_PADDING_HORIZONTAL } from "../../core/styles/general";
import Separator from "./Separator";
import ModalvskiContext from "../Modalvski/ModalvskiContext";

interface ItemSelectProps {
  label: string;
  value: string;
  valueStyle?: TextStyle;
  onPress: () => void;
  borderBottom?: boolean;
  borderTop?: boolean;
  dismissModal?: boolean;
}

const ItemSelect: React.FC<ItemSelectProps> = (props) => {
  const {
    label,
    value,
    onPress,
    valueStyle = {},
    borderBottom = true,
    borderTop = false,
    dismissModal = true,
  } = props;

  const theme = useTheme();

  const modal = useContext(ModalvskiContext);

  const onPressHandler = useCallback(() => {
    if (dismissModal) {
      modal.close();
    }
    onPress();
  }, [onPress, dismissModal]);

  return (
    <>
      {borderTop && <Separator />}
      <TouchableHighlight
        style={styles.container}
        underlayColor={theme.colors.underlay_item}
        onPress={onPressHandler}
      >
        <View
          style={[
            styles.wrapper,
            { backgroundColor: theme.colors.bg_tertary_color },
          ]}
        >
          <View style={styles.subwrapper}>
            <Text
              style={[styles.label, { color: theme.colors.text_secondary }]}
            >
              {label}
            </Text>
            <Text
              style={[
                { color: theme.colors.text_primary },
                styles.value,
                valueStyle,
              ]}
            >
              {value}
            </Text>
          </View>
          <View style={styles.right}>
            <Icon
              name="chevron-forward-outline"
              size={GENERAL_ICON_SIZE}
              color={theme.colors.color_chevron_item}
            />
          </View>
        </View>
      </TouchableHighlight>
      {borderBottom && <Separator />}
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontWeight: "bold",
  },
  value: {
    paddingRight: 10,
    flexWrap: "wrap",
    paddingVertical: GENERAL_CONTAINER_PADDING_VERTICAL,
    fontSize: 16,
  },
  container: {
    overflow: "hidden",
  },
  wrapper: {
    paddingVertical: GENERAL_CONTAINER_PADDING_VERTICAL,
    paddingHorizontal: GENERAL_CONTAINER_PADDING_HORIZONTAL,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subwrapper: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flex: 1,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default React.memo(ItemSelect);
