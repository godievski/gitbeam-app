export const getCommitDiffKey = ({
  project_id,
  commit_sha,
}: {
  project_id: number;
  commit_sha: string;
}) => {
  return `${project_id}|${commit_sha}`;
};
