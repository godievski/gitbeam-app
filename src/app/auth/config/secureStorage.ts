import { AuthorizeResult } from "react-native-app-auth";
import * as Keychain from "react-native-keychain";

export type CredentialResult = {
  status: "success";
  credential: AuthorizeResult;
} & { status: "empty" } & { status: "error"; error: any };

export class SecureStorage {
  public async getCredential(): Promise<false | AuthorizeResult> {
    const cred = await Keychain.getGenericPassword({
      accessControl:
        Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
      accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
    });
    if (cred === false) {
      return false;
    }
    return JSON.parse(cred.password);
  }

  public saveCredential(cred: AuthorizeResult) {
    return Keychain.setGenericPassword("gitbeam", JSON.stringify(cred), {
      accessControl:
        Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
      accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
    });
  }

  public removeCredential() {
    return Keychain.resetGenericPassword();
  }
}

export default new SecureStorage();
