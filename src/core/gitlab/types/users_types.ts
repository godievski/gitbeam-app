export type TUser = {
  id: number;
  username: string;
  email: string;
  name: string;
  state: string;
  avatar_url: string;
  web_url: string;
  created_at: string;
  bio: string | null;
  location: string | null;
  public_email: string;
  skype: string;
  linkedin: string;
  twitter: string;
  website_url: string;
  organization: string;
  last_sign_in_at: string;
  confirmed_at: string;
  theme_id: number;
  last_activity_on: string;
  color_scheme_id: number;
  projects_limit: number;
  current_sign_in_at: string;
  identities: { provider: string; extern_uid: string }[];
  can_create_group: boolean;
  can_create_project: boolean;
  two_factor_enabled: boolean;
  external: boolean;
  private_profile: boolean;
};

export type TSShKey = {
  id: number;
  title: string;
  key: string;
  created_at: string; // "2014-08-01T14:47:39.080Z"
};
