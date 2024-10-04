import { MilestoneState } from "../types";

export type TMilestone = {
  id: number;
  iid: number;
  project_id: number;
  title: string;
  description: string;
  due_date: string;
  start_date: string;
  state: "active" | "closed";
  updated_at: string;
  created_at: string;
};

export type QueryMilestones = {
  iids?: number[]; //Return only the milestones having the given iid (Note: ignored if include_parent_milestones is set as true)
  state?: MilestoneState; //Return only active or closed milestones
  title?: string; //	Return only the milestones having the given title
  search?: string; // Return only milestones with a title or description matching the provided string
  include_parent_milestones?: boolean; //Include group milestones from parent group and its ancestors. Introduced in GitLab 13.4
};

export type AddMilestoneData = {
  title: string;
  description?: string;
  due_date?: string;
  start_date?: string;
};

export type UpdateMilestoneData = {
  title?: string;
  description?: string | null;
  due_date?: string | null;
  start_date?: string | null;
  state_event?: "close" | "activate";
};
