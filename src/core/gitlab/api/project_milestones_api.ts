import { AxiosInstance, AxiosResponse } from "axios";
import { api } from "../../oauth";
import { APIQueryParams, API_ITEMS_PER_PAGE, ResponseWithPage } from "../api";
import { CrudAPI } from "../types";
import {
  AddMilestoneData,
  QueryMilestones,
  TMilestone,
  UpdateMilestoneData,
} from "../types/milestones_types";
import { getNextPage } from "../utils";

export class ProjectMilestonesAPI
  implements
    CrudAPI<
      TMilestone,
      QueryMilestones & APIQueryParams,
      AddMilestoneData,
      UpdateMilestoneData
    > {
  API: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.API = api;
  }

  // Returns a list of project milestones.
  list(
    project_id: number,
    params: QueryMilestones & APIQueryParams
  ): Promise<AxiosResponse<ResponseWithPage<TMilestone[]>>> {
    return this.API.get(`/projects/${project_id}/milestones`, {
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

  // Creates a new project milestone.
  add(
    project_id: number,
    data: AddMilestoneData
  ): Promise<AxiosResponse<TMilestone>> {
    return this.API.post(`/projects/${project_id}/milestones`, data);
  }

  // Updates an existing project milestone.
  update(
    project_id: number,
    identifier: string | number,
    data: UpdateMilestoneData
  ): Promise<AxiosResponse<TMilestone>> {
    return this.API.put(
      `/projects/${project_id}/milestones/${identifier}`,
      data
    );
  }

  // Only for users with Developer access to the project.
  delete(
    project_id: number,
    identifier: string | number
  ): Promise<AxiosResponse<any>> {
    return this.API.delete(`/projects/${project_id}/milestones/${identifier}`);
  }
}

export default new ProjectMilestonesAPI(api);
