import { TMergeRequest } from "../../../../core/gitlab/types/merge_requests_types";

export function getDefaultCommitMsg(mr_item: TMergeRequest) {
  return `Merge branch '${mr_item.source_branch}' into '${mr_item.target_branch}'`;
}
