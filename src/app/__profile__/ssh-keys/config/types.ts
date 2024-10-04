import { TSShKey } from "../../../../core/gitlab/types/users_types";

export type SshKeysState = {
  loading: boolean;
  creating: boolean;
  deleting: boolean;
  entities: TSShKey[];
};
