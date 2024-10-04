import React, { useCallback, useEffect } from "react";
import { View, ActivityIndicator, Text, StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Button from "../../../components/Buttons/Button";
import { useToast } from "../../../components/Toast/ToastContext";
import { debug } from "../../../core/debug";
import { img_rose } from "../../../core/imgs/images";
import { PRIMARY_COLOR } from "../../../core/styles/colors";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { updateAuthStatus, revokeCredential } from "../config/authSlice";
import secureStorage from "../config/secureStorage";
import { CredentialStatus } from "../config/types";
import { validCredentials } from "../utils";

type SecureAuthenticatorProps = {};
const SecureAuthenticator: React.FC<SecureAuthenticatorProps> = ({}) => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const credential = useAppSelector((state) => state.credential);

  const getCredential = useCallback(async () => {
    dispatch(updateAuthStatus({ status: CredentialStatus.authenticating }));
    try {
      //check if password exists
      const stored_credential = await secureStorage.getCredential();
      if (stored_credential !== false) {
        await validCredentials(stored_credential, dispatch, toast);
      } else {
        dispatch(updateAuthStatus({ status: CredentialStatus.empty }));
      }
    } catch (e) {
      debug && console.log(e);
      dispatch(updateAuthStatus({ status: CredentialStatus.error, error: e }));
    }
  }, []);

  const logout = useCallback(async () => {
    dispatch(revokeCredential());
  }, []);

  useEffect(() => {
    getCredential();
  }, []);

  return (
    <View style={styles.container}>
      {credential.status === CredentialStatus.error ? (
        <>
          <View style={styles.img}>
            <Image
              style={{ flex: 1, width: undefined, height: undefined }}
              resizeMode="contain"
              source={{ uri: img_rose }}
            />
          </View>
          <View style={styles.container_info}>
            <Text style={styles.subtitle}>Application locked</Text>
            <Text style={styles.info}>
              Unable to unlock the app, tap below to try again
            </Text>
          </View>
          <Button onPress={getCredential} style={styles.btn}>
            <Text style={styles.btn_txt}>Retry</Text>
          </Button>
          <View style={{ marginTop: 20 }}>
            <TouchableOpacity onPress={logout} style={styles.btn_logout}>
              <Text style={styles.btn_logout_text}>
                or Logging with another account
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <ActivityIndicator color="white" />
          <Text style={styles.text}>Authenticating</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR,
  },
  img: {
    width: 200,
    height: 200,
  },
  container_info: {
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "500",
    marginBottom: 6,
  },
  info: {
    color: "#fff",
    opacity: 0.5,
    fontSize: 13,
    marginBottom: 10,
  },
  btn: {
    paddingHorizontal: 40,
    paddingVertical: 10,
  },
  btn_txt: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  text: {
    paddingTop: 10,
    color: "#fff",
  },
  btn_logout: {
    padding: 10,
  },
  btn_logout_text: {
    color: "#fff",
    opacity: 0.5,
    fontSize: 13,
  },
});

export default React.memo(SecureAuthenticator);
