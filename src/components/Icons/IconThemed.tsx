import React, { useMemo } from "react";
import TextThemed from "../Commons/TextThemed";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import Ionicon from "react-native-vector-icons/Ionicons";
import IconGit from "./IconGit";
import { TextStyle } from "react-native";

type IconThemedProps = {
  type: "ionicon" | "fontawesome" | "git";
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
  solid?: boolean;
  colorType?: "primary" | "secondary" | "muted" | "foot";
};
const IconThemed: React.FC<IconThemedProps> = ({
  type,
  name,
  size,
  color,
  colorType,
  style = {},
  solid,
}) => {
  const Icon = useMemo(() => {
    if (type == "git") {
      return IconGit;
    } else if (type === "fontawesome") {
      return FontAwesome;
    } else {
      return Ionicon;
    }
  }, [type]);

  const txt_style: TextStyle = useMemo(() => {
    if (color) {
      return { color, ...style };
    } else {
      return style;
    }
  }, [color, style]);

  return (
    <TextThemed type={colorType} style={txt_style}>
      <Icon name={name} size={size} solid={solid} />
    </TextThemed>
  );
};

export default React.memo(IconThemed);
