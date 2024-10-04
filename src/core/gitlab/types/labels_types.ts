export type TLabel = {
  id: number;
  name: string;
  color: string;
  text_color: string;
  description: string;
  open_issues_count: number;
  closed_issues_count: number;
  open_merge_requests_count: number;
  subscribed: boolean;
  priority: number | null;
  is_project_label: boolean;
};

export type QueryLabels = {
  with_counts?: boolean;
  include_ancestor_groups?: boolean;
  search?: string;
};

export type NewLabelData = {
  name: string;
  color: string;
  description?: string;
  priority?: number | null;
};

export type UpdateLabelData = {
  new_name?: string; // required if color is not provided
  color?: string; // required if new_name is not provided
  description?: string;
  priority?: number | null;
};
