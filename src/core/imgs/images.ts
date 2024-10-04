import { Image } from "react-native";

const imgs = {
  rose: require("../../../assets/img/rose.png"),
};

export const img_rose = Image.resolveAssetSource(imgs.rose).uri;
