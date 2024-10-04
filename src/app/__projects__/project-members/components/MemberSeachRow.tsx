import React, { useCallback, memo } from "react";
import { UserBasic } from "../../../../core/gitlab/types";
import Avatar from "../../../../components/Avatar/Avatar";
import TextThemed from "../../../../components/Commons/TextThemed";
import { View } from "react-native";
import TouchableItem from "../../../../components/TouchableItem/TouchableItem";
import { renderIconCheck } from "../../../../components/Icons/Icons";

interface MemberSearchRowProps {
  item: UserBasic;
  selected: boolean;
  onPress: (item: UserBasic) => void;
}
const MemberSearchRow: React.FC<MemberSearchRowProps> = ({
  item,
  selected,
  onPress,
}) => {
  const onPressItem = useCallback(() => {
    onPress(item);
  }, [onPress, item]);

  const renderContent = useCallback(() => {
    return (
      <View>
        <TextThemed>{item.name}</TextThemed>
        <TextThemed style={{ fontSize: 13 }}>{`@${item.username}`}</TextThemed>
      </View>
    );
  }, [item]);

  const renderLeft = useCallback(() => {
    return (
      <Avatar
        avatar_url={item.avatar_url}
        type="public"
        letter={item.username[0]}
        size={36}
        dimension="rounded"
      />
    );
  }, [item]);

  return (
    <TouchableItem
      onPress={onPressItem}
      renderContent={renderContent}
      renderLeft={renderLeft}
      renderRight={selected ? renderIconCheck : undefined}
    />
  );
};

export default memo(MemberSearchRow);
