import React from "react";
import RNSyntaxHighlighter from "@godievski/rn-syntax-highlighter";
import * as hljs from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useTheme } from "../../theme/hooks";

interface HighlighterProps {
  style_highlighter: string;
  type: string;
  content: string;
  language?: string;
}
const Highlighter: React.FC<HighlighterProps> = (props) => {
  const { style_highlighter, type, content, language } = props;

  const theme = useTheme();

  return (
    <RNSyntaxHighlighter
      language={language}
      style={hljs[style_highlighter]}
      highlighter={type}
      dark={theme.isDark}
    >
      {content || ""}
    </RNSyntaxHighlighter>
  );
};

export default Highlighter;
