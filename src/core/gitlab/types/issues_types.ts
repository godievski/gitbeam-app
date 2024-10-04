import {
  IssueState,
  RequestOrderBy,
  RequestScope,
  RequestSort,
  RequestStateEvent,
  TUserShort,
} from "../types";

export type TIssue = {
  id: number;
  iid: number;
  title: string;
  state: IssueState;
  description: string;
  author: TUserShort;
  milestone?: {
    project_id: number;
    description: string;
    state: "closed" | "active";
    due_date?: string;
    iid: number;
    created_at: string;
    title: string;
    id: number;
    updated_at: string;
  };
  project_id: number;
  assignees: TUserShort[];
  assignee: TUserShort | null;
  updated_at: string;
  closed_at: string | null;
  closed_by: TUserShort | null;
  created_at: string;
  moved_to_id: number | null;
  labels: string[];
  upvotes: number;
  downvotes: number;
  merge_requests_count: number;
  user_notes_count: number;
  due_date: string | null;
  web_url: string;
  references: {
    short: string;
    relative: string;
    full: string;
  };
  time_stats: {
    time_estimate: number;
    total_time_spent: number;
    human_time_estimate: number | null;
    human_total_time_spent: number | null;
  };
  has_tasks: boolean;
  task_status: string;
  confidential: boolean;
  discussion_locked: boolean;
  _links: {
    self: string;
    notes: string;
    award_emoji: string;
    project: string;
  };
  task_completion_status: {
    count: number;
    completed_count: number;
  };
};

export type QueryIssues = {
  state: IssueState;
  order_by: RequestOrderBy;
  sort: RequestSort;
  milestone?: "None" | "Any" | string | number;
  labels?: "None" | "Any" | string[];
  scope: RequestScope;
  search?: string;
};

export type NewIssueData = {
  id: number;
  title: string;
  description?: string | null;
  assignee_ids?: number[] | null;
  milestone_id?: number | null;
  confidential: boolean;
  labels?: string | null;
  due_date?: string | null;
};

export type UpdateIssueData = {
  id: number;
  issue_iid: number;
  title?: string;
  description?: string;
  confidential?: boolean;
  assignee_ids?: number[];
  milestone_id?: number;
  labels?: string;
  add_labels?: string;
  remove_labels?: string;
  state_event?: RequestStateEvent;
  due_date?: string; //YEAY-MONTH-DAY : 2016-03-11
  discussion_locked?: boolean;
};
