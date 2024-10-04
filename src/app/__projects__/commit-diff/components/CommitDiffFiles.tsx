import React, { useCallback, useMemo } from "react";
import { TCommitDiffParsed } from "../../../../core/gitlab/types/commits_types";
import TextThemed from "../../../../components/Commons/TextThemed";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../../../../theme/hooks";
import IconThemed from "../../../../components/Icons/IconThemed";
import CommitDiffSingleFile from "./CommitDiffSingleFile";
import { SafeAreaView } from "react-native-safe-area-context";
import Collapsible from "../../../../components/Collapsible/Collapsible";
import { getLineHeight } from "../utils";
import { CollapsibleParamsRender } from "../../../../components/Collapsible/Collapsible";
import Animated, { interpolate, Extrapolate } from "react-native-reanimated";
import { useAppSelector } from "../../../../store/hooks";

const LIMIT_LINES_TO_SHOW = 100;

type CommitDiffFilesProps = {
  diff: TCommitDiffParsed;
};
const CommitDiffFiles: React.FC<CommitDiffFilesProps> = ({ diff }) => {
  const theme = useTheme();

  const editor = useAppSelector((state) => state.editorConfig);

  const lineHeight = useMemo(() => getLineHeight(editor.size), [editor.size]);

  const calculatedHeight = useMemo(
    () => (diff.diff === "" ? lineHeight : lineHeight * diff.diff_lines.length),
    [lineHeight, diff.diff_lines.length]
  );

  const renderHeader = useCallback(
    ({ transition }: CollapsibleParamsRender) => {
      const rotateZ = interpolate(transition, {
        inputRange: [0, 1],
        outputRange: [0, Math.PI / 2],
        extrapolate: Extrapolate.CLAMP,
      });

      return (
        <SafeAreaView
          style={{
            borderColor: theme.colors.input_border_color,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderTopWidth: StyleSheet.hairlineWidth,
            paddingVertical: 10,
            paddingHorizontal: 10,
            backgroundColor: theme.colors.bg_color,
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
          }}
          edges={["left", "right"]}
        >
          <Animated.View
            style={{
              transform: [{ rotateZ }],
              marginRight: 6,
            }}
          >
            <IconThemed
              type="ionicon"
              colorType="secondary"
              name="caret-forward"
              size={16}
            />
          </Animated.View>
          <TextThemed
            style={{
              fontWeight: "700",
              fontSize: 14,
              paddingRight: 4,
            }}
          >
            <IconThemed type="fontawesome" name="file-alt" size={12} />
            {`  `}
            {diff.renamed_file
              ? `${diff.old_path} → ${diff.new_path}`
              : diff.new_path}
          </TextThemed>
          {diff.deleted_file && (
            <TextThemed
              type="secondary"
              style={{ fontSize: 13, paddingHorizontal: 4 }}
            >
              deleted
            </TextThemed>
          )}
          {diff.a_mode !== diff.b_mode && (
            <TextThemed
              type="secondary"
              style={{ fontSize: 13, paddingHorizontal: 4 }}
            >{`${diff.a_mode} → ${diff.b_mode}`}</TextThemed>
          )}
        </SafeAreaView>
      );
    },
    [diff]
  );

  const renderContent = useCallback(() => {
    return (
      <View>
        <View>
          {diff.diff !== "" && (
            <CommitDiffSingleFile
              diff_lines={diff.diff_lines}
              fontSize={editor.size}
              fontFamily={editor.fontFamily.value}
              lineHeight={lineHeight}
              max_line_number={diff.max_line_number}
            />
          )}
        </View>
        <View>
          {diff.diff === "" && (
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextThemed
                type="secondary"
                style={{
                  fontSize: editor.size,
                  fontFamily: editor.fontFamily.value,
                  lineHeight,
                }}
              >
                {diff.renamed_file
                  ? "File moved"
                  : "No available content to show"}
              </TextThemed>
            </View>
          )}
        </View>
      </View>
    );
  }, [diff, editor]);

  return (
    <View
      style={{
        width: "100%",
        flexDirection: "column",
      }}
    >
      <Collapsible
        renderHeader={renderHeader}
        renderContent={renderContent}
        contentHeight={calculatedHeight}
        initState={diff.diff_lines.length < LIMIT_LINES_TO_SHOW}
      />
    </View>
  );
};

export default React.memo(CommitDiffFiles);
