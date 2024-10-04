import { QueryLabels } from "../../../../core/gitlab/types/labels_types";
import { CRUDState } from "../../../../core/utils";
import { ItemProjectLabelsState, ProjectLabelsState } from "./types";

export const DEFAULT_QUERY: QueryLabels = {};

export const DEFAULT_ITEM_STATE: ItemProjectLabelsState = {
  entities: undefined,
  state: CRUDState.idle,
  next_page: "",
  query: DEFAULT_QUERY,
};

export const DEFAULT_STATE: ProjectLabelsState = {};
