import React, { memo, useCallback } from "react";
import Header from "../../../../components/Header/Header";
import { View, Image, Linking, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { GREEN_COLOR } from "../../../../core/styles/colors";
import TitleHeader from "../../../../components/Header/TitleHeader";
import Container from "../../../../components/Layouts/Container";
import TextThemed from "../../../../components/Commons/TextThemed";
import { GENERAL_ICON_SIZE } from "../../../../core/styles/general";
import ButtonRound from "../../../../components/Buttons/ButtonRound";
import { StyleSheet } from "react-native";
import ScrollView from "../../../../components/RN/ScrollView";
import { SafeAreaView } from "react-native-safe-area-context";
import { debug } from "../../../../core/debug";
import { img_rose } from "../../../../core/imgs/images";

interface Props {}

const styles = StyleSheet.create({
  btn_inner: {
    flexDirection: "row",
    alignItems: "center",
  },
  btn_icon: {
    fontSize: GENERAL_ICON_SIZE,
    color: "#fff",
    marginRight: 10,
  },
  btn_txt: { fontSize: 16, color: "#fff", fontWeight: "500" },
});

const About: React.FC<Props> = (props) => {
  const __title__ = useCallback(() => <TitleHeader title="About" />, []);

  const openPaypal = useCallback(() => {
    Linking.openURL("https://paypal.me/godievski").catch((err) => {
      debug && console.log(err);
    });
  }, []);

  const openTwitter = useCallback(() => {
    Linking.openURL("https://twitter.com/godievski").catch((err) => {
      debug && console.log(err);
    });
  }, []);

  const openMail = useCallback(() => {
    Linking.openURL("mailto:inf.diegog@gmail.com").catch((err) => {
      debug && console.log(err);
    });
  }, []);

  return (
    <Container>
      <Header center={__title__} isModal={true} backBtn={false} />
      <SafeAreaView edges={["left", "right"]} style={{ flex: 1 }}>
        <ScrollView
          style={{
            flex: 1,
            minHeight: "100%",
            paddingHorizontal: 15,
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ width: 140, height: 140, padding: 10 }}>
              <Image
                style={{ flex: 1, width: undefined, height: undefined }}
                resizeMode="contain"
                source={{ uri: img_rose }}
              />
            </View>
            <TextThemed
              style={{ fontSize: 18, paddingVertical: 10 }}
            >{`GitBeam was created by Godievski.`}</TextThemed>
            <ButtonRound
              onPress={openPaypal}
              style={{ margin: 20, backgroundColor: "#1e477a", width: "70%" }}
            >
              <View style={styles.btn_inner}>
                <Icon name="paypal" style={styles.btn_icon} />
                <Text style={styles.btn_txt}>Paypal Donation</Text>
              </View>
            </ButtonRound>

            <ButtonRound
              onPress={openTwitter}
              style={{ margin: 20, backgroundColor: "#00acee", width: "70%" }}
            >
              <View style={styles.btn_inner}>
                <Icon name="twitter" style={styles.btn_icon} />
                <Text style={styles.btn_txt}>Twitter</Text>
              </View>
            </ButtonRound>
            <ButtonRound
              onPress={openMail}
              style={{ margin: 20, backgroundColor: GREEN_COLOR, width: "70%" }}
            >
              <View style={styles.btn_inner}>
                <Icon name="envelope" style={styles.btn_icon} />
                <Text style={styles.btn_txt}>Features / Bug Reports</Text>
              </View>
            </ButtonRound>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Container>
  );
};

export default memo(About);
