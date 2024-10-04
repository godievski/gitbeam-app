import {
  QueryBranches,
  TBranch,
} from "../../../../core/gitlab/types/branches_types";
import { GenericState } from "../../../../store/types";

export type BranchesProjectState = GenericState<TBranch, QueryBranches>;

export type BranchesState = Record<number, BranchesProjectState>;
