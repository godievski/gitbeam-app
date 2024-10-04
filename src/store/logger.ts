import { createLogger } from "redux-logger";
import omit from "lodash/omit";
import { RootState } from "./rootReducer";

const logger = createLogger({
  stateTransformer: (state: RootState) => {
    return {};
  },
});

export const createSimpleLogger = function(omit_payload = true) {
  return (store) => (next) => (action) => {
    let buffer = `Action: \n`;

    if (action.payload == null || !omit_payload) {
      buffer += JSON.stringify(action, null, 4);
    } else {
      buffer += JSON.stringify(omit(action, ["payload"]), null, 4);
    }

    console.log(buffer);
    return next(action);
  };
};

export default logger;
