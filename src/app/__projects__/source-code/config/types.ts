import { TRepoNode } from "../../../../core/gitlab/types/repository_types";
import { CRUDState } from "../../../../core/utils";

export type SourceCodeItemState = {
  state: CRUDState;
  entities: TRepoNode[] | undefined;
  next_page: string;
};

export type SourceCodeState = Record<string, SourceCodeItemState>;
