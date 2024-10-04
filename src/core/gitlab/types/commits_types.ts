import { ActionChange } from "./repository_files_types";

export type TCommit = {
  id: string;
  short_id: string;
  title: string;
  author_name: string;
  author_email: string;
  authored_date: string;
  committer_name: string;
  committer_email: string;
  committed_date: string;
  created_at: string;
  message: string;
  stats: {
    additions: number;
    deletions: number;
    total: number;
  };
  status: string;
};

export type QueryCommits = {
  ref_name?: string;
  since?: string; //Only commits after or on this date will be returned in ISO 8601 format YYYY-MM-DDTHH:MM:SSZ
  until?: string; //Only commits before or on this date will be returned in ISO 8601 format YYYY-MM-DDTHH:MM:SSZ
  path?: string;
  all?: boolean;
  with_stats?: boolean; //Stats about each commit will be added to the response
  first_parent?: boolean;
  order?: string; // values: default, topo
};

export type TCommitDiff = {
  diff: string;
  new_path: string;
  old_path: string;
  a_mode: string | null;
  b_mode: string | null;
  new_file: boolean;
  renamed_file: boolean;
  deleted_file: boolean;
};

export type CommitDiffLines = {
  line: string;
  type: "add" | "remove" | "info" | "neutro";
  a_line_number: number | string;
  b_line_number: number | string;
};

export type TCommitDiffParsed = TCommitDiff & {
  diff_lines: CommitDiffLines[];
  max_line_number: number;
};

export interface APIGetCommitDiffParams {
  project_id: number;
  commit_sha: string;
}

export interface APICommitPayload {
  author_name?: string;
  author_email?: string;
  commit_message: string;
  actions: ActionChange[];
  branch: string;
}
