import React, { forwardRef, useCallback } from "react";
import { Modalvski } from "../../components/Modalvski/Modalvski";
import { View, Platform } from "react-native";
import { Picker } from "@react-native-community/picker";
import { styles_hljs } from "../../core/highlighter_styles";
import useDimensions from "../../core/hooks/useDimensions";
import { GENERAL_BORDER } from "../../core/styles/general";
import TextThemed from "../../components/Commons/TextThemed";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useTheme } from "../../theme/hooks";
import { selectHighlight } from "../__settings__/highlight-setting/config/highlightSlice";

type Props = {};

const HighlightModal = forwardRef<Modalvski, Props>((props, ref) => {
  const dimensions = useDimensions();
  const dispatch = useAppDispatch();

  const highlight = useAppSelector((state) => state.highlight);
  const theme = useTheme();

  const { style } = highlight;

  const onValueChange = useCallback((option) => {
    dispatch(
      selectHighlight({
        style: option,
        type: "hljs",
      })
    );
  }, []);

  return (
    <Modalvski ref={ref}>
      <View style={{ padding: 10, width: "100%", alignItems: "center" }}>
        <TextThemed style={{ fontSize: 16, fontWeight: "500" }}>
          Change Theme
        </TextThemed>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          borderRadius: GENERAL_BORDER,
          overflow: "hidden",
          marginTop: 10,
          marginHorizontal: 20,
          backgroundColor:
            Platform.OS === "ios" ? theme.colors.bg_color : "white",
        }}
      >
        <Picker
          style={{
            width: dimensions.width * 0.75,
            backgroundColor:
              Platform.OS === "ios" ? theme.colors.bg_color : "white",
          }}
          selectedValue={style}
          onValueChange={onValueChange}
        >
          {styles_hljs.map((option, index) => {
            return (
              <Picker.Item
                key={index}
                value={option}
                label={option}
                color={
                  Platform.OS == "ios" ? theme.colors.text_primary : "black"
                }
              ></Picker.Item>
            );
          })}
        </Picker>
      </View>
    </Modalvski>
  );
});

export default HighlightModal;
