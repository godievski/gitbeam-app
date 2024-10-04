import React from "react";
import { View, SafeAreaView, StyleSheet, Text, Platform } from "react-native";
import { iOSUIKit } from "react-native-typography";
import { BlurView } from "@react-native-community/blur";
import { useTheme } from "../../theme/hooks";
import { GENERAL_CONTAINER_PADDING_HORIZONTAL } from "../../core/styles/general";

interface BlurViewAndroidProps {
  borderColor: string;
}

const BlurViewAndroid: React.FC<BlurViewAndroidProps> = (props) => {
  return (
    <View
      style={{
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: props.borderColor,
        paddingVertical: 5,
      }}
    >
      {props.children}
    </View>
  );
};

const SectionHeaderContainer =
  Platform.OS == "ios" ? BlurView : BlurViewAndroid;

interface SectionListHeaderProps {
  title: string;
}

const SectionListHeader: React.FC<SectionListHeaderProps> = (props) => {
  const { title } = props;

  const theme = useTheme();

  return (
    <SectionHeaderContainer
      blurType={theme.isDark ? "dark" : "light"}
      blurAmount={6}
      borderColor={theme.colors.divider_color}
      style={styles.container}
      // style={[styles.container, { backgroundColor: theme.colors.bg_color }]}
    >
      <SafeAreaView>
        <View style={styles.wrapper}>
          <Text style={[styles.text, { color: theme.colors.text_primary }]}>
            {title}
          </Text>
        </View>
      </SafeAreaView>
    </SectionHeaderContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 48,
    justifyContent: "center",
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: GENERAL_CONTAINER_PADDING_HORIZONTAL,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  text: {
    ...iOSUIKit.title3Object,
    flexWrap: "wrap",
    flex: 1,
  },
});

export default React.memo(SectionListHeader);
