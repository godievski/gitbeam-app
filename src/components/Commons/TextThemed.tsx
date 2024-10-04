import React from "react";

import { Text, TextProps } from "react-native";
import { useTheme } from "../../theme/hooks";

interface TextThemed extends TextProps {
  type?: "primary" | "secondary" | "muted" | "foot";
  children?: React.ReactNode;
}

const TextThemed: React.FC<TextThemed> = (props) => {
  const { type } = props;

  const theme = useTheme();

  let color = theme.colors.text_primary;
  let fontSize = 16;

  switch (type) {
    case "primary":
      color = theme.colors.text_primary;
      fontSize = 16;
      break;
    case "secondary":
      color = theme.colors.text_secondary;
      fontSize = 14;
      break;
    case "muted":
      color = theme.colors.text_tertiary;
      fontSize = 14;
      break;
    case "foot":
      color = theme.colors.foot_note;
      fontSize = 14;
      break;
    default:
      break;
  }

  return (
    <Text {...props} style={[{ color, fontSize }, props.style]}>
      {props.children}
    </Text>
  );
};

export default React.memo(TextThemed);
