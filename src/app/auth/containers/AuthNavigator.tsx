import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Main from "./Main";
import AuthLogin from "./Login";
import { createStackNavigator } from "@react-navigation/stack";
import {
  SECURE_AUTHENTICATOR_SCREEN_NAME,
  AUTH_LOGIN_SCREEN_NAME,
  MAIN_SCREEN_NAME,
} from "../config/navigation";
import { useAppSelector } from "../../../store/hooks";
import { CredentialStatus } from "../config/types";
import SecureAuthenticator from "./SecureAuthenticator";

const Stack = createStackNavigator();

type Props = {};

type AuthNavigatorProps = Props;

const AuthNavigator: React.FC<AuthNavigatorProps> = ({}) => {
  const credential = useAppSelector((state) => state.credential);

  return (
    <NavigationContainer>
      <Stack.Navigator
        headerMode="none"
        initialRouteName={AUTH_LOGIN_SCREEN_NAME}
        screenOptions={{
          cardStyle: {
            backgroundColor: "transparent",
          },
        }}
      >
        {credential.status === CredentialStatus.authenticating ||
        credential.status === CredentialStatus.error ? (
          <Stack.Screen
            name={SECURE_AUTHENTICATOR_SCREEN_NAME}
            component={SecureAuthenticator}
          />
        ) : credential.status === CredentialStatus.success ? (
          <Stack.Screen name={MAIN_SCREEN_NAME} component={Main} />
        ) : (
          <Stack.Screen
            name={AUTH_LOGIN_SCREEN_NAME}
            component={AuthLogin}
            options={{
              title: "Sign in",
              animationTypeForReplace: "push",
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigator;
