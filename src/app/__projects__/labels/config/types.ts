import {
  QueryLabels,
  TLabel,
} from "../../../../core/gitlab/types/labels_types";
import { GenericState } from "../../../../store/types";

export type ItemProjectLabelsState = GenericState<TLabel, QueryLabels>;

export type ProjectLabelsState = Record<number, ItemProjectLabelsState>;
