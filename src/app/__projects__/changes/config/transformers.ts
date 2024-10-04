import { createTransform } from "redux-persist";
import _ from "lodash";
import { ChangesState } from "./types";
import { DEFAULT_STATE_BRANCH_CHANGES } from "./constants";

export const changesTransform = createTransform(
  (inState: ChangesState) => {
    const newChanges: ChangesState = {};

    _.each(inState, (change, key) => {
      newChanges[key] = {
        ...DEFAULT_STATE_BRANCH_CHANGES,
        ..._.omit(change, ["actions"]),
        actions: [],
      };
      if (Array.isArray(newChanges[key].actions)) {
        newChanges[key].actions = _.map(change.actions, (action) => {
          if (action.action === "create" || action.action === "update") {
            //async storage
            //do nothing
          }
          return {
            ..._.omit(action, ["content"]),
            content: "",
          };
        });
      }
    });

    return newChanges;
  },
  (outState: ChangesState) => {
    return outState;
  },
  {
    whitelist: ["changes"],
  }
);
