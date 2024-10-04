import { AxiosInstance, AxiosResponse } from "axios";
import { api } from "../../oauth";
import { APIQueryParams, API_ITEMS_PER_PAGE, ResponseWithPage } from "../api";
import { CrudAPI } from "../types";
import {
  NewLabelData,
  QueryLabels,
  TLabel,
  UpdateLabelData,
} from "../types/labels_types";
import { getNextPage } from "../utils";

export class ProjectLabelsAPI
  implements
    CrudAPI<
      TLabel,
      QueryLabels & APIQueryParams,
      NewLabelData,
      UpdateLabelData
    > {
  private API: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.API = api;
  }

  // Get all labels for a given project.
  list(
    project_id: number,
    params: QueryLabels & APIQueryParams
  ): Promise<AxiosResponse<ResponseWithPage<TLabel[]>>> {
    return this.API.get(`/projects/${project_id}/labels`, {
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

  //Creates a new label for the given repository
  // with the given name and color.
  add(project_id: number, data: NewLabelData): Promise<AxiosResponse<TLabel>> {
    return this.API.post(`/projects/${project_id}/labels`, data);
  }

  // Updates an existing label with new name or new color.
  // At least one parameter is required, to update the label.
  update(
    project_id: number,
    identifier: string | number,
    data: UpdateLabelData
  ): Promise<AxiosResponse<TLabel>> {
    return this.API.put(`/projects/${project_id}/labels/${identifier}`, data);
  }

  delete(
    project_id: number,
    identifier: string | number
  ): Promise<AxiosResponse<any>> {
    return this.API.delete(`/projects/${project_id}/labels/${identifier}`);
  }

  subscribe(
    project_id: number,
    label_id: number
  ): Promise<AxiosResponse<TLabel>> {
    return this.API.post(
      `/projects/${project_id}/labels/${label_id}/subscribe`
    );
  }

  unsubscribe(
    project_id: number,
    label_id: number
  ): Promise<AxiosResponse<TLabel>> {
    return this.API.post(
      `/projects/${project_id}/labels/${label_id}/unsubscribe`
    );
  }
}

export default new ProjectLabelsAPI(api);
