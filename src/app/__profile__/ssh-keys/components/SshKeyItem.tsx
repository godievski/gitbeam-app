import React, { memo, useCallback } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../../../theme/hooks";
import { GENERAL_ICON_SIZE } from "../../../../core/styles/general";
import TouchableItem from "../../../../components/TouchableItem/TouchableItem";
import TextThemed from "../../../../components/Commons/TextThemed";
import { TSShKey } from "../../../../core/gitlab/types/users_types";

type Props = {
  item: TSShKey;
  onPress: (item: TSShKey) => void;
};

type SshKeyItemProps = Props;

const SshKeyItem: React.FC<SshKeyItemProps> = ({ item, onPress }) => {
  const theme = useTheme();
  const onPressHandler = useCallback(() => {
    onPress(item);
  }, [onPress, item]);

  return (
    <TouchableItem
      onPress={onPressHandler}
      renderContent={() => <TextThemed>{item.title}</TextThemed>}
      renderRight={() => (
        <Icon
          name="chevron-forward-outline"
          size={GENERAL_ICON_SIZE}
          color={theme.colors.color_chevron_item}
        />
      )}
    />
  );
};

export default memo(SshKeyItem);
