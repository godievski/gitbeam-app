import React, { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GENERAL_CONTAINER_PADDING_HORIZONTAL,
  GENERAL_CONTAINER_PADDING_VERTICAL,
} from "../../../../core/styles/general";
import { Text } from "react-native";
import Button from "../../../../components/Buttons/Button";
import { useNavigation } from "@react-navigation/native";
import { goToCommitChanges } from "../config/navigation";
import Animated, { and, cond } from "react-native-reanimated";
import { interpolate } from "react-native-reanimated";

type ChangesCommitBtnProps = {
  project_id: number;
  branch: string;
  project_name: string;
  animation: Animated.Node<number>;
  show: boolean;
  disabled: boolean;
};

const ChangesCommitBtn: React.FC<ChangesCommitBtnProps> = ({
  project_id,
  branch,
  project_name,
  animation,
  show,
  disabled,
}) => {
  const navigation = useNavigation();
  const goToCommitChangesHandler = useCallback(() => {
    navigation.dispatch(goToCommitChanges(project_id, branch, project_name));
  }, []);

  const translateY = interpolate(animation, {
    inputRange: [0, 1],
    outputRange: [0, 50],
  });
  const opacity = interpolate(animation, {
    inputRange: [0, 0.8, 1],
    outputRange: [1, 0, 0],
  });

  if (!show) {
    return null;
  }

  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={{
        paddingHorizontal: GENERAL_CONTAINER_PADDING_HORIZONTAL,
        position: "absolute",
        bottom: 0,
        left: 0,
        paddingBottom: GENERAL_CONTAINER_PADDING_VERTICAL,
        width: "100%",
      }}
    >
      <Animated.View
        style={{ position: "relative", transform: [{ translateY }], opacity }}
      >
        <Button
          onPress={goToCommitChangesHandler}
          style={{ width: "100%" }}
          disabled={disabled}
        >
          <Text style={{ fontWeight: "700", fontSize: 18, color: "#fff" }}>
            COMMIT CHANGES
          </Text>
        </Button>
      </Animated.View>
    </SafeAreaView>
  );
};

export default React.memo(ChangesCommitBtn);
