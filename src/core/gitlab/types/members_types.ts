import { MemberAccess } from "../types";

export type TMember = {
  id: number;
  username: string;
  name: string;
  state: string | "active";
  avatar_url: string | null;
  web_url: string;
  access_level: MemberAccess;
  expires_at: string | undefined;
  email?: string;
  group_saml_identity: null | {
    extern_uid: string;
    provider: string;
    saml_provider_id: number;
  };
};

export type QueryMembers = {
  query?: string; //A query string to search for members
  user_ids?: number[]; //Filter the results on the given user IDs
};

export type AddMemberData = {
  user_id: number | string;
  access_level: MemberAccess;
  expires_at?: string | null;
};

export type UpdateMemberData = {
  user_id: number;
  access_level: MemberAccess;
  expires_at?: string | null;
};
