import { ThemeColors } from "../../theme/types";

/**
 * General
 */
export const TOPBAR_BG = "#292A48";
export const BUTTON_BG_COLOR = "#F9F9F9";
export const BUTTON_TEXT_COLOR = "#292A48";
/**
 * Borders
 */
export const DIVIDER_COLOR = "#38383A";
export const INPUT_BORDER_COLOR = "#CACACE";
export const BORDER_ITEM_SELECTED = "#CACACE";
/**
 * List Items Files
 */
export const ITEM_BG_1 = "#1E1D1F";
export const ITEM_BG_2 = "#141315";
export const ITEM_SELECTED = "#4e5260";
export const UNDERLAY_ITEM = "#B9B9C6";
export const COLOR_CHEVRON_ITEM = "#c8c7cc";
/**
 * Container
 */
export const BG_COLOR = "#000000"; //1F1B24 (optional)
export const BG_SEC_COLOR = "#131314"; //1A1B1E (old)
export const BG_TERTARY = "#161617";
export const TEXT_PRIMARY = "#FFFFFF";
export const TEXT_SECONDARY = "rgba(235,235,245,0.60)";
export const TEXT_TERTIARY = "rgba(235,235,245,0.30)";
export const FOOT_NOTE = "#8A8A8F";

/**
 * Drawer
 */
export const DRAWER_BG = "#111216";
export const DRAWER_ACTIVE_TXT = "#F9F9F9";
export const DRAWER_INACTIVE_TEXT = "#98989A";
export const DRAWER_OVERLAY = "#070911";
export const DRAWER_ACTIVE_BG = "#4e5260";
export const DRAWER_SEPARATOR = "#C9C9C9";
export const DRAWER_BUTTON_BG = "#4e5260";
export const DRAWER_BUTTON_TEXT = "#f9f9f9";

/**
 * ActionSheet
 */
export const ACTIONSHEET_BG = "#202021";

/**
 * SearchBar
 */
export const SEARCHBAR_BG = "rgba(118,118,118, 0.24)";

export const PLACEHOLDER = "#ebebf528";

/**
 * Radio Btn
 */
export const RADIO_BTN = "#9598E2";

const colors: ThemeColors = {
  topbar_bg: TOPBAR_BG,
  button_bg_color: BUTTON_BG_COLOR,
  button_text_color: BUTTON_TEXT_COLOR,
  ////
  divider_color: DIVIDER_COLOR,
  input_border_color: INPUT_BORDER_COLOR,
  border_item_selected: BORDER_ITEM_SELECTED,
  /////
  item_bg_1: ITEM_BG_1,
  item_bg_2: ITEM_BG_2,
  item_selected: ITEM_SELECTED,
  underlay_item: UNDERLAY_ITEM,
  color_chevron_item: COLOR_CHEVRON_ITEM,
  //////
  bg_color: BG_COLOR,
  bg_sec_color: BG_SEC_COLOR,
  bg_tertary_color: BG_TERTARY,
  text_primary: TEXT_PRIMARY,
  text_secondary: TEXT_SECONDARY,
  text_tertiary: TEXT_TERTIARY,
  foot_note: FOOT_NOTE,
  //////
  drawer_bg: DRAWER_BG,
  drawer_active_text: DRAWER_ACTIVE_TXT,
  drawer_inactive_text: DRAWER_INACTIVE_TEXT,
  drawer_overlay: DRAWER_OVERLAY,
  drawer_active_bg: DRAWER_ACTIVE_BG,
  drawer_separator: DRAWER_SEPARATOR,
  drawer_button_bg: DRAWER_BUTTON_BG,
  drawer_button_txt: DRAWER_BUTTON_TEXT,
  //////
  radio_btn: RADIO_BTN,
  //////
  placeholder: PLACEHOLDER,
  //////
  actionsheet_bg: ACTIONSHEET_BG,
  //////
  searchbar_bg: SEARCHBAR_BG,
};

export default colors;
