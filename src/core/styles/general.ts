
import { iOSColors } from 'react-native-typography';
import { GREEN_COLOR } from './colors';
export const GENERAL_BORDER = 16;

export const GENERAL_CONTAINER_PADDING_HORIZONTAL = 18;
export const GENERAL_CONTAINER_PADDING_VERTICAL = 9;

export const GENERAL_ICON_SIZE = 16;
export const GENERAL_ICON_HEADER_SIZE = 22;

export const GENERAL_TITLE_SIZE = 24;
export const GENERAL_TEXT_SIZE = 14;
export const GENERAL_SUBTITLE_SIZE = 13;



type BadgeStyle = {
  color: string;
  text: string;
}

const BADGE_STYLES_ACTIONS : {[action: string]: BadgeStyle} = {
  create: {
    color: GREEN_COLOR,
    text: "N"
  },
  update: {
    color: iOSColors.blue,
    text: "M"
  },
  delete: {
    color: iOSColors.red,
    text:"D"
  }
}

export const getBadgeFromAction = (action: string) : BadgeStyle | undefined => {
  return BADGE_STYLES_ACTIONS[action];
};