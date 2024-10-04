import { APIQueryParams } from "../api";

export enum TRepoNodeType {
  tree = "tree",
  blob = "blob",
}

export type TRepoNode = {
  id: string;
  name: string;
  path: string;
  mode: string;
  type: TRepoNodeType;
  //custome field
  isNew?: boolean;
};

export type QueryRepository = APIQueryParams & {
  path?: string; // The path inside repository. Used to get content of subdirectories
  ref?: string; // The name of a repository branch or tag or if not given the default branch
  recursive?: boolean; // Boolean value used to get a recursive tree (false by default)
};
