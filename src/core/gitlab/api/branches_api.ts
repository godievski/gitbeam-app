import { AxiosInstance, AxiosResponse } from "axios";
import { api } from "../../oauth";
import { APIQueryParams, API_ITEMS_PER_PAGE, ResponseWithPage } from "../api";
import { CrudAPI } from "../types";
import { NewBranchData, QueryBranches, TBranch } from "../types/branches_types";
import { getNextPage } from "../utils";

class BranchesAPI
  implements
    CrudAPI<TBranch, QueryBranches & APIQueryParams, NewBranchData, any> {
  private API: AxiosInstance;
  constructor(api: AxiosInstance) {
    this.API = api;
  }

  public list(
    project_id: number,
    params: QueryBranches & APIQueryParams
  ): Promise<AxiosResponse<ResponseWithPage<TBranch[]>>> {
    return this.API.get(`/projects/${project_id}/repository/branches`, {
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

  add(
    project_id: number,
    data: NewBranchData
  ): Promise<AxiosResponse<TBranch>> {
    return this.API.post(`/projects/${project_id}/repository/branches`, data);
  }

  //Doesn't exists
  update(
    project_id: number,
    entity_iid: number,
    data: any
  ): Promise<AxiosResponse<TBranch>> {
    return null as any;
  }

  delete(project_id: number, branch: string): Promise<AxiosResponse<any>> {
    const branch_name = encodeURIComponent(branch);
    return this.API.delete(
      `/projects/${project_id}/repository/branches/${branch_name}`
    );
  }
}

export default new BranchesAPI(api);
