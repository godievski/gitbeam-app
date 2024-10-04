import React, { useMemo } from "react";
import {
  View,
  Platform,
  StyleSheet,
  PlatformIOSStatic,
  ViewStyle,
} from "react-native";
import ButtonBack from "../Buttons/ButtonBack";
import { ifIphoneX } from "react-native-iphone-x-helper";
import ButtonBurger from "../Buttons/ButtonBurger";
import { useTheme } from "../../theme/hooks";
import ButtonHeader from "../Buttons/ButtonHeader";
import { GENERAL_CONTAINER_PADDING_HORIZONTAL } from "../../core/styles/general";
import useDimensions from "../../core/hooks/useDimensions";

const IOS_HEADER = 44;
const ANDORID_HEADER = 56;

export const HEADER_HEIGHT = Platform.OS == "ios" ? IOS_HEADER : ANDORID_HEADER;

type HeaderProps = {
  center?: () => React.ReactElement | null | undefined;
  left?: () => React.ReactElement | null | undefined;
  right?: () => React.ReactElement | null | undefined;
  backBtn?: boolean;
  burgerBtn?: boolean;
  isModal?: boolean;
  headerStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  centerStyle?: ViewStyle;
};

const platformIos = Platform as PlatformIOSStatic;

const Header: React.FC<HeaderProps> = ({
  center,
  left,
  right,
  backBtn = true,
  burgerBtn = false,
  isModal = false,
  headerStyle = {},
  containerStyle = {},
  centerStyle = {},
}) => {
  const dimensions = useDimensions();
  const theme = useTheme();

  const paddingTop = useMemo(() => {
    return Platform.OS == "ios"
      ? !isModal
        ? dimensions.isLandscape
          ? platformIos.isPad
            ? 20
            : 0
          : ifIphoneX(44, 20)
        : 20
      : 0;
  }, [dimensions]);

  const paddingHorizontal = useMemo(
    () =>
      Platform.OS == "ios"
        ? dimensions.isLandscape
          ? ifIphoneX(44, GENERAL_CONTAINER_PADDING_HORIZONTAL * 0.75)
          : GENERAL_CONTAINER_PADDING_HORIZONTAL * 0.75
        : GENERAL_CONTAINER_PADDING_HORIZONTAL * 0.75,
    [dimensions]
  );

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop,
          paddingHorizontal,
          backgroundColor: theme.colors.topbar_bg,
          position: "relative",
        },
        headerStyle,
      ]}
    >
      <View style={[styles.container, containerStyle]}>
        {/* LEFT */}
        <View style={{ flex: 1 }}>
          <View style={styles.left}>
            {!!left ? (
              left()
            ) : backBtn ? (
              <ButtonBack modal={isModal} />
            ) : burgerBtn ? (
              <ButtonBurger />
            ) : (
              undefined
            )}
          </View>
        </View>
        {/* CENTER */}
        <View style={[styles.center, centerStyle, { flex: undefined }]}>
          {center ? center() : undefined}
        </View>
        {/* RIGHT */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              ...styles.right,
            }}
          >
            {!!right ? (
              right()
            ) : isModal ? (
              <ButtonHeader title="Done" backBtn={true} />
            ) : (
              undefined
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    borderWidth: 0,
    elevation: 0,
    width: "100%",
    position: "relative",
    overflow: "visible",
  },
  container: {
    height: HEADER_HEIGHT,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  left: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  center: {
    flex: undefined,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  center2: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  right: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "flex-end",
  },
});

export default React.memo(Header);
