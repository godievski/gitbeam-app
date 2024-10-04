import React, { useMemo } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { CommitDiffLines } from "../../../../core/gitlab/types/commits_types";
import { GIT_COLORS } from "../../../../core/styles/colors";
import { View, StyleSheet } from "react-native";
import TextThemed from "../../../../components/Commons/TextThemed";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../../theme/hooks";
import { getFontSizeLineNumber } from "../utils";

type CommitDiffSingleFileProps = {
  diff_lines: CommitDiffLines[];
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  max_line_number: number;
};

const CommitDiffSingleFile: React.FC<CommitDiffSingleFileProps> = ({
  diff_lines,
  fontSize,
  fontFamily,
  lineHeight,
  max_line_number,
}) => {
  const theme = useTheme();

  const fontSizeLineNumber = useMemo(() => getFontSizeLineNumber(fontSize), [
    fontSize,
  ]);

  const width_line_number = useMemo(() => {
    const digits = Math.ceil(Math.log10(max_line_number) + 1);
    return 1 + Math.ceil(digits * fontSize * 0.5) + 12;
  }, [max_line_number, fontSize]);

  return (
    <ScrollView
      horizontal={true}
      style={{ width: "100%" }}
      contentContainerStyle={{
        flexDirection: "column",
        minWidth: "100%",
      }}
      bounces={false}
      showsHorizontalScrollIndicator={false}
    >
      {diff_lines.map((line, index) => {
        const bgc =
          line.type === "info"
            ? GIT_COLORS.commit.info
            : line.type === "add"
            ? GIT_COLORS.commit.add
            : line.type === "remove"
            ? GIT_COLORS.commit.remove
            : "transparent";

        return (
          <SafeAreaView
            style={{
              minWidth: "100%",
              height: lineHeight,
              backgroundColor: bgc,
              flexDirection: "row",
              alignItems: "center",
            }}
            edges={["left", "right"]}
          >
            <View
              style={{
                borderRightWidth: StyleSheet.hairlineWidth,
                borderLeftColor: theme.colors.border_item_selected,
                backgroundColor: bgc,
                paddingHorizontal: 6,
                width: width_line_number,
                height: "100%",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <TextThemed
                type="secondary"
                style={{
                  textAlign: "right",
                  fontSize: fontSizeLineNumber,
                  fontWeight: "800",
                  fontFamily: fontFamily,
                }}
              >
                {line.type === "add"
                  ? line.b_line_number
                  : line.type === "remove"
                  ? line.a_line_number
                  : line.b_line_number}
              </TextThemed>
            </View>
            <View
              style={{
                paddingLeft: 6,
                paddingRight: 6,
              }}
            >
              <TextThemed
                style={{
                  fontSize,
                  lineHeight: lineHeight,
                  fontFamily,
                }}
              >
                {line.line}
              </TextThemed>
            </View>
          </SafeAreaView>
        );
      })}
    </ScrollView>
  );
};

export default React.memo(CommitDiffSingleFile);
