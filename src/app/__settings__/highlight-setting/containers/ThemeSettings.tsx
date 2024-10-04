import React, { useCallback, useMemo } from "react";
import { SafeAreaView, View, Platform, StyleSheet } from "react-native";
import { Picker } from "@react-native-community/picker";
import {
  styles_hljs,
  getBackgroundColorHljs,
} from "../../../../core/highlighter_styles";
import * as hljs from "react-syntax-highlighter/dist/esm/styles/hljs";
import Highlighter from "../../../../components/Tools/Highlighter";
import { DEFAULT_SAMPLE_CODE } from "../components/sample_code";
import Header from "../../../../components/Header/Header";
import TitleHeader from "../../../../components/Header/TitleHeader";
import Container from "../../../../components/Layouts/Container";
import { useTheme } from "../../../../theme/hooks";
import useDimensions from "../../../../core/hooks/useDimensions";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectHighlight } from "../config/highlightSlice";

type ThemeSettingsScreenProps = {};

const ThemeSettings: React.FC<ThemeSettingsScreenProps> = ({}) => {
  const dispatch = useAppDispatch();

  const dimensions = useDimensions();

  const theme = useTheme();
  const highlight = useAppSelector((state) => state.highlight);

  const options = useMemo(() => styles_hljs, []);

  const renderItem = useCallback(
    (option, index) => {
      return (
        <Picker.Item
          key={index}
          value={option}
          label={option}
          color={Platform.OS == "ios" ? theme.colors.text_primary : "black"}
        />
      );
    },
    [theme]
  );

  const onValueChange = useCallback((option) => {
    dispatch(
      selectHighlight({
        style: option,
        type: "hljs",
      })
    );
  }, []);

  const renderTitle = useCallback(() => <TitleHeader title={"Theme"} />, []);

  return (
    <Container>
      <Header center={renderTitle} isModal={true} backBtn={false} />
      <SafeAreaView
        style={{
          width: "100%",
          flex: 1,
          backgroundColor: getBackgroundColorHljs(
            highlight.style,
            hljs[highlight.style]
          ),
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: dimensions.isLandscape ? "row" : "column",
            flexWrap: "nowrap",
          }}
        >
          <View style={{ flex: 1 }}>
            <Highlighter
              language="javascript"
              key={highlight.style}
              content={DEFAULT_SAMPLE_CODE}
              style_highlighter={highlight.style}
              type={highlight.type}
            />
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: dimensions.isLandscape ? "100%" : undefined,
              width: dimensions.isLandscape ? undefined : "100%",
              backgroundColor: theme.colors.bg_color,
            }}
          >
            <Picker
              style={[
                styles.bottomPicker,
                {
                  backgroundColor:
                    Platform.OS == "ios" ? theme.colors.bg_color : "white",
                },
              ]}
              selectedValue={highlight.style}
              onValueChange={onValueChange}
            >
              {options.map((option, index) => renderItem(option, index))}
            </Picker>
          </View>
        </View>
      </SafeAreaView>
    </Container>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    zIndex: -1,
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    opacity: 0.3,
  },

  mainBox: {
    // Can be used by <SimplePicker styles={{ mainBox:{...} }}/>
  },

  modalContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    backgroundColor: "#F5FCFF",
  },

  buttonView: {
    width: "100%",
    padding: 8,
    borderTopWidth: 0.5,
    borderTopColor: "lightgrey",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  bottomPicker: {
    width: 300,
  },
});

export default React.memo(ThemeSettings);
