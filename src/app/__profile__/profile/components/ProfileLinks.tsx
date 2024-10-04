import React, { useCallback } from "react";
import IconFA from "react-native-vector-icons/FontAwesome5";
import { View, Text } from "react-native";
import ItemGroup from "../../../../components/Group/ItemGroup";
import ItemPressable from "../../../../components/Group/ItemPressable";
import { useTheme } from "../../../../theme/hooks";
import Badge from "../../../../components/Commons/Badge";
import { BADGE_STYLES } from "../../../../components/Commons/Badge";
import IconRound from "../../../../components/Icons/IconRound";
import HeaderIndicator from "../../../../components/Header/HeaderIndicator";

type ProfileLinksProps = {
  onPressSSHKeys: () => void;
  keysCount: number;
  loading: boolean;
};

const ProfileLinks: React.FC<ProfileLinksProps> = ({
  onPressSSHKeys,
  keysCount,
  loading,
}) => {
  const theme = useTheme();

  const renderRight = useCallback(() => {
    return (
      <Badge style={{ backgroundColor: theme.colors.topbar_bg }}>
        {loading ? (
          <HeaderIndicator />
        ) : (
          <Text style={BADGE_STYLES.text}>{keysCount}</Text>
        )}
      </Badge>
    );
  }, [theme, keysCount, loading]);

  return (
    <View style={{ paddingVertical: 10 }}>
      <ItemGroup>
        <ItemPressable
          title="SSH Keys"
          renderIcon={() => <IconRound type="fontawesome" name="key" />}
          chevron={true}
          renderRight={renderRight}
          onPress={onPressSSHKeys}
          borderBottom={false}
        />
      </ItemGroup>
    </View>
  );
};

export default React.memo(ProfileLinks);
