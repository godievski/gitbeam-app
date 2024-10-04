export const getKeySourceCodeTree = ({
  project_id,
  ref,
  path,
}: {
  project_id: number;
  ref: string;
  path: string;
}) => {
  return `${project_id}|${ref}|${path}`;
};
