import {
  AnyAction,
  configureStore,
  getDefaultMiddleware,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-community/async-storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { changesTransform } from "../app/__projects__/changes/config/transformers";
import themeTransformer from "../theme/transformer";
import { keyboardTransform } from "../app/__settings__/customize-keyboard/config/transformers";
import rootReducer, { RootState } from "./rootReducer";
import { createSimpleLogger } from "./logger";
import { Dispatch } from "react";
// import thunk from "redux-thunk";

const logger = createSimpleLogger();

const persistConfig = {
  key: "root",
  timeout: 10000, //workaround for debug mode
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  whitelist: [
    "changes",
    "highlight",
    "keyboardConfig",
    "editorConfig",
    "theme",
  ],
  transforms: [changesTransform, keyboardTransform, themeTransformer],
};

export const persistedReducer = persistReducer<RootState>(
  persistConfig,
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
    inmutableCheck: false,
  }),
});

// export type AppDispatch = typeof store.dispatch;
//Workaround for typescript persisted reducer
export type AppDispatch = ThunkDispatch<RootState, null, AnyAction> &
  ThunkDispatch<RootState, undefined, AnyAction> &
  Dispatch<AnyAction>;

export const persistor = persistStore(store);
