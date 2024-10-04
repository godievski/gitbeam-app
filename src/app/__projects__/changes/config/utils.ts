export const getBranchChangesKey = (project_id: number, branch_name: string) =>
  `${project_id}|${branch_name}`;
