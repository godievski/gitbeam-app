import React, { useMemo, useContext, useCallback } from "react";
import { DrawerItemList } from "@react-navigation/drawer";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Text,
  Platform,
  PixelRatio,
} from "react-native";
import { connect } from "react-redux";
import Avatar from "../../../components/Avatar/Avatar";
import IconGit from "../../../components/Icons/IconGit";
import { GENERAL_ICON_HEADER_SIZE } from "../../../core/styles/general";
import { ThemeModalContext } from "../../modals/ThemeModal";
import Button from "../../../components/Buttons/Button";
import { useAppSelector } from "../../../store/hooks";
import { useTheme } from "../../../theme/hooks";

type DrawerItemsCustomeProps = {
  drawerOpenProgress: any;
};

const DrawerContentComp: React.FC<any> = (props) => {
  // const translateY = props.drawerOpenProgress.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [-100, 0]
  // });

  const themeModal = useContext(ThemeModalContext);

  const user = useAppSelector((state) => state.user.data);
  const theme = useTheme();

  const iconName = theme.isDark ? "bulb" : "bulb-on";

  const showDarkModeOptions = useCallback(() => {
    themeModal.open();
  }, []);

  const drawerItemsProps = useMemo(
    () => ({
      activeTintColor: theme.colors.drawer_active_text,
      activeBackgroundColor: theme.colors.drawer_active_bg,
      inactiveTintColor: theme.colors.drawer_inactive_text,
      labelStyle: {
        fontSize: 17,
        fontWeight: "500",
        marginHorizontal: 0,
        color: theme.colors.drawer_active_text,
      },
      itemsContainerStyle: {
        paddingVertical: 0,
      },
    }),
    [theme.isDark]
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.drawer_bg,
          borderRightWidth: Platform.select({
            ios: 0,
            android: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
          }),
          borderRightColor: "white",
        },
      ]}
    >
      <SafeAreaView
        style={[
          styles.content,
          { borderRightColor: theme.colors.drawer_separator },
        ]}
      >
        {/**
         * Header
         */}
        {!!user && !!user.username && (
          <View style={styles.header}>
            <Avatar
              size={52}
              avatar_url={user.avatar_url}
              letter={user.username[0]}
              type={user.private_profile ? "private" : "public"}
              dimension="rounded"
            />
            <Text
              style={[styles.name, { color: theme.colors.drawer_active_text }]}
            >
              {user.name}
            </Text>
            <Text
              style={[
                styles.username,
                { color: theme.colors.drawer_active_text },
              ]}
            >
              @{user.username}
            </Text>
          </View>
        )}
        {/*
         * Items
         */}
        <ScrollView style={{ flex: 1 }}>
          <DrawerItemList {...props} {...drawerItemsProps} />
        </ScrollView>
        {/*
         * Footer
         */}
        <View
          style={{
            padding: 16,
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <View>
            <Button type="clear" onPress={showDarkModeOptions}>
              <IconGit
                name={iconName}
                size={GENERAL_ICON_HEADER_SIZE}
                color={theme.colors.drawer_button_bg}
              />
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

// const onePixel = 1 / PixelRatio.getPixelSizeForLayoutSize(1);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    borderRightWidth: 0,
  },
  header: {
    width: "100%",
    paddingTop: 19,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  name: {
    paddingTop: 8,
    fontSize: 18,
    fontWeight: "600",
    opacity: 1,
  },
  username: {
    fontSize: 15,
    opacity: 0.75,
  },
  footer: {
    width: "100%",
    borderRadius: 9,
  },
  buttonTitle: {
    paddingLeft: 6,
    fontSize: 15,
  },
  button: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
  },
});

export default DrawerContentComp;
