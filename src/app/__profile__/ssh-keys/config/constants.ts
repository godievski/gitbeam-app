import { SshKeysState } from "./types";

export const DEFAULT_SSH_KEYS_STATE: SshKeysState = {
  loading: false,
  creating: false,
  deleting: false,
  entities: [],
};
