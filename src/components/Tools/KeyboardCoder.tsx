import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "../../theme/hooks";
import { useAppSelector } from "../../store/hooks";

interface KeyboardCoderProps {
  updateValue: (value: string) => any;
  updateSelection: (selection: { start: number; end: number }) => any;
  value: string;
  selection: {
    start: number;
    end: number;
  };
}

const KeyboardCoder: React.FC<KeyboardCoderProps> = ({
  updateValue,
  updateSelection,
  value,
  selection,
}) => {
  const theme = useTheme();

  const keyboardConfig = useAppSelector((state) => state.keyboardConfig);

  const insertText = (text: string) => {
    const output = [
      value.slice(0, selection.start),
      text,
      value.slice(selection.end),
    ];
    updateValue(output.join(""));
  };

  const moveCursorToStartOfLine = () => {
    let new_start = selection.start;
    if (new_start == 0) {
      updateSelection({
        start: 0,
        end: 0,
      });
    } else {
      //find position first
      if (value[new_start] == "\n") {
        new_start -= 1;
      }
      while (new_start >= 0) {
        if (value[new_start] == "\n") break;
        new_start -= 1;
      }
      new_start += 1;
      updateSelection({
        start: new_start,
        end: new_start,
      });
    }
  };

  const moveCursorToEndOfLine = () => {
    let new_end = selection.end;
    if (new_end == value.length + 1) {
      updateSelection({
        start: new_end,
        end: new_end,
      });
    } else {
      while (new_end < value.length) {
        if (value[new_end] == "\n") break;
        new_end += 1;
      }
      updateSelection({
        start: new_end,
        end: new_end,
      });
    }
  };

  const moveCursorLeft = () => {
    if (selection.start > 0) {
      updateSelection({
        start: selection.start - 1,
        end:
          selection.end == selection.start
            ? selection.start - 1
            : selection.end,
      });
    }
  };

  const moveCursorRight = () => {
    if (selection.end < value.length) {
      updateSelection({
        start:
          selection.start == selection.end
            ? selection.end + 1
            : selection.start,
        end: selection.end + 1,
      });
    }
  };

  const deleteLine = () => {
    let start_of_line = selection.start > 0 ? selection.start - 1 : 0;
    let end_of_line = selection.end;
    while (start_of_line >= 0) {
      if (value[start_of_line] == "\n") break;
      start_of_line -= 1;
    }
    start_of_line += 1;
    while (end_of_line < value.length) {
      if (value[end_of_line] == "\n") break;
      end_of_line += 1;
    }
    updateValue(value.slice(0, start_of_line) + value.slice(end_of_line + 1));
  };

  const actions = {
    insertText,
    moveCursorToStartOfLine,
    moveCursorToEndOfLine,
    moveCursorLeft,
    moveCursorRight,
    deleteLine,
  };

  const bg_color = theme.isDark
    ? "rgba(37,37,37,0.6)"
    : "rgba(209,213, 219, 1)";

  const btn_color = theme.isDark
    ? "rgba(255,255,255, 0.3)"
    : "rgba(255,255,255, 1)";

  const underlay = !theme.isDark
    ? "rgba(255,255,255, 0.35)"
    : "rgba(44,44,44, 0.3)";

  // const dimensions = useDimensions();

  return (
    <View style={[styles.container, { backgroundColor: bg_color }]}>
      <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
        <ScrollView
          horizontal={true}
          style={styles.btnsWrapper}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.btnsWrapperContainer}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {keyboardConfig.included.map((key) => (
            <TouchableHighlight
              key={`button-${key.id}`}
              onPress={() => {
                const handler = actions[key.action];
                if (handler) {
                  handler(key.value);
                }
              }}
              style={[styles.btn, { backgroundColor: btn_color }]}
              underlayColor={underlay}
            >
              <Text
                style={[styles.label, { color: theme.colors.text_primary }]}
              >
                {key.label}
              </Text>
            </TouchableHighlight>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const { width, height } = Dimensions.get("window");
const WIDTH = Math.min(width, height);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // width: 300,
    width: WIDTH,
    height: 50,
  },
  btnsWrapper: {
    flex: 1,
    height: "100%",
  },
  btnsWrapperContainer: {
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  btn: {
    // backgroundColor: DEFAULT_BG_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: "auto",
    minWidth: 40,
    marginHorizontal: 6,
    borderRadius: 8,
  },
  label: {
    // color: DEFAULT_TEXT_COLOR,
    fontSize: 17,
    fontWeight: "500",
    paddingHorizontal: 4,
  },
});

export default React.memo(KeyboardCoder);
