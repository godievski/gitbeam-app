import { Platform } from "react-native";
import { ifIphoneX } from "react-native-iphone-x-helper";

const isIOS = Platform.OS === "ios";

export const STATUS_BAR_HEIGHT = isIOS ? ifIphoneX(44, 20) : 0;
export const NAV_BAR_HEIGHT = isIOS ? 44 : 56;
export const HEADER_HEIGHT = STATUS_BAR_HEIGHT + NAV_BAR_HEIGHT;
