import { iOSColors } from "react-native-typography";
import { ThemeColors } from "../../theme/types";

const PRIMARY = "#3F4164";
/**
 * General
 */
export const TOPBAR_BG = "#292A48";
export const BUTTON_BG_COLOR = "#292A48";
export const BUTTON_TEXT_COLOR = "#FFFFFF";
/**
 * Borders
 */
export const DIVIDER_COLOR = "#b2b2b5";
export const INPUT_BORDER_COLOR = "#CACACE";
export const BORDER_ITEM_SELECTED = PRIMARY;
/**
 * List Items Files
 */
export const ITEM_BG_1 = "#F4F5F5";
export const ITEM_BG_2 = "#FFFFFF";
export const ITEM_SELECTED = "#C9CBD3";
export const UNDERLAY_ITEM = PRIMARY;
export const COLOR_CHEVRON_ITEM = "#c8c7cc";
/**
 * Container
 */
export const BG_COLOR = "#F2F0F6";
export const BG_SEC_COLOR = "#F2F2F2";
export const BG_TERTARY = "#FFFFFF";
export const TEXT_PRIMARY = "#000000";
export const TEXT_SECONDARY = "rgba(60,60,67,0.60)";
export const TEXT_TERTIARY = "rgba(60,60,67,0.30)";
export const FOOT_NOTE = "#8A8A8F";
/**
 * Drawer
 */
export const DRAWER_BG = "#FFFFFF";
export const DRAWER_ACTIVE_TXT = "#000000";
export const DRAWER_INACTIVE_TEXT = "#666666";
export const DRAWER_OVERLAY = "#ADB2C3";
export const DRAWER_ACTIVE_BG = "#C9CBD3";
export const DRAWER_SEPARATOR = "#bcbbc1";
export const DRAWER_BUTTON_BG = iOSColors.blue;
export const DRAWER_BUTTON_TEXT = "#fff";

/**
 * ActionSheet
 */
export const ACTIONSHEET_BG = BG_COLOR;

/**
 * SearchBar
 */
export const SEARCHBAR_BG = "rgba(118,118,118, 0.24)";

export const RADIO_BTN = "#292A48";

export const PLACEHOLDER = "#3c3c432e";

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
  ///////
  radio_btn: RADIO_BTN,
  ///////
  placeholder: PLACEHOLDER,
  ///////
  actionsheet_bg: ACTIONSHEET_BG,
  //////
  searchbar_bg: SEARCHBAR_BG,
};

export default colors;
