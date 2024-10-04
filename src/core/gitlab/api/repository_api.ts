import { AxiosInstance, AxiosResponse } from "axios";
import { api } from "../../oauth";
import { API_ITEMS_PER_PAGE, ResponseWithPage } from "../api";
import { QueryRepository, TRepoNode } from "../types/repository_types";
import { getNextPage } from "../utils";

export class RepositoryAPI {
  API: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.API = api;
  }

  // Get a list of repository files and directories in a project.
  // This endpoint can be accessed without authentication if the repository is publicly accessible.
  public listTree(
    project_id: number,
    params: QueryRepository
  ): Promise<AxiosResponse<ResponseWithPage<TRepoNode[]>>> {
    return this.API.get(`/projects/${project_id}/repository/tree`, {
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
}

export default new RepositoryAPI(api);
