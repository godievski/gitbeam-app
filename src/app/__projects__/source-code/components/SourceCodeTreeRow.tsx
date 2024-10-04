import React, { memo, useMemo, useCallback } from "react";
import { ICON_SOURCE_CODE_COLOR } from "../../../../core/styles/colors";
import { View } from "react-native";
import {
  GENERAL_ICON_SIZE,
  getBadgeFromAction,
} from "../../../../core/styles/general";
import Badge from "../../../../components/Commons/Badge";
import IconThemed from "../../../../components/Icons/IconThemed";
import TextThemed from "../../../../components/Commons/TextThemed";
import TouchableItem from "../../../../components/TouchableItem/TouchableItem";
import { ActionChange } from "../../../../core/gitlab/types/repository_files_types";
import { TRepoNode } from "../../../../core/gitlab/types/repository_types";

interface SourceCodeTreeRowProps {
  item: TRepoNode;
  index: number;
  onPress: (item: TRepoNode) => void;
  onLongPress: (item: TRepoNode) => void;
  action_change?: ActionChange;
}

const SourceCodeTreeRow: React.FC<SourceCodeTreeRowProps> = ({
  item,
  index,
  onPress,
  onLongPress,
  action_change,
}) => {
  const onPressItem = useCallback(() => {
    onPress(item);
  }, [onPress, item]);

  const onLongPressItem = useCallback(() => {
    onLongPress(item);
  }, [onLongPress, item]);

  const renderContent = useCallback(() => {
    return <TextThemed>{item.name}</TextThemed>;
  }, [item]);

  const renderLeft = useCallback(() => {
    return item.type === "blob" ? (
      <IconThemed
        type="fontawesome"
        name="file-alt"
        size={GENERAL_ICON_SIZE}
        color={ICON_SOURCE_CODE_COLOR}
      />
    ) : (
      <IconThemed
        type="fontawesome"
        name="folder"
        solid
        size={GENERAL_ICON_SIZE}
        color={ICON_SOURCE_CODE_COLOR}
      />
    );
  }, [item]);

  const renderRight = useMemo(() => {
    const action_change_badge = getBadgeFromAction(action_change?.action ?? "");
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
  }, [action_change]);

  return (
    <TouchableItem
      onPress={onPressItem}
      onLongPress={onLongPressItem}
      renderContent={renderContent}
      renderLeft={renderLeft}
      renderRight={renderRight}
      bottomDivider={false}
      index={index}
      alternate={true}
    />
  );
};

export default memo(SourceCodeTreeRow);
