import React, { useRef, useCallback } from "react";
import { UIManager, Dimensions } from "react-native";
import ThemeItem from "./ThemeItem";
import { ScrollView } from "react-native";
import { ThemeEditor } from "../config/types";
import { themeOptions } from "../config/constants";

interface ThemeOptionsProps {
  selectTheme: (val: ThemeEditor) => void;
  selectedTheme: ThemeEditor;
}

const ThemeOptions: React.FC<ThemeOptionsProps> = ({
  selectTheme,
  selectedTheme,
}) => {
  const scrollview = useRef<ScrollView>(null);

  const scrollTo = useCallback((node) => {
    if (node) {
      UIManager.measure(node, (x, y, width, height, pageX, pageY) => {
        let new_x = x + width / 2 - (Dimensions.get("window").width - 20) / 2; // x - widthWrapper / 2 + widthItem / 2
        scrollview.current?.scrollTo({
          animated: true,
          x: new_x < 0 ? 0 : new_x,
        });
      });
    }
  }, []);

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 5,
      }}
      style={{ width: "100%" }}
      ref={scrollview}
    >
      {themeOptions.map((theme, index) => {
        return (
          <ThemeItem
            key={`theme-item-${theme.id}`}
            theme_editor={theme}
            selectItem={selectTheme}
            isSelected={selectedTheme.id == theme.id}
            scrollTo={scrollTo}
            isFirst={index == 0}
            isLast={index == themeOptions.length - 1}
          />
        );
      })}
    </ScrollView>
  );
};

export default React.memo(ThemeOptions);
