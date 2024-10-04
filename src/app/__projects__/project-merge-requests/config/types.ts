import {
  QueryMergeRequest,
  TMergeRequest,
} from "../../../../core/gitlab/types/merge_requests_types";
import { GenericState } from "../../../../store/types";

export type MergeRequestsByProject = GenericState<
  TMergeRequest,
  QueryMergeRequest
>;

export type MergeRequestsState = Record<number, MergeRequestsByProject>;
