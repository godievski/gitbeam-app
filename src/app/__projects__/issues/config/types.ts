import {
  QueryIssues,
  TIssue,
} from "../../../../core/gitlab/types/issues_types";
import { GenericState } from "../../../../store/types";

export type IssuesProjectState = GenericState<TIssue, QueryIssues>;

export type IssuesState = Record<number, IssuesProjectState>;

export type FuncUpdateIssueQuery = (
  atrr: string,
  val: string | string[] | undefined | null
) => void;
