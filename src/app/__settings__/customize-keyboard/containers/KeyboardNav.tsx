import React, { useCallback } from "react";
import KeyboardIncluded from "./KeyboardIncluded";
import KeyboardMore from "./KeyboardMore";
import Header from "../../../../components/Header/Header";
import { View } from "react-native";
import Container from "../../../../components/Layouts/Container";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "../../../../theme/hooks";
import { iOSUIKit } from "react-native-typography";
import TitleHeader from "../../../../components/Header/TitleHeader";
import {
  KEYBOARD_INCLUDED_SCREEN_NAME,
  KEYBOARD_MORE_SCREEN_NAME,
} from "../config/navigation";

const Tab = createMaterialTopTabNavigator();

const KeyboardNavWrapper: React.FC<{}> = (props) => {
  const theme = useTheme();

  const renderTitle = useCallback(() => {
    return <TitleHeader title="Customize Keyboard" />;
  }, []);

  return (
    <Container>
      <Header center={renderTitle} isModal={true} backBtn={false} />
      <View style={{ flex: 1, backgroundColor: theme.colors.bg_sec_color }}>
        <Tab.Navigator
          initialRouteName={KEYBOARD_INCLUDED_SCREEN_NAME}
          tabBarPosition="top"
          swipeEnabled={true}
          sceneContainerStyle={{
            backgroundColor: "transparent",
            padding: 0,
          }}
          style={{ backgroundColor: "transparent", padding: 0 }}
          tabBarOptions={{
            showIcon: false,
            showLabel: true,
            style: {
              elevation: 0,
              backgroundColor: theme.colors.bg_color,
            },
            indicatorStyle: {
              height: 1,
              backgroundColor: theme.colors.text_primary,
            },
            labelStyle: {
              ...(theme.isDark
                ? iOSUIKit.subheadEmphasizedWhiteObject
                : iOSUIKit.subheadEmphasizedObject),
              fontSize: 12,
            },
          }}
          // pager={props => <View>{props.children}</View>}
        >
          <Tab.Screen
            name={KEYBOARD_INCLUDED_SCREEN_NAME}
            component={KeyboardIncluded}
            options={{
              title: "INCLUDED",
            }}
          />
          <Tab.Screen
            name={KEYBOARD_MORE_SCREEN_NAME}
            component={KeyboardMore}
            options={{
              title: "MORE",
            }}
          />
        </Tab.Navigator>
      </View>
    </Container>
  );
};

export default React.memo(KeyboardNavWrapper);
