import { AxiosInstance, AxiosResponse } from "axios";
import { api } from "../../oauth";
import { APIQueryParams, API_ITEMS_PER_PAGE, ResponseWithPage } from "../api";
import { CrudAPI } from "../types";
import {
  NewIssueData,
  QueryIssues,
  TIssue,
  UpdateIssueData,
} from "../types/issues_types";
import { getNextPage } from "../utils";

class IssuesAPI
  implements
    CrudAPI<
      TIssue,
      QueryIssues & APIQueryParams,
      NewIssueData,
      UpdateIssueData
    > {
  private API: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.API = api;
  }

  /**
   * Get a list of a project’s issues.
   */
  public list(
    project_id: number,
    params: QueryIssues & APIQueryParams
  ): Promise<AxiosResponse<ResponseWithPage<TIssue[]>>> {
    return this.API.get(`/projects/${project_id}/issues`, {
      params: {
        page: 1,
        per_page: API_ITEMS_PER_PAGE,
        ...params,
      },
    }).then((res) => {
      const next_page = getNextPage(res);
      const data = res.data;
      res.data = {
        next_page,
        data,
      };
      return res;
    });
  }

  /**
   Creates a new project issue.
   */
  public add(
    project_id: number,
    data: NewIssueData
  ): Promise<AxiosResponse<TIssue>> {
    return this.API.post(`/projects/${project_id}/issues`, data).then((res) => {
      return res;
    });
  }

  /**
   * Update a project issue.
   */
  public update(
    project_id: number,
    issue_iid: number,
    data: UpdateIssueData
  ): Promise<AxiosResponse<TIssue>> {
    return this.API.put(`/projects/${project_id}/issues/${issue_iid}`, data);
  }

  /**
   * Delete a project issue.
   */
  public delete(
    project_id: number,
    issue_iid: number
  ): Promise<AxiosResponse<any>> {
    return this.API.delete(`/projects/${project_id}/issues/${issue_iid}`);
  }
}

export default new IssuesAPI(api);
