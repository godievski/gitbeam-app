import React, { useMemo } from "react";

import IconFA from "react-native-vector-icons/FontAwesome5";
import StackProjectsNavigator from "../../__projects__/__navigator__/StackProjectsModalNavigator";
import StackProfileNavigator from "../../__profile__/__navigator__/StackProfileNavigator";
import StackSettingsNavigator from "../../__settings__/__navigator__/StackSettingsNavigator";
import IconGit from "../../../components/Icons/IconGit";
import { useWindowDimensions, Platform } from "react-native";
import DrawerContentComp from "../components/DrawerContentComp";
import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from "@react-navigation/drawer";
import { RouteProp } from "@react-navigation/native";
import { MainStackParamList } from "../config/navigation";
import { STACK_PROJECT_NAVIGATOR_SCREEN_NAME } from "../../__projects__/__navigator__/config";
import { STACK_PROFILE_NAVIGATOR_SCREEN_NAME } from "../../__profile__/__navigator__/config";
import { STACK_SETTINGS_NAVIGATOR_SCREEN_NAME } from "../../__settings__/__navigator__/config";

const Drawer = createDrawerNavigator();

const ICON_SIZE = 18;

type MainScreenRouteProp = RouteProp<
  MainStackParamList,
  typeof STACK_PROJECT_NAVIGATOR_SCREEN_NAME
>;

type MainScreenNavigationProp = DrawerNavigationProp<
  MainStackParamList,
  typeof STACK_PROJECT_NAVIGATOR_SCREEN_NAME
>;

export interface MainNavigatorProps {
  route: MainScreenRouteProp;
  navigation: MainScreenNavigationProp;
}

const Main = (props) => {
  const { height, width } = useWindowDimensions();

  const { isLargeScreen, drawerWidth } = useMemo(() => {
    const smallerAxisSize = Math.min(height, width);
    const isLandscape = width > height;
    const isLargeScreen = smallerAxisSize >= 600;
    const appBarHeight = Platform.OS === "ios" ? (isLandscape ? 32 : 44) : 56;
    const maxWidth = isLargeScreen ? 320 : 240;

    const drawerWidth = Math.min(smallerAxisSize - appBarHeight, maxWidth);
    return {
      isLargeScreen,
      drawerWidth,
    };
  }, [height, width]);

  return (
    <Drawer.Navigator
      initialRouteName={STACK_PROJECT_NAVIGATOR_SCREEN_NAME}
      drawerPosition="left"
      // drawerType={isLargeScreen ? "permanent" : "front"}
      // drawerStyle={isLargeScreen ? null : { width: drawerWidth }}
      drawerType={isLargeScreen ? "front" : "front"}
      drawerStyle={{ width: drawerWidth }}
      backBehavior="none"
      drawerContent={(props) => <DrawerContentComp {...props} />}
    >
      <Drawer.Screen
        name={STACK_PROJECT_NAVIGATOR_SCREEN_NAME}
        component={StackProjectsNavigator}
        options={{
          title: "Projects",
          drawerIcon: ({ color }) => (
            <IconFA name="folder" size={ICON_SIZE} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={STACK_PROFILE_NAVIGATOR_SCREEN_NAME}
        component={StackProfileNavigator}
        options={{
          title: "Profile",
          drawerIcon: ({ color }) => (
            <IconGit name="user-light" size={ICON_SIZE} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={STACK_SETTINGS_NAVIGATOR_SCREEN_NAME}
        component={StackSettingsNavigator}
        options={({ route }) => {
          return {
            title: "Settings",
            drawerIcon: ({ color }) => (
              <IconGit name="cog" size={ICON_SIZE} color={color} />
            ),
          };
        }}
      />
    </Drawer.Navigator>
  );
};

export default Main;
