import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler/touchables";
import { GENERAL_BORDER } from "../../../../core/styles/general";
import { useTheme } from "../../../../theme/hooks";
import TextThemed from "../../../../components/Commons/TextThemed";
import IconFA from "react-native-vector-icons/FontAwesome5";
import { ICON_SOURCE_CODE_COLOR } from "../../../../core/styles/colors";
import { ProjectItemWrapperProps } from "./types";

const BOX_WIDTH = 120;
const BOX_MARGIN = 10;

const ProjectItemBox: React.FC<ProjectItemWrapperProps> = ({
  project,
  onPress,
  onLongPress,
}) => {
  const theme = useTheme();

  return (
    <SafeAreaView edges={["left", "right"]}>
      <View
        style={{
          width: BOX_WIDTH,
          margin: BOX_MARGIN,
        }}
      >
        <TouchableHighlight
          onPress={onPress}
          onLongPress={onLongPress}
          style={{
            borderRadius: GENERAL_BORDER,
          }}
          underlayColor={theme.colors.underlay_item}
        >
          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
              padding: 6,
              backgroundColor: theme.colors.bg_color,
            }}
          >
            <View>
              <IconFA
                name="folder"
                color={ICON_SOURCE_CODE_COLOR}
                size={64}
                solid
              />
            </View>
            <View>
              <TextThemed
                ellipsizeMode="tail"
                numberOfLines={2}
                style={{ textAlign: "center", fontSize: 14 }}
              >
                {project.name}
              </TextThemed>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
};

export const ProjectItemBoxInvisible: React.FC<any> = (props) => {
  return (
    <SafeAreaView>
      <View
        style={{
          width: BOX_WIDTH,
          margin: BOX_MARGIN,
          backgroundColor: "transparent",
        }}
      ></View>
    </SafeAreaView>
  );
};

export default React.memo(ProjectItemBox);
