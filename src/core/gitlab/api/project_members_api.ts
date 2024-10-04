import { AxiosInstance, AxiosResponse } from "axios";
import { api } from "../../oauth";
import { APIQueryParams, API_ITEMS_PER_PAGE, ResponseWithPage } from "../api";
import { CrudAPI } from "../types";
import {
  AddMemberData,
  QueryMembers,
  TMember,
  UpdateMemberData,
} from "../types/members_types";

import { getNextPage } from "../utils";

class ProjectMembersApi
  implements
    CrudAPI<
      TMember,
      QueryMembers & APIQueryParams,
      AddMemberData,
      UpdateMemberData
    > {
  private API: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.API = api;
  }

  /**
   * Gets a list of group or project members viewable by the authenticated user.
   * Returns only direct members and not inherited members through ancestors groups.
   */
  list(
    project_id: number,
    params: QueryMembers & APIQueryParams
  ): Promise<AxiosResponse<ResponseWithPage<TMember[]>>> {
    return this.API.get(`/projects/${project_id}/members`, {
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

  // Adds a member to a project
  add(
    project_id: number,
    data: AddMemberData
  ): Promise<AxiosResponse<TMember>> {
    return this.API.post(`/projects/${project_id}/members`, data);
  }

  // Updates a member of a project.
  update(
    project_id: number,
    identifier: string | number,
    data: UpdateMemberData
  ): Promise<AxiosResponse<TMember>> {
    return this.API.put(`/projects/${project_id}/members/${identifier}`, data);
  }

  /**
   * Removes a user from a project.
   */
  delete(
    project_id: number,
    identifier: string | number
  ): Promise<AxiosResponse<any>> {
    return this.API.delete(`/projects/${project_id}/members/${identifier}`);
  }
}

export default new ProjectMembersApi(api);
