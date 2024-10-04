import { MemberAccess } from "../types";

export type TProject = {
  id: number;
  allow_merge_on_skipped_pipeline: boolean | null;
  archived: boolean;
  auto_cancel_pending_pipelines: string | "enabled";
  auto_devops_deploy_strategy: string | "continuous";
  auto_devops_enabled: boolean;
  autoclose_referenced_issues: boolean;
  avatar_url: string | null;
  build_coverage_regex: string | null;
  build_git_strategy: string | "fetch";
  build_timeout: number;
  builds_access_level: string | "enabled";
  can_create_merge_request_in: boolean;
  ci_config_path: string | null;
  ci_default_git_depth: string | null;
  compliance_frameworks: any[];
  container_registry_enabled: boolean;
  created_at: string;
  creator_id: number;
  default_branch: string | null;
  description: string | null;
  emails_disabled: boolean | null;
  empty_repo: boolean;
  external_authorization_classification_label: string;
  forking_access_level: string | "enabled";
  forks_count: number;
  http_url_to_repo: string;
  import_error: string | null;
  import_status: string | "none";
  issues_access_level: string | "enabled";
  issues_enabled: boolean;
  jobs_enabled: boolean;
  last_activity_at: string;
  lfs_enabled: boolean;
  merge_method: string | "merge";
  merge_requests_access_level: string | "enabled";
  merge_requests_enabled: boolean;
  name: string;
  name_with_namespace: string;
  namespace: {
    avatar_url: string | null;
    full_path: string;
    id: number;
    kind: string | "group";
    name: string;
    parent_id: number | null;
    path: string;
    web_url: string;
  };
  only_allow_merge_if_all_discussions_are_resolved: boolean;
  only_allow_merge_if_pipeline_succeeds: boolean;
  open_issues_count: number;
  packages_enabled: null;
  pages_access_level: string | "public";
  path: string;
  path_with_namespace: string;
  permissions: {
    group_access: {
      access_level: MemberAccess;
      notification_level: number;
    } | null;
    project_access: {
      access_level: MemberAccess;
      notification_level: number;
    } | null;
  };
  printing_merge_request_link_enabled: boolean;
  public_jobs: boolean;
  readme_url: string | null;
  remove_source_branch_after_merge: boolean | null;
  repository_access_level: string | "enabled";
  request_access_enabled: boolean;
  resolve_outdated_diff_discussions: string | boolean | null;
  runners_token: string;
  service_desk_address: string | null;
  service_desk_enabled: boolean | null;
  shared_runners_enabled: boolean;
  shared_with_groups: any[];
  snippets_access_level: string | "enabled";
  snippets_enabled: boolean;
  ssh_url_to_repo: string;
  star_count: number;
  statistics: {
    commit_count: number;
    job_artifacts_size: number;
    lfs_objects_size: number;
    repository_size: number;
    snippets_size: number;
    storage_size: number;
    wiki_size: number;
  };
  suggestion_commit_message: string | null;
  tag_list: string[];
  visibility: string | "private" | "public";
  web_url: string;
  wiki_access_level: string | "enabled";
  wiki_enabled: boolean;
  _links: {
    events: string;
    issues: string;
    labels: string;
    members: string;
    merge_requests: string;
    repo_branches: string;
    self: string;
  };
};

export const TProjectSimpleKeys = [
  "avatar_url",
  "created_at",
  "default_branch",
  "description",
  "forks_count",
  "http_url_to_repo",
  "id",
  "last_activity_at",
  "name",
  "name_with_namespace",
  "namespace",
  "path",
  "path_with_namespace",
  "readme_url",
  "ssh_url_to_repo",
  "star_count",
  "tag_list",
  "web_url",
];
export type TProjectSimple = Pick<
  TProject,
  | "avatar_url"
  | "created_at"
  | "default_branch"
  | "description"
  | "forks_count"
  | "http_url_to_repo"
  | "id"
  | "last_activity_at"
  | "name"
  | "name_with_namespace"
  | "namespace"
  | "path"
  | "path_with_namespace"
  | "readme_url"
  | "ssh_url_to_repo"
  | "star_count"
  | "tag_list"
  | "web_url"
>;
