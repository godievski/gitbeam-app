import "react-native-gesture-handler";
import {
    AppRegistry
} from "react-native";
import App from "./src/App";

import {
    LogBox
} from "react-native";

LogBox.ignoreLogs([
    "Sending...",
    "Warning: isMounted(...) is deprecated",
    "Module RCTImageLoader",
    "Class RCTCxxModule",
    "Warning: Each",
    "Warning: Failed",
    //TODO: remove these warnings
    "Warning: componentWillUpdate",
    "Warning: componentWillMount",
    "Warning: componentWillReceiveProps",
    "-[RCTRootView cancelTouches]",
    "ReactNativeFiberHostComponent",
    "Animated: 'useNativeDriver'",
    "Non-serializable values were found in the navigation state",
    "currentlyFocusedField",
    // 'Warning: bind()'
]);

AppRegistry.registerComponent("Gitbeam", () => App);