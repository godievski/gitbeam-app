import React, { useCallback } from "react";
import { View } from "react-native";
import { useTheme } from "../../../../theme/hooks";
import TextThemed from "../../../../components/Commons/TextThemed";
import TouchableItem from "../../../../components/TouchableItem/TouchableItem";
import IconThemed from "../../../../components/Icons/IconThemed";
import Button from "../../../../components/Buttons/Button";
import { TLabel } from "../../../../core/gitlab/types/labels_types";

type PressFunc = (item: TLabel) => void;

type LabelRowProps = {
  item: TLabel;
  onPress: PressFunc;
  onLongPress: PressFunc;
  onPressStar: PressFunc;
  onPressSubscribe: PressFunc;
  showStar: boolean;
};

const LabelRow: React.FC<LabelRowProps> = ({
  item,
  onPress,
  onLongPress,
  onPressStar,
  onPressSubscribe,
  showStar,
}) => {
  //TODO: remove this for some reason
  const theme = useTheme();

  const onPressItem = useCallback(() => {
    onPress(item);
  }, [onPress, item]);

  const onLongPressItem = useCallback(() => {
    onLongPress(item);
  }, [onLongPress, item]);

  const onPressStarItem = useCallback(() => {
    onPressStar(item);
  }, [onPressStar, item]);

  const onPressSubscribeItem = useCallback(() => {
    onPressSubscribe(item);
  }, [onPressSubscribe, item]);

  const renderContent = useCallback(() => {
    return (
      <View>
        <TextThemed numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </TextThemed>
        {!!item.description ? (
          <TextThemed type="secondary" style={{ paddingTop: 4, fontSize: 13 }}>
            {item.description}
          </TextThemed>
        ) : (
          undefined
        )}
      </View>
    );
  }, [item]);

  const renderLeft = useCallback(() => {
    return (
      <View
        style={{
          height: 24,
          width: 24,
          backgroundColor: item.color,
          borderRadius: 6,
        }}
      />
    );
  }, [item]);

  const renderRight = useCallback(() => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {showStar ? (
          <Button type="clear" onPress={onPressStarItem}>
            <IconThemed
              type="git"
              name={item.priority !== null ? "star" : "star-o"}
              size={18}
            />
          </Button>
        ) : null}
        <Button
          type="solid"
          containerStyle={{ marginLeft: 6 }}
          style={{ backgroundColor: theme.colors.bg_tertary_color }}
          onPress={onPressSubscribeItem}
        >
          <TextThemed type="secondary" style={{ fontSize: 12 }}>
            {item.subscribed ? "Unsubscribe" : "Subscribe"}
          </TextThemed>
        </Button>
      </View>
    );
  }, [item, showStar, onPressStarItem, onPressSubscribeItem, theme]);

  return (
    <TouchableItem
      onPress={onPressItem}
      onLongPress={onLongPressItem}
      renderContent={renderContent}
      renderLeft={renderLeft}
      renderRight={renderRight}
    />
  );
};

export default React.memo(LabelRow);
