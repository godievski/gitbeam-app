export enum CredentialStatus {
  success = "success",
  empty = "empty",
  authenticating = "authenticating",
  error = "error",
  validating = "validating",
}

export type CredentialState = {
  status: CredentialStatus;
  error?: {
    code: number;
    message: string;
    domain: string;
    userInfo: any;
    nativeStackIOS: any;
  };
};
