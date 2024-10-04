import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  TextInput,
  InputAccessoryView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import KeyboardCoder from "./KeyboardCoder";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../theme/hooks";
import { useAppSelector } from "../../store/hooks";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    flex: 1,
    padding: 6,
  },
});

type EditorCompProps = {
  onChangeText: (v: string) => void;
  autoFocus?: boolean;
  content?: string;
};
/**
 * TODO: See: https://github.com/facebook/react-native/issues/27887
 * Bug on react-native library for landscape mode for InputAccessoryView
 */

/**
 * TODO: Check if this works on Android
 */

const inputAccesoryId = "editor-keyboard";

const Editor: React.FC<EditorCompProps> = ({
  onChangeText,
  autoFocus,
  content = "",
}) => {
  const [selection, setSelection] = useState<
    { start: number; end: number } | undefined
  >(() => (Platform.OS == "ios" ? { start: 0, end: 0 } : undefined));
  const [text, setText] = useState(content);

  const editorConfig = useAppSelector((state) => state.editorConfig);
  const theme = useTheme();

  const handleSelectionChange = useCallback(
    ({ nativeEvent: { selection } }) => {
      if (Platform.OS == "ios") {
        setSelection(selection);
      }
    },
    []
  );

  const onChangeTextHandler = useCallback(
    (new_text: string) => {
      setText(new_text);
      onChangeText(new_text);
    },
    [onChangeText]
  );

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: editorConfig.theme.backgroundColor,
      }}
      behavior="padding"
    >
      <SafeAreaView style={{ flex: 1 }} edges={["left", "right", "bottom"]}>
        <TextInput
          multiline={true}
          placeholder="Content..."
          value={text}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          autoFocus={autoFocus}
          onChangeText={onChangeTextHandler}
          // selection={selection}
          onSelectionChange={handleSelectionChange}
          inputAccessoryViewID={inputAccesoryId}
          style={{
            ...styles.input,
            fontFamily: editorConfig.fontFamily.value,
            fontSize: editorConfig.size,
            backgroundColor: editorConfig.theme.backgroundColor,
            color: editorConfig.theme.color,
          }}
          placeholderTextColor={editorConfig.theme.placeholder}
          disableFullscreenUI={true}
          importantForAutofill="no"
          keyboardAppearance={theme.isDark ? "dark" : "light"}
        />
        {Platform.OS == "ios" && (
          <InputAccessoryView nativeID={inputAccesoryId}>
            <KeyboardCoder
              value={content}
              selection={selection ?? { start: 0, end: 0 }}
              updateValue={onChangeText}
              updateSelection={setSelection}
            />
          </InputAccessoryView>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default React.memo(Editor);
