import React, { useMemo, useState } from "react";
import { View } from "react-native";
import TextThemed from "../../../../components/Commons/TextThemed";
import { TCommit } from "../../../../core/gitlab/types/commits_types";
import { useTheme } from "../../../../theme/hooks";
import en from "javascript-time-ago/locale/en";
import TimeAgo from "javascript-time-ago";
import Separator from "../../../../components/Group/Separator";
import { SafeAreaView } from "react-native-safe-area-context";
import { GIT_COLORS, PALETTE } from "../../../../core/styles/colors";
import {
  GENERAL_CONTAINER_PADDING_HORIZONTAL,
  GENERAL_CONTAINER_PADDING_VERTICAL,
} from "../../../../core/styles/general";

TimeAgo.addLocale(en);
const moment = require("moment");
const timeAgo = new TimeAgo("en-US");

type CommitDiffHeaderProps = {
  commit: TCommit;
  files_changed: number;
};

const CommitDiffHeader: React.FC<CommitDiffHeaderProps> = ({
  commit,
  files_changed,
}) => {
  const [utcOffset] = useState(() => moment().utcOffset());

  const message_parsed = useMemo(() => {
    const message_lines = commit.message.trim().split("\n");
    let message = commit.message;
    if (message_lines[0] === commit.title && message_lines.length > 1) {
      message = message_lines.slice(1).join("\n");
    }
    return message;
  }, [commit]);

  const date = moment
    .parseZone(commit.authored_date)
    .utcOffset(utcOffset)
    .toDate();

  const theme = useTheme();

  return (
    <SafeAreaView
      style={{
        paddingHorizontal: GENERAL_CONTAINER_PADDING_HORIZONTAL,
        paddingVertical: GENERAL_CONTAINER_PADDING_VERTICAL,
        marginBottom: 20,
      }}
      edges={["left", "right"]}
    >
      <View style={{ marginBottom: 8 }}>
        <TextThemed style={{ fontSize: 13 }}>
          <TextThemed style={{ fontWeight: "600" }}>
            Commit {commit.short_id}
          </TextThemed>
          {" - authored "}
          {timeAgo.format(date)}
          {" by "}
          <TextThemed style={{ fontWeight: "600" }}>
            {commit.author_name}
          </TextThemed>
        </TextThemed>
      </View>
      <Separator full={true} />
      <View style={{ marginTop: 8 }}>
        <TextThemed style={{ fontSize: 22, fontWeight: "600" }}>
          {commit.title}
        </TextThemed>
      </View>
      {commit.title !== commit.message.trimEnd() && (
        <View
          style={{
            marginTop: 3,
            borderLeftWidth: 2,
            borderColor: theme.colors.divider_color,
            paddingLeft: 6,
            paddingVertical: 4,
          }}
        >
          <TextThemed
            type="secondary"
            style={{ fontWeight: "400", fontSize: 14 }}
          >
            {message_parsed}
          </TextThemed>
        </View>
      )}
      <View style={{ marginTop: 16 }}>
        <TextThemed style={{ lineHeight: 20 }}>
          {"Showing "}
          <TextThemed
            style={{ fontWeight: "600", color: PALETTE.blue }}
          >{`${files_changed} files changed`}</TextThemed>
        </TextThemed>
        <TextThemed style={{ lineHeight: 20 }}>
          <TextThemed style={{ color: GIT_COLORS.commit.additions }}>
            {commit.stats.additions} additions
          </TextThemed>
          {" and "}
          <TextThemed style={{ color: GIT_COLORS.commit.deletions }}>
            {commit.stats.deletions} deletions
          </TextThemed>
        </TextThemed>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(CommitDiffHeader);
