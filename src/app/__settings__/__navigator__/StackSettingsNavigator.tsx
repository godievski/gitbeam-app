import React, { useLayoutEffect } from "react";
import Settings from "../settings/containers/Settings";
import About from "../about/containers/About";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { ABOUT_SCREEN_NAME } from "../about/config/navigation";
import Acknowledgements from "../acknowledgements/containers/Acknowledgements";
import { ACKNOWLEDGEMENTS_SCREEN_NAME } from "../acknowledgements/config/navigation";
import ThemeSettings from "../highlight-setting/containers/ThemeSettings";
import EditorSettings from "../editor-setting/containers/EditorSettings";
import EditorFontFamily from "../editor-setting/containers/EditorFontFamily";
import KeyboardNavWrapper from "../customize-keyboard/containers/KeyboardNav";
import { KEYBOARD_NAV_SCREEN_NAME } from "../customize-keyboard/config/navigation";
import { THEME_SETTINGS_NAME } from "../highlight-setting/config/navigation";
import { SETTINGS_SCREEN_NAME } from "../settings/config/navigation";
import {
  EDITOR_SETTINGS_SCREEN_NAME,
  EDITOR_FONT_FAMILY_SCREEN_NAME,
} from "../editor-setting/config/navigation";

const Stack = createStackNavigator();

const StackSettingsNavigator = (props) => {
  useLayoutEffect(() => {
    const route = props.route as any;
    props.navigation.setOptions({
      gestureEnabled: route.state && route.state.index > 0 ? false : true,
    });
  });

  return (
    <Stack.Navigator
      initialRouteName={SETTINGS_SCREEN_NAME}
      headerMode="none"
      screenOptions={{
        gestureEnabled: true,
        cardOverlayEnabled: true,
        cardStyle: {
          backgroundColor: "transparent",
        },
        ...TransitionPresets.ModalPresentationIOS,
      }}
    >
      <Stack.Screen name={SETTINGS_SCREEN_NAME} component={Settings} />
      <Stack.Screen name={THEME_SETTINGS_NAME} component={ThemeSettings} />
      <Stack.Screen
        name={EDITOR_SETTINGS_SCREEN_NAME}
        component={EditorSettings}
      />
      <Stack.Screen
        name={EDITOR_FONT_FAMILY_SCREEN_NAME}
        component={EditorFontFamily}
      />
      <Stack.Screen
        name={KEYBOARD_NAV_SCREEN_NAME}
        component={KeyboardNavWrapper}
      />
      <Stack.Screen name={ABOUT_SCREEN_NAME} component={About} />
      <Stack.Screen
        name={ACKNOWLEDGEMENTS_SCREEN_NAME}
        component={Acknowledgements}
      />
    </Stack.Navigator>
  );
};

export default StackSettingsNavigator;
