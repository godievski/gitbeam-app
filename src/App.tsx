import React, { Component } from "react";
import { Provider } from "react-redux";
import { enableScreens } from "react-native-screens";
import AuthNavigator from "./app/auth/containers/AuthNavigator";
import { StatusBar, View } from "react-native";
import { PersistGate } from "redux-persist/integration/react";
import FullLoading from "./components/Layouts/FullLoading";
import { ToastProvider } from "./components/Toast/ToastContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootSiblingParent } from "react-native-root-siblings";
import { ThemeModalProvider } from "./app/modals/ThemeModal";
import useDarkmode from "./core/hooks/useDarkmode";
import { store, persistor } from "./store/store";

enableScreens();

const RootContainer = AuthNavigator;

StatusBar.setBarStyle("light-content", true);

type AppContainerProps = {};
const AppContainer: React.FC<AppContainerProps> = (props) => {
  useDarkmode();

  return <View style={{ flex: 1 }}>{props.children}</View>;
};

export default class App extends Component<any> {
  render() {
    return (
      <SafeAreaProvider>
        <RootSiblingParent>
          <Provider store={store}>
            <ToastProvider>
              <PersistGate loading={<FullLoading />} persistor={persistor}>
                <AppContainer>
                  <ThemeModalProvider>
                    <RootContainer />
                  </ThemeModalProvider>
                </AppContainer>
              </PersistGate>
            </ToastProvider>
          </Provider>
        </RootSiblingParent>
      </SafeAreaProvider>
    );
  }
}
