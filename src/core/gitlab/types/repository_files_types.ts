export type FileContentType = "text" | "image" | "other";

export type FileCustomeProps = {
  content_encoding: "gzip" | "text";
  content_decoded: string | null;
  type: FileContentType;
};

export type TFile = {
  file_name: string;
  file_path: string;
  size: number;
  encoding: string;
  content: string;
  content_sha256: string;
  ref: string;
  blob_id: string;
  commit_id: string;
  last_commit_id: string;
} & FileCustomeProps;

export interface ActionChange {
  file_name: string;
  file_path: string;
  action: "create" | "delete" | "update";
  content?: string;
  encoding: "text" | "base64";
  last_commit_id?: string;
}

export type NewFileData = {
  file_path: string;
  branch: string;
  start_branch?: string;
  encoding?: string; //  Change encoding to ‘base64’. Default is text.
  author_email?: string;
  author_name?: string;
  content: string;
  commit_message: string;
};
