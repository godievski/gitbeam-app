import { BranchChanges, ChangesState } from "./types";

export const DEFAULT_STATE_BRANCH_CHANGES: BranchChanges = {
  committing: false,
  fs_state: "idle",
  network_state: "idle",
  actions: [],
};

export const DEFAULT_STATE: ChangesState = {};
