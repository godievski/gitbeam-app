import { ActionChange } from "../../../../core/gitlab/types/repository_files_types";

export type BranchChanges = {
  committing: boolean;
  fs_state: "idle" | "reading" | "deleting" | "writting";
  network_state: "idle" | string;
  actions: ActionChange[];
};

export type ChangesState = Record<string, BranchChanges>;
