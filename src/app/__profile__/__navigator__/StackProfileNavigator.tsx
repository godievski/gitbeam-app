import React, { useLayoutEffect } from "react";
import Profile from "../profile/containers/Profile";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { PROFILE_SCREEN_NAME } from "../profile/config/navigation";
import { SINGLE_SSH_KEY_SCREEN_NAME } from "../ssh-keys/config/navigation";
import SinglesSshKey from "../ssh-keys/containers/SinglesSshKey";
import { SSH_KEYS_SCREEN_NAME } from "../ssh-keys/config/navigation";
import SshKeys from "../ssh-keys/containers/SshKeys";

const Stack = createStackNavigator();

const StackProfileNavigator = (props) => {
  // useLayoutEffect(() => {
  //   const route = props.route as any;
  //   props.navigation.setOptions({
  //     gestureEnabled: route.state && route.state.index > 0 ? false : true,
  //   });
  // });

  return (
    <Stack.Navigator
      initialRouteName={PROFILE_SCREEN_NAME}
      headerMode="none"
      screenOptions={{
        gestureEnabled: true,
        cardOverlayEnabled: true,
        cardStyle: {
          backgroundColor: "transparent",
        },
      }}
    >
      <Stack.Screen name={PROFILE_SCREEN_NAME} component={Profile} />
      <Stack.Screen name={SSH_KEYS_SCREEN_NAME} component={SshKeys} />
    </Stack.Navigator>
  );
};

const StackModal = createStackNavigator();
const PROFILE_STACK_SCREEN_NAME = "PROFILE_STACK_SCREEN_NAME";

const StackProfileModalNavigator = (props) => {
  useLayoutEffect(() => {
    const route = props.route as any;
    props.navigation.setOptions({
      gestureEnabled: route.state && route.state.index > 0 ? false : true,
    });
  });

  return (
    <StackModal.Navigator
      headerMode="none"
      initialRouteName={PROFILE_STACK_SCREEN_NAME}
      screenOptions={{
        gestureEnabled: true,
        cardOverlayEnabled: true,
        cardStyle: {
          backgroundColor: "transparent",
        },
        ...TransitionPresets.ModalPresentationIOS,
      }}
    >
      <Stack.Screen
        name={PROFILE_STACK_SCREEN_NAME}
        component={StackProfileNavigator}
      />
      <Stack.Screen
        name={SINGLE_SSH_KEY_SCREEN_NAME}
        component={SinglesSshKey}
        options={TransitionPresets.ModalPresentationIOS}
      />
    </StackModal.Navigator>
  );
};

export default StackProfileModalNavigator;
