import { QueryRepository } from "../../../../core/gitlab/types/repository_types";
import { CRUDState } from "../../../../core/utils";
import { SourceCodeItemState, SourceCodeState } from "./types";

export const DEFAULT_QUERY: QueryRepository = {
  path: "",
  recursive: false,
};

export const DEFAULT_ITEM_STATE: SourceCodeItemState = {
  state: CRUDState.idle,
  entities: undefined,
  next_page: "",
};

export const DEFAULT_STATE: SourceCodeState = {};
