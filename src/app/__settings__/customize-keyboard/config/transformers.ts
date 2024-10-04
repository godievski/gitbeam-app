import { createTransform } from "redux-persist";
import _ from "lodash";
import { DEAFULT_KEYBOARD_CONFIG_STATE } from "./constants";
import { KeyboardConfigState } from "./types";

const compKeys = (key1, key2) => key1.id === key2.id;

export const keyboardTransform = createTransform(
  (inState: KeyboardConfigState) => {
    return inState;
  },
  (outState: KeyboardConfigState) => {
    const new_more = _.differenceWith(
      DEAFULT_KEYBOARD_CONFIG_STATE.included,
      outState.included,
      compKeys
    );

    const new_included = _.differenceWith(
      DEAFULT_KEYBOARD_CONFIG_STATE.included,
      new_more,
      compKeys
    );

    const result = {
      included: new_included,
      more: new_more,
      disabled: outState.disabled,
    };

    return result;
  },
  {
    whitelist: ["keyboardConfig"],
  }
);
