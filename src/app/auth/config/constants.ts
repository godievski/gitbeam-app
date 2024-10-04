import { CredentialState, CredentialStatus } from "./types";

export const DEFAULT_CREDENTIAL_STATE: CredentialState = {
  status: CredentialStatus.authenticating,
};

export const CREDENTIAL_API = "GITLAB_CRED";
