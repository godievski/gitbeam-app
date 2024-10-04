import { TUser } from "../../../../core/gitlab/types/users_types";
import { UserState } from "./types";

export const DEFAULT_USER_STATE: UserState = {
  loading: false,
  data: {} as TUser,
};
