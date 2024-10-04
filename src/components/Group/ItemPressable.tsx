import React, { useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextStyle,
  TouchableHighlight,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../theme/hooks";
import {
  GENERAL_ICON_SIZE,
  GENERAL_CONTAINER_PADDING_VERTICAL,
} from "../../core/styles/general";
import { GENERAL_CONTAINER_PADDING_HORIZONTAL } from "../../core/styles/general";
import Separator from "./Separator";
import ModalvskiContext from "../Modalvski/ModalvskiContext";
import TextThemed from "../Commons/TextThemed";

const ITEM_LINK_ICON_SIZE = 17;

type ItemPressableProps = {
  title: string;
  titleStyle?: TextStyle;
  renderIcon?: () => React.ReactNode;
  onPress: () => void;
  renderRight?: () => React.ReactNode;
  chevron?: boolean;
  borderBottom?: boolean;
  borderTop?: boolean;
  dismissModal?: boolean;
};

export const ITEM_PRESSABLE_DEFAULT_HEIGHT = 55.5;

const ItemPressable: React.FC<ItemPressableProps> = (props) => {
  const {
    title,
    renderIcon,
    chevron,
    onPress,
    renderRight,
    titleStyle = {},
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
            {!!renderIcon && <View style={[styles.icon]}>{renderIcon()}</View>}
            <View>
              <Text
                style={[
                  { color: theme.colors.text_primary },
                  styles.title,
                  titleStyle,
                ]}
              >
                {title}
              </Text>
            </View>
          </View>
          {(!!chevron || !!renderRight) && (
            <View style={[styles.right]}>
              {!!renderRight && renderRight()}
              {!!chevron && (
                <Ionicons
                  style={{ marginLeft: !!renderRight ? 10 : 0 }}
                  name="chevron-forward-outline"
                  size={GENERAL_ICON_SIZE}
                  color={theme.colors.color_chevron_item}
                />
              )}
            </View>
          )}
        </View>
      </TouchableHighlight>
      {borderBottom && <Separator />}
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    paddingRight: 10,
    flexWrap: "wrap",
    paddingVertical: GENERAL_CONTAINER_PADDING_VERTICAL,
    fontSize: 16,
    fontWeight: "400",
  },
  container: {
    // borderRadius: GENERAL_BORDER,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  icon: {
    paddingRight: 12,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default React.memo(ItemPressable);
