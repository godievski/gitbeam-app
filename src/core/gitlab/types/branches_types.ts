export type TBranch = {
  name: string;
  merged: boolean;
  protected: boolean;
  developers_can_push: boolean;
  developers_can_merge: boolean;
  can_push: boolean;
  default: boolean;
  commit: {
    author_email: string;
    author_name: string;
    authored_date: string;
    committed_date: string;
    committer_email: string;
    committer_name: string;
    id: string;
    short_id: string;
    title: string;
    message: string;
  };
};

export type QueryBranches = {
  /**
   * Return list of branches containing the search string.
   * You can use ^term and term$ to find branches
   * that begin and end with term respectively.
   */
  search?: string;
};
export type NewBranchData = {
  branch: string;
  ref: string;
};
