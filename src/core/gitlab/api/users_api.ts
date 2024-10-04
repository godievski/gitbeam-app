import { AxiosInstance, AxiosResponse } from "axios";
import { api } from "../../oauth";
import { TSShKey, TUser } from "../types/users_types";

export class UsersAPI {
  private API: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.API = api;
  }

  //list current user (for normal user)
  public user(): Promise<AxiosResponse<TUser>> {
    return this.API.get(`/user`);
  }

  //list ssh keys
  public ssh_keys(): Promise<AxiosResponse<TSShKey[]>> {
    return this.API.get(`/user/keys`);
  }
}

export default new UsersAPI(api);
