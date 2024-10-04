import { api } from "../../oauth";
import { AxiosInstance, AxiosResponse } from "axios";
import { TProject, TProjectSimple } from "../types/projects_types";
import { APIQueryParams, API_ITEMS_PER_PAGE, ResponseWithPage } from "../api";
import { encodeURLFromJson } from "../../utils";

export type APIListProjectsParams = {
  membership?: boolean;
  simple?: boolean;
} & APIQueryParams;

export type APIFindProjectParams = {
  statistics?: boolean;
  //TODO: add more
};

export type APINewProjectParams = {
  name: string;
  path: string;
  description: string;
  visibility: string;
  initialize_with_readme: boolean;
};

export class ProjectsAPI {
  private API: AxiosInstance;

  constructor(api_instance: AxiosInstance) {
    this.API = api_instance;
  }

  public listProjects(
    params: APIListProjectsParams = {}
  ): Promise<AxiosResponse<ResponseWithPage<TProjectSimple[]>>> {
    const def_params: APIListProjectsParams = {
      membership: true,
      simple: true,
      page: 1,
      per_page: API_ITEMS_PER_PAGE,
    };

    const _params = { ...def_params, ...params };
    const encoded_params = encodeURLFromJson(_params);
    return this.API.get(`/projects?${encoded_params}`).then((res) => {
      const next_page = res.headers["x-next-page"] ?? "";
      const data: TProjectSimple[] = res.data;
      res.data = {
        data,
        next_page,
      };
      return res;
    });
  }

  public createNewProject(
    data: APINewProjectParams
  ): Promise<AxiosResponse<TProjectSimple>> {
    return this.API.post(`/projects`, data);
  }

  public findProject(
    project_id: number,
    params: APIFindProjectParams
  ): Promise<AxiosResponse<TProject>> {
    return this.API.get(`/projects/${project_id}`, {
      params,
    });
  }
}

export default new ProjectsAPI(api);
