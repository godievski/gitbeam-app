import React, { useCallback } from "react";
import { View, TouchableOpacity } from "react-native";
import TextThemed from "../../../../components/Commons/TextThemed";
import Badge from "../../../../components/Commons/Badge";
import { useTheme } from "../../../../theme/hooks";
import { UserBasic } from "../../../../core/gitlab/types";
import { GENERAL_ICON_SIZE } from "../../../../core/styles/general";
import IconThemed from "../../../../components/Icons/IconThemed";

type MembersSelectablesProps = {
  users: UserBasic[];
  removeUser: (u: UserBasic) => any;
};

const MembersSelectables: React.FC<MembersSelectablesProps> = ({
  users,
  removeUser,
}) => {
  const theme = useTheme();

  const renderItem = useCallback(
    (user: UserBasic) => {
      const onPressRemove = () => removeUser(user);
      return (
        <View
          style={{ marginRight: 8, marginBottom: 6 }}
          key={`row-selected-${user.id}`}
        >
          <Badge style={{ backgroundColor: theme.colors.bg_color }}>
            <View
              style={{
                flexDirection: "row",
                paddingLeft: 4,
                alignItems: "center",
                flex: 1,
                justifyContent: "center",
              }}
            >
              <TextThemed>{user.name}</TextThemed>
              <TouchableOpacity
                onPress={onPressRemove}
                style={{ paddingHorizontal: 6 }}
              >
                <IconThemed
                  type="fontawesome"
                  size={GENERAL_ICON_SIZE}
                  name="times"
                />
              </TouchableOpacity>
            </View>
          </Badge>
        </View>
      );
    },
    [removeUser, theme]
  );

  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {users.length === 0 ? (
        <TextThemed type="secondary">No members selected</TextThemed>
      ) : null}
      {users.map(renderItem)}
    </View>
  );
};

export default React.memo(MembersSelectables);
