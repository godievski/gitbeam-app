import React, { useRef } from "react";
import {
  TouchableOpacity,
  findNodeHandle,
  Text,
  StyleSheet,
} from "react-native";
import { iOSColors } from "react-native-typography";
import { useCallback } from "react";
import { ThemeEditor } from "../config/types";

interface ThemeItemProps {
  theme_editor: ThemeEditor;
  isSelected: boolean;
  selectItem: (val: ThemeEditor) => void;
  scrollTo;
  isFirst: boolean;
  isLast: boolean;
}

const ThemeItem: React.FC<ThemeItemProps> = ({
  theme_editor,
  isSelected,
  selectItem,
  scrollTo,
  isFirst,
  isLast,
}) => {
  const item = useRef<TouchableOpacity>(null);

  const selectItemHandler = useCallback(() => {
    scrollTo(findNodeHandle(item.current));
    selectItem(theme_editor);
  }, []);

  return (
    <TouchableOpacity
      onPress={selectItemHandler}
      style={[
        styles.btn,
        {
          borderColor: isSelected ? iOSColors.red : "transparent",
          backgroundColor: theme_editor.backgroundColor,
          marginRight: isLast ? 0 : 5,
          marginLeft: isFirst ? 0 : 5,
        },
      ]}
      ref={item}
    >
      <Text
        style={[
          styles.text,
          {
            color: theme_editor.color,
          },
        ]}
      >
        {theme_editor.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    borderRadius: 10,
    borderWidth: 3,
    minWidth: 80,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  text: {
    fontSize: 14,
    flexWrap: "wrap",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    height: "100%",
    lineHeight: 21,
    textAlignVertical: "center",
  },
});

export default React.memo(ThemeItem);
