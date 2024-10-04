import { AxiosInstance, AxiosResponse } from "axios";
import { api } from "../../oauth";
import { APIQueryParams, API_ITEMS_PER_PAGE, ResponseWithPage } from "../api";
import { CrudAPI } from "../types";

import {
  TMergeRequest,
  QueryMergeRequest,
  NewMergeRequestData,
  UpdateMRData,
  AcceptMRData,
} from "../types/merge_requests_types";
import { getNextPage } from "../utils";

class MergeRequestsAPI
  implements
    CrudAPI<TMergeRequest, APIListMRParams, NewMergeRequestData, UpdateMRData> {
  private API: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.API = api;
  }

  public list(
    project_id: number,
    params: APIListMRParams
  ): Promise<AxiosResponse<ResponseWithPage<TMergeRequest[]>>> {
    return this.API.get(`/projects/${project_id}/merge_requests`, {
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

  public add(
    project_id: number,
    data: NewMergeRequestData
  ): Promise<AxiosResponse<TMergeRequest>> {
    return this.API.post(`/projects/${project_id}/merge_requests`, data).then(
      (res) => res
    );
  }

  public update(
    project_id: number,
    mr_iid: number,
    data: UpdateMRData
  ): Promise<AxiosResponse<TMergeRequest>> {
    return this.API.put(
      `/projects/${project_id}/merge_requests/${mr_iid}`,
      data
    ).then((res) => {
      return res;
    });
  }

  public delete(
    project_id: number,
    mr_iid: number
  ): Promise<AxiosResponse<any>> {
    return this.API.delete(
      `/projects/${project_id}/merge_requests/${mr_iid}`
    ).then((res) => {
      return res;
    });
  }

  public acceptMergeRequest(
    project_id: number,
    mr_iid: number,
    data: AcceptMRData
  ): Promise<AxiosResponse<TMergeRequest>> {
    return this.API.put(
      `/projects/${project_id}/merge_requests/${mr_iid}/merge`,
      data
    ).then((res) => {
      return res;
    });
  }
}

export type APIListMRParams = QueryMergeRequest & APIQueryParams;

export default new MergeRequestsAPI(api);
