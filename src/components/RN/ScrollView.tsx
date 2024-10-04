import React, { forwardRef } from "react";
import { ScrollView as RNScrollView, ScrollViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props extends ScrollViewProps {
  paddingTop?: boolean;
  children?: React.ReactNode;
}

const ScrollView = forwardRef<RNScrollView, Props>(
  ({ contentContainerStyle, paddingTop = false, ...res }, ref) => {
    const insets = useSafeAreaInsets();

    return (
      <RNScrollView
        ref={ref}
        {...res}
        contentContainerStyle={[
          {
            paddingTop: paddingTop ? 10 : 0,
            paddingBottom: insets.bottom,
          },
          contentContainerStyle,
        ]}
      />
    );
  }
);

export default ScrollView;
