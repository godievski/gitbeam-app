import {
  MergeRequestState,
  RequestOrderBy,
  RequestScope,
  RequestSort,
  RequestStateEvent,
  UserBasic,
} from "../types";
import { TMilestone } from "./milestones_types";

export type TMergeRequest = {
  id: number;
  iid: number;
  project_id: number;
  title: string;
  description: string;
  state: MergeRequestState;
  merged_by: UserBasic | null;
  merged_at: string | null;
  closed_by: UserBasic | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  target_branch: string;
  source_branch: string;
  upvotes: number;
  downvotes: number;
  author: UserBasic;
  assignee: UserBasic | null;
  source_project_id: number;
  target_project_id: number;
  labels: string[];
  work_in_progress: boolean;
  milestone: TMilestone | null;
  merge_when_pipeline_succeeds: boolean;
  merge_status: string | "can_be_merged";
  sha: string;
  merge_commit_sha: any | null;
  user_notes_count: number;
  discussion_locked: boolean | null;
  should_remove_source_branch: boolean | null;
  force_remove_source_branch: boolean;
  allow_collaboration: boolean;
  allow_maintainer_to_push: boolean;
  web_url: string;
  time_stats: {
    time_estimate: number | null;
    total_time_spent: number | null;
    human_time_estimate: number | null;
    human_total_time_spent: number | null;
  };
  squash: boolean;
  approvals_before_merge: boolean;
};

export type QueryMergeRequest = {
  state: MergeRequestState;
  order_by: RequestOrderBy;
  sort: RequestSort;
  milestone?: "None" | "Any" | string | number;
  labels?: "None" | "Any" | string[];
  scope: RequestScope;
  source_branch?: string;
  target_branch?: string;
  search?: string;
};

export type AcceptMRData = {
  merge_commit_message?: string;
  squash_commit_message?: string;
  squash: boolean;
  should_remove_source_branch: boolean;
  merge_when_pipeline_succeeds: boolean;
  sha?: string;
};

//TODO: add more options
export interface NewMergeRequestData {
  id: number;
  source_branch: string;
  target_branch: string;
  title: string;
  assignee_id?: number | null;
  description?: string | null; //TODO: limit to 1,048,576 characters.
  labels?: string | null;
  milestone_id?: number | null;
  remove_source_branch?: boolean;
  squash?: boolean;
}

export interface UpdateMRData {
  target_branch?: string;
  title?: string;
  assignee_id?: number;
  assignee_ids?: number[];
  milestone_id?: number;
  labels?: string;
  description?: string;
  state_event?: RequestStateEvent;
  remove_source_branch?: boolean;
  squash?: boolean;
  discussion_locked?: boolean;
  allow_collaboration?: boolean;
  allow_maintainer_to_push?: boolean;
}
