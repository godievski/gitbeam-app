export type ThemeColors = {
  topbar_bg: string;
  button_bg_color: string;
  button_text_color: string;
  // items
  divider_color: string;
  input_border_color: string;
  border_item_selected: string;
  // list item
  item_bg_1: string;
  item_bg_2: string;
  item_selected: string;
  underlay_item: string;
  color_chevron_item: string;
  // general
  bg_color: string;
  bg_sec_color: string;
  bg_tertary_color: string;
  text_primary: string;
  text_secondary: string;
  text_tertiary: string;
  foot_note: string;
  // drawer
  drawer_bg: string;
  drawer_active_text: string;
  drawer_inactive_text: string;
  drawer_overlay: string;
  drawer_active_bg: string;
  drawer_separator: string;
  drawer_button_bg: string;
  drawer_button_txt: string;
  //
  radio_btn: string;
  //
  placeholder: string;
  // action sheet
  actionsheet_bg: string;
  // searchbar
  searchbar_bg: string;
};
export enum TypeView {
  list = "list",
  square = "square",
}

export type ThemeState = {
  isDark: boolean;
  useDeviceMode: boolean;
  projectView: TypeView;
  sourceView: TypeView;
  colors: ThemeColors;
};
