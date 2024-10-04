import React, { useRef, useMemo, useCallback } from "react";
import { createContext } from "react";
import { Modalvski } from "../../components/Modalvski/Modalvski";
import ItemGroup from "../../components/Group/ItemGroup";
import ItemPressable from "../../components/Group/ItemPressable";
import { useDispatch } from "react-redux";
import { useColorScheme, Platform } from "react-native";
import { useTheme } from "../../theme/hooks";
import TextThemed from "../../components/Commons/TextThemed";
import { GENERAL_ICON_SIZE } from "../../core/styles/general";
import Ionicons from "react-native-vector-icons/Ionicons";
import { DARK_MODE_REQ } from "../../core/config";
import { ModalvskiContextValue } from "../../components/Modalvski/ModalvskiContext";
import { toggleDeviceTheme, toggleTheme } from "../../theme/themeSlice";

const os_version = parseInt(Platform.Version as string, 10);
const showDeviceSettingOpt =
  os_version >=
  (Platform.OS == "ios" ? DARK_MODE_REQ.ios : DARK_MODE_REQ.android);

type ThemeModalContextValue = ModalvskiContextValue;

export const ThemeModalContext = createContext<ThemeModalContextValue>({
  open: () => {},
  close: () => {},
});

type ThemeModalProviderProps = {
  children: React.ReactNode;
};

export const ThemeModalProvider: React.FC<ThemeModalProviderProps> = (
  props
) => {
  const dispatch = useDispatch();
  const modal = useRef<Modalvski>(null);
  const theme = useTheme();
  const isDeviceDark = useColorScheme() == "dark";

  const value = useMemo(() => {
    return {
      open: () => {
        modal.current?.open();
      },
      close: () => {
        modal.current?.close();
      },
    };
  }, []);

  const onPressDarkMode = useCallback(() => {
    dispatch(toggleTheme(isDeviceDark));
  }, [isDeviceDark]);

  const darkModeRight = useCallback(() => {
    return theme.isDark ? (
      <TextThemed>
        <Ionicons name="checkmark-outline" size={GENERAL_ICON_SIZE} />
      </TextThemed>
    ) : (
      undefined
    );
  }, [theme.isDark]);

  const onPressDeviceSettings = useCallback(() => {
    dispatch(toggleDeviceTheme(isDeviceDark));
  }, [isDeviceDark]);

  const deviceSettingsRight = useCallback(() => {
    return theme.useDeviceMode ? (
      <TextThemed>
        <Ionicons name="checkmark-outline" size={GENERAL_ICON_SIZE} />
      </TextThemed>
    ) : (
      undefined
    );
  }, [theme.useDeviceMode]);

  return (
    <ThemeModalContext.Provider value={value}>
      {props.children}
      <Modalvski ref={modal}>
        <ItemGroup>
          <ItemPressable
            title="Dark mode"
            onPress={onPressDarkMode}
            renderRight={darkModeRight}
            borderBottom={showDeviceSettingOpt}
            dismissModal={false}
          />
          {showDeviceSettingOpt && (
            <ItemPressable
              title="Use device setttings"
              onPress={onPressDeviceSettings}
              renderRight={deviceSettingsRight}
              dismissModal={false}
              borderBottom={false}
            />
          )}
        </ItemGroup>
      </Modalvski>
    </ThemeModalContext.Provider>
  );
};
