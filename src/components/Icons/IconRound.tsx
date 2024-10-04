import React, { useMemo } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import Ionicon from "react-native-vector-icons/Ionicons";
import IconGit from "./IconGit";
import { View, ViewStyle } from "react-native";
import { PALETTE } from "../../core/styles/colors";

type IconRoundProps = {
  type: "ionicon" | "fontawesome" | "git";
  name: string;
  size?: number;
  backgroundColor?: string;
  iconColor?: string;
};

const IconRound: React.FC<IconRoundProps> = ({
  type,
  name,
  size = 30,
  backgroundColor = PALETTE.secondary,
  iconColor = "#ffffff",
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

  const icon_size = useMemo(() => {
    return 18;
  }, []);

  const style: ViewStyle = useMemo(() => {
    return {
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 6,
      backgroundColor,
    };
  }, [size, backgroundColor]);

  return (
    <View style={style}>
      <Icon name={name} size={icon_size} color={iconColor} />
    </View>
  );
};

export default React.memo(IconRound);
