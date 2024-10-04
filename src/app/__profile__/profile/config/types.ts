import { TUser } from "../../../../core/gitlab/types/users_types";

export type UserState = {
  loading: boolean;
  data: TUser;
};
