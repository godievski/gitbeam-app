const open_sources_obj = {
  "@godievski/rn-syntax-highlighter": "^0.1.11",
  "@react-native-community/async-storage": "^1.11.0",
  "@react-native-community/blur": "^3.6.0",
  "@react-native-community/clipboard": "^1.2.3",
  "@react-native-community/datetimepicker": "^2.6.1",
  "@react-native-community/masked-view": "^0.1.10",
  "@react-native-community/picker": "^1.6.6",
  "@react-navigation/bottom-tabs": "^5.8.0",
  "@react-navigation/drawer": "^5.9.0",
  "@react-navigation/material-bottom-tabs": "^5.2.16",
  "@react-navigation/material-top-tabs": "^5.2.16",
  "@react-navigation/native": "^5.7.3",
  "@react-navigation/stack": "^5.9.0",
  axios: "^0.19.0",
  bluebird: "^3.7.1",
  buffer: "^5.4.3",
  "hi-base64": "^0.2.1",
  "javascript-time-ago": "^2.0.4",
  lodash: "^4.17.20",
  "mime-types": "^2.1.25",
  moment: "^2.24.0",
  path: "^0.12.7",
  react: "16.13.1",
  "react-native": "0.63.2",
  "react-native-animate-number": "^0.1.2",
  "react-native-app-auth": "^4.4.0",
  "react-native-config": "^1.0.0",
  "react-native-draggable-flatlist": "^2.3.3",
  "react-native-fs": "^2.16.6",
  "react-native-gesture-handler": "^1.7.0",
  "react-native-image-pan-zoom": "^2.1.11",
  "react-native-iphone-x-helper": "^1.2.1",
  "react-native-keyboard-aware-scroll-view": "^0.9.2",
  "react-native-modalize": "^2.0.5",
  "react-native-paper": "^3.10.1",
  "react-native-reanimated": "^1.13.0",
  "react-native-root-toast": "^3.2.1",
  "react-native-safe-area-context": "^2.0.0",
  "react-native-screens": "^2.8.0",
  "react-native-splash-screen": "^3.2.0",
  "react-native-tab-view": "^2.14.4",
  "react-native-typography": "^1.4.1",
  "react-native-vector-icons": "^7.0.0",
  "react-redux": "^7.1.3",
  redux: "^4.0.4",
  "redux-persist": "^6.0.0",
  "redux-thunk": "^2.3.0",
  "valid-filename": "^3.1.0",
};

export const open_sources = Object.entries(open_sources_obj).map(([key]) => ({
  name: key,
}));
