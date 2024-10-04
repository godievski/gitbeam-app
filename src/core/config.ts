import Toast from "react-native-root-toast";
import { TextStyle, StyleProp, ViewStyle } from "react-native";
import { RED_ROSE, PRIMARY_DARKER_COLOR } from "./styles/colors";

export interface ToastOptions {
  containerStyle?: StyleProp<ViewStyle>;
  duration?: number;
  visible?: boolean;
  position?: number;
  animation?: boolean;
  shadow?: boolean;
  backgroundColor?: string;
  opacity?: number;
  shadowColor?: string;
  textColor?: string;
  textStyle?: StyleProp<TextStyle>;
  delay?: number;
  keyboardAvoiding?: boolean;
  hideOnPress?: boolean;
  onHide?: Function;
  onHidden?: Function;
  onShow?: Function;
  onShown?: Function;
  onPress?: Function;
}

export const ToastConfig = {
  normal: {
    shadow: false,
    animation: true,
    delay: 0,
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
    backgroundColor: PRIMARY_DARKER_COLOR,
    opacity: 0.95,
  },
  error: {
    shadow: false,
    animation: true,
    delay: 0,
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
    backgroundColor: RED_ROSE,
    opacity: 0.95,
  },
  warning: {
    shadow: false,
    animation: true,
    delay: 0,
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
    backgroundColor: "rgb(255,149,0)",
    opacity: 0.95,
  },
};

export const ERROR_MSG_TIME = 3500; //3.5sec

export const DARK_MODE_REQ = {
  ios: 13,
  android: 29,
};
