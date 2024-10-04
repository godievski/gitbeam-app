import React, { memo, useCallback, useMemo } from "react";
import { View } from "react-native";
import { ICON_SOURCE_CODE_COLOR } from "../../../../core/styles/colors";
import IconFA from "react-native-vector-icons/FontAwesome5";
import RadioBtn from "../../../../components/Buttons/RadioBtn";
import { useTheme } from "../../../../theme/hooks";
import {
  GENERAL_ICON_SIZE,
  getBadgeFromAction,
} from "../../../../core/styles/general";
import Badge from "../../../../components/Commons/Badge";
import TouchableItem from "../../../../components/TouchableItem/TouchableItem";
import TextThemed from "../../../../components/Commons/TextThemed";
import Animated, { Extrapolate } from "react-native-reanimated";
import { interpolate } from "react-native-reanimated";
import { ActionChange } from "../../../../core/gitlab/types/repository_files_types";

type ChangesActionProps = {
  action: ActionChange;
  selected: boolean;
  onLongPress: (action: ActionChange) => void;
  onPress: (action: ActionChange) => void;
  index: number;
  animation: Animated.Node<number>;
};

const ANIMATION_DISTANCE = 40;

const inputRange = [0, 1];

const ChangesAction: React.FC<ChangesActionProps> = ({
  action,
  selected,
  onPress,
  onLongPress,
  index,
  animation,
}) => {
  const theme = useTheme();
  const left = interpolate(animation, {
    inputRange,
    outputRange: [-ANIMATION_DISTANCE, 0],
    extrapolate: Extrapolate.CLAMP,
  });
  const opacity = interpolate(animation, {
    inputRange,
    outputRange: [0, 1],
  });
  const paddingLeft = interpolate(animation, {
    inputRange,
    outputRange: [0, ANIMATION_DISTANCE],
  });

  const onPressItem = useCallback(() => {
    onPress(action);
  }, [action, onPress]);

  const onLongPressItem = useCallback(() => {
    onLongPress(action);
  }, [action, onLongPress]);

  const backgroundColor = useMemo(
    () => (selected ? theme.colors.item_selected : undefined),
    [theme, selected]
  );

  const renderContent = useCallback(() => {
    return (
      <View>
        <TextThemed style={{ fontSize: 14, flexWrap: "wrap", lineHeight: 18 }}>
          {action.file_name}
        </TextThemed>
        <TextThemed
          type="secondary"
          style={{ fontSize: 12, flexWrap: "wrap", lineHeight: 16 }}
        >
          {action.file_path}
        </TextThemed>
      </View>
    );
  }, [action]);

  const renderLeft = useCallback(() => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Animated.View
          style={{
            justifyContent: "center",
            alignItems: "center",
            left,
            opacity,
            position: "absolute",
          }}
        >
          <RadioBtn selected={selected} onPress={onPressItem} type="square" />
        </Animated.View>
        <Animated.View
          style={{
            paddingLeft,
          }}
        >
          <IconFA
            name="file-alt"
            size={GENERAL_ICON_SIZE}
            color={ICON_SOURCE_CODE_COLOR}
          />
        </Animated.View>
      </View>
    );
  }, [action, onPressItem, selected]);

  const renderRight = useMemo(() => {
    const action_change_badge = getBadgeFromAction(action.action ?? "");
    if (action_change_badge === undefined) {
      return undefined;
    } else {
      return () => (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Badge
            style={{ backgroundColor: action_change_badge.color }}
            textStyle={{ fontWeight: "600" }}
          >
            {action_change_badge.text}
          </Badge>
        </View>
      );
    }
  }, [action]);

  return (
    <TouchableItem
      onPress={onPressItem}
      onLongPress={onLongPressItem}
      renderContent={renderContent}
      renderLeft={renderLeft}
      renderRight={renderRight}
      bottomDivider={false}
      backgroundColor={backgroundColor}
      index={index}
      alternate={true}
    />
  );
};

export default memo(ChangesAction);
