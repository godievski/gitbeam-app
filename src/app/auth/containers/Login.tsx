import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Image,
  Animated,
  Easing,
  SafeAreaView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { authorizeGitlab } from "../../../core/oauth";
import { RED_ROSE, PRIMARY_COLOR } from "../../../core/styles/colors";
import IconFA from "react-native-vector-icons/FontAwesome5";
import { GITLAB_WEB } from "../../../core/gitlab/api";
import { useToast } from "../../../components/Toast/ToastContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TOAST_TYPES } from "../../../components/Toast/ToastContext";
import { validCredentials, AUTHENTICATION_CANCELLED } from "../utils";
import { Text } from "react-native";
import Button from "../../../components/Buttons/Button";
import { useAppDispatch } from "../../../store/hooks";

const RoseImg = require("../../../../assets/img/rose.png");

const IconAnimated = Animated.createAnimatedComponent(IconFA);

type LoginProps = {};

const Login: React.FC<LoginProps> = ({}) => {
  const opacity = useRef(new Animated.Value(1)).current;

  const [authenticating, setAuthenticating] = useState(false);

  const dispatch = useAppDispatch();
  const toast = useToast();

  const signInAsync = useCallback(() => {
    setAuthenticating(true);
    authorizeGitlab()
      .then(async (res) => {
        const cred = res;
        await validCredentials(cred, dispatch, toast);
      })
      .catch(() => {
        toast.updateMessage({
          status: TOAST_TYPES.WARNING,
          message: AUTHENTICATION_CANCELLED,
        });
      })
      .finally(() => {
        setAuthenticating(false);
      });
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
    return () => {
      opacity.stopAnimation();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          padding: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={styles.wrapper_logo}>
          <View style={styles.image}>
            <Image
              style={{ flex: 1, width: undefined, height: undefined }}
              resizeMode="contain"
              source={RoseImg}
            />
          </View>
          <Text style={styles.title}>Welcome to GitBeam</Text>
        </View>
        <View>
          <Button
            style={{
              backgroundColor: "#fa7035",
              borderRadius: 10,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderWidth: 0,
            }}
            onPress={signInAsync}
            disabled={authenticating}
          >
            {authenticating ? (
              <View style={styles.inner_btn}>
                <ActivityIndicator color="white" />
              </View>
            ) : (
              <View style={styles.inner_btn}>
                <IconAnimated
                  name="gitlab"
                  size={28}
                  style={{
                    opacity,
                    color: "#fff",
                    marginRight: 10,
                  }}
                />
                <Text
                  style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}
                >
                  LOGGING INTO GITLAB
                </Text>
              </View>
            )}
          </Button>
        </View>
        <View style={{ marginTop: 16 }}>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(GITLAB_WEB);
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 14,
                fontWeight: "400",
              }}
            >
              or visit GitLab.com
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  wrapper_logo: {
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: 20,
  },
  inner_btn: {
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  title: {
    fontSize: 32,
    color: "#fff",
    opacity: 1,
    textAlign: "center",
    fontFamily: "DejaVu Sans Mono",
  },
  button: {
    backgroundColor: RED_ROSE,
    paddingHorizontal: 32,
  },
  image: {
    width: 140,
    height: 140,
  },
});

export default React.memo(Login);
