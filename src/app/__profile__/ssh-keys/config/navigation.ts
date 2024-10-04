import { CommonActions } from "@react-navigation/native";
import { TSShKey } from "../../../../core/gitlab/types/users_types";

export const SINGLE_SSH_KEY_SCREEN_NAME = "SINGLE_SSH_KEY_SCREEN_NAME";

export type SingleSshKeyParams = {
  [SINGLE_SSH_KEY_SCREEN_NAME]: {
    ssh_key: TSShKey;
  };
};

export const goToSingleSShKey = ({ ssh_key }: { ssh_key: TSShKey }) =>
  CommonActions.navigate({
    name: SINGLE_SSH_KEY_SCREEN_NAME,
    params: {
      ssh_key,
    },
    key: "single-ssh-key",
  });

export const SSH_KEYS_SCREEN_NAME = "SSH_KEYS_SCREEN_NAME";

export type SshKeysParams = {
  [SSH_KEYS_SCREEN_NAME]: {};
};

export const goToSshKeys = () =>
  CommonActions.navigate({
    name: SSH_KEYS_SCREEN_NAME,
    key: "ssh-keys-stack",
  });
