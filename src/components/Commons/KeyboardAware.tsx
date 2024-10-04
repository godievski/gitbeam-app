import React from "react";
import * as AwareScroll from "react-native-keyboard-aware-scroll-view";
import { ScrollView } from "react-native";

const listenToKeyboardEvent = AwareScroll["listenToKeyboardEvents"];

export const KeyboardAwareScrollView = listenToKeyboardEvent({})(
  ScrollView
) as React.ComponentType<AwareScroll.KeyboardAwareScrollViewProps>;
