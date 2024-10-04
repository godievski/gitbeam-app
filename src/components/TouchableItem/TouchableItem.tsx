import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../../theme/hooks";
import { SafeAreaView } from "react-native-safe-area-context";
import { GENERAL_CONTAINER_PADDING_HORIZONTAL } from "../../core/styles/general";
import { TouchableHighlight } from "react-native-gesture-handler";

const { useMemo } = React;

export type TouchableItemProps = {
  //main props
  onPress?: () => void;
  onLongPress?: () => void;
  renderLeft?: () => React.ReactElement | null | undefined;
  renderContent: () => React.ReactElement;
  renderRight?: () => React.ReactElement | null | undefined;
  //optional props
  index?: number;
  backgroundColor?: string;
  alternate?: boolean;
  bottomDivider?: boolean;
  topDivider?: boolean;
  containerStyle?: ViewStyle;
};

const TouchableItem: React.FC<TouchableItemProps> = ({
  //main props
  onPress = () => {},
  onLongPress = () => {},
  renderLeft,
  renderRight,
  renderContent,
  //optional props
  index,
  backgroundColor,
  alternate = false,
  bottomDivider = true,
  topDivider = false,
  containerStyle = {},
}) => {
  const theme = useTheme();

  const mainBackgroundColor = useMemo(() => {
    return (
      backgroundColor ??
      (index === undefined || !alternate
        ? theme.colors.bg_color
        : index % 2
        ? theme.colors.item_bg_2
        : theme.colors.item_bg_1)
    );
  }, [index, alternate, theme, backgroundColor]);

  const style_container = useMemo(
    () =>
      StyleSheet.flatten([
        styles.container,
        {
          backgroundColor: mainBackgroundColor,
          borderColor: theme.colors.divider_color,
          borderBottomWidth: bottomDivider
            ? theme.isDark
              ? 0
              : StyleSheet.hairlineWidth
            : 0,
          borderTopWidth: topDivider
            ? theme.isDark
              ? 0
              : StyleSheet.hairlineWidth
            : 0,
        },
        containerStyle,
      ]),
    [mainBackgroundColor, containerStyle]
  );

  const style_content = useMemo(
    () =>
      StyleSheet.flatten([
        styles.content,
        {
          paddingLeft: !!renderLeft
            ? GENERAL_CONTAINER_PADDING_HORIZONTAL * 0.75
            : 0,
          paddingRight: !!renderRight
            ? GENERAL_CONTAINER_PADDING_HORIZONTAL * 0.75
            : 0,
        },
      ]),
    [renderLeft, renderRight]
  );

  return (
    <TouchableHighlight
      underlayColor={theme.colors.underlay_item}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.touchable}
    >
      <SafeAreaView edges={["left", "right"]} style={style_container}>
        {!!renderLeft && renderLeft()}
        <View style={style_content}>
          <View style={styles.content_inner}>{renderContent()}</View>
        </View>
        {!!renderRight && renderRight()}
      </SafeAreaView>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  touchable: {
    backgroundColor: "transparent",
    width: "100%",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "nowrap",
    paddingHorizontal: GENERAL_CONTAINER_PADDING_HORIZONTAL,
    // paddingVertical: GENERAL_CONTAINER_PADDING_VERTICAL * 1.5,
    paddingVertical: 14,
    position: "relative",
  },
  content: {
    flex: 1,
  },
  content_inner: {
    width: "100%",
  },
});

export default React.memo(TouchableItem);
