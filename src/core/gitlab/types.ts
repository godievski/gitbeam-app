import { AxiosResponse } from "axios";
import { APIQueryParams, ResponseWithPage } from "./api";

export type TUserShort = {
  id: number;
  state: string;
  name: string;
  username: string;
  web_url: string | null;
  avatar_url: string | null;
};

export enum RequestOrderBy {
  CREATED_AT = "created_at",
  UPDATED_AT = "updated_at",
}

export enum RequestSort {
  ASC = "asc",
  DESC = "desc",
}

export enum RequestScope {
  ALL = "all",
  CREATED_BY_ME = "created_by_me",
  ASSIGNED_TO_ME = "assigned_to_me",
}

export enum MemberAccess {
  GUEST = 10,
  REPORTER = 20,
  DEVELOPER = 30,
  MAINTAINER = 40,
  OWNER = 50, //only for groups
}

export const MemberAccessDesc = {
  [MemberAccess.GUEST]: "Guest",
  [MemberAccess.REPORTER]: "Reporter",
  [MemberAccess.DEVELOPER]: "Developer",
  [MemberAccess.MAINTAINER]: "Maintainer",
  [MemberAccess.OWNER]: "Owner",
};

export interface Member {
  user_id: number;
  access_level: MemberAccess;
  expires_at?: string | null;
}

export interface UserBasic {
  id: number;
  username: string;
  name: string;
  state: "active" | "blocked";
  avatar_url: string | null;
  web_url: string;
}

export enum IssueState {
  ALL = "all",
  OPENED = "opened",
  CLOSED = "closed",
}

export enum MergeRequestState {
  ALL = "all",
  MERGED = "merged",
  OPENED = "opened",
  CLOSED = "closed",
  LOCKED = "locked",
}

export enum MilestoneState {
  CLOSED = "closed",
  ACTIVE = "active",
}

export enum RequestStateEvent {
  CLOSE = "close",
  REOPEN = "reopen",
}

// extra types
export const RequestQueryValues = {
  order_by: Object.entries(RequestOrderBy).map((val) => val[1]),
  sort: Object.entries(RequestSort).map((val) => val[1]),
  scope: Object.entries(RequestScope).map((val) => val[1]),
  merge_request_state: Object.entries(MergeRequestState).map((val) => val[1]),
  issue_state: Object.entries(IssueState).map((val) => val[1]),
};

export interface CrudAPI<
  Entity,
  Query extends APIQueryParams,
  CreateData,
  UpdateData
> {
  list(
    project_id: number,
    params: Query
  ): Promise<AxiosResponse<ResponseWithPage<Entity[]>>>;

  add(project_id: number, data: CreateData): Promise<AxiosResponse<Entity>>;

  update(
    project_id: number,
    identifier: number | string,
    data: UpdateData
  ): Promise<AxiosResponse<Entity>>;

  //TODO: delete data return
  delete(
    project_id: number,
    identifier: number | string
  ): Promise<AxiosResponse<any>>;
}
