import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import Avatar from "../Avatar/Avatar";
import TextThemed from "../Commons/TextThemed";
import ItemGroup from "../Group/ItemGroup";
import ItemComponent from "../Group/ItemComponent";
import FontAwesome from "react-native-vector-icons/FontAwesome5";

interface UserProfileProps {
  avatar_url: string | null;
  name: string;
  username: string;
  visibility?: "public" | "private";
}

const UserProfile: React.FC<UserProfileProps> = (props) => {
  const { avatar_url, username, name, visibility } = props;

  return (
    <ItemGroup>
      <ItemComponent borderBottom={false}>
        <View style={styles.container}>
          <View>
            <Avatar
              size="large"
              avatar_url={avatar_url}
              letter={username[0]}
              dimension="rounded"
              type={visibility ?? "public"}
            />
          </View>
          <View style={styles.info}>
            <TextThemed style={styles.name}>{name}</TextThemed>
            <View style={styles.container}>
              {!!visibility && (
                <TextThemed style={styles.icon}>
                  <FontAwesome
                    size={12}
                    name={visibility === "private" ? "lock" : "unlock"}
                  />
                </TextThemed>
              )}
              <TextThemed style={styles.username}>@{username}</TextThemed>
            </View>
          </View>
        </View>
      </ItemComponent>
    </ItemGroup>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  info: {
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
  },
  username: {
    fontSize: 15,
    fontWeight: "400",
    marginTop: 2,
  },
  icon: {
    marginRight: 6,
  },
});

export default memo(UserProfile);
