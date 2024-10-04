import React, { useState, useCallback, useMemo } from "react";
import { useTheme } from "../../theme/hooks";
import {
  GENERAL_CONTAINER_PADDING_HORIZONTAL,
  GENERAL_BORDER,
} from "../../core/styles/general";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ViewStyle,
  StyleProp,
  TextStyle,
  StyleSheet,
  View,
  TextInputProps,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import IconThemed from "../Icons/IconThemed";

export type SearchBarBlueProps = TextInputProps & {
  delayChange?: number;
  onChangeText: (value: string) => void;
  containerStyle?: ViewStyle;
};

const DELAY_ON_CHANGE = 250;

const SearchBar: React.FC<SearchBarBlueProps> = ({
  delayChange = DELAY_ON_CHANGE,
  containerStyle,
  placeholder = "Search",
  ...resProps
}) => {
  const { onChangeText, style, ...inputProps } = resProps;
  const [search, setSearch] = useState("");
  const [typingTimeout, setTypingTimeout] = useState<any>();

  const theme = useTheme();

  const onChangeInputText = useCallback(
    (text) => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      setSearch(text);
      setTypingTimeout(() => {
        return setTimeout(() => {
          onChangeText(text);
        }, delayChange);
      });
    },
    [typingTimeout, onChangeText, delayChange]
  );

  const style_content: ViewStyle = useMemo(() => {
    return StyleSheet.flatten([
      styles.content,
      {
        backgroundColor: theme.colors.searchbar_bg,
        height: 36,
      },
    ]);
  }, [theme.isDark]);

  const style_input: StyleProp<TextStyle> = useMemo(() => {
    return StyleSheet.flatten([
      styles.input,
      {
        color: theme.colors.text_secondary,
      },
      style,
    ]);
  }, [theme.isDark, style]);

  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={StyleSheet.flatten([styles.container, containerStyle])}
    >
      <View style={style_content}>
        <TextInput
          {...inputProps}
          clearButtonMode="always"
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text_tertiary}
          onChangeText={onChangeInputText}
          autoCorrect={false}
          autoCapitalize="none"
          style={style_input}
          keyboardAppearance={theme.isDark ? "dark" : "light"}
          value={search}
        />
        <View style={styles.leftIcon} pointerEvents="none">
          <IconThemed
            type="ionicon"
            name="search"
            size={16}
            colorType="secondary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: GENERAL_CONTAINER_PADDING_HORIZONTAL,
    paddingVertical: 10,
  },
  content: {
    height: 36,
    position: "relative",
    borderRadius: GENERAL_BORDER,
    justifyContent: "center",
    paddingHorizontal: GENERAL_BORDER / 2,
  },
  input: {
    fontSize: 14,
    flex: 1,
    paddingLeft: GENERAL_BORDER * 1.5,
    margin: 0,
  },
  leftIcon: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    left: GENERAL_BORDER / 2,
  },
});

export default React.memo(SearchBar);
