import { KeyboardConfigState, KeyHelper } from "./types";

const keys: KeyHelper[] = [
  { id: "tab", label: "tab", value: "  ", action: "insertText" },
  { id: ";", label: ";", value: ";", action: "insertText" },
  { id: "{", label: "{", value: "{\n", action: "insertText" },
  { id: "}", label: "}", value: "}\n", action: "insertText" },
  { id: "(", label: "(", value: "(", action: "insertText" },
  { id: ")", label: ")", value: ")", action: "insertText" },
  { id: "<", label: "<", value: "<", action: "insertText" },
  { id: ">", label: ">", value: ">", action: "insertText" },
  { id: "!", label: "!", value: "!", action: "insertText" },
  { id: "//", label: "//", value: "//", action: "insertText" },
  { id: "#", label: "#", value: "#", action: "insertText" },
  // { id: 'sol', label: 'sol', value: 'sol', action: 'moveCursorToStartOfLine'},
  // { id: 'eol', label: 'eol', value: 'end', action: 'moveCursorToEndOfLine'},
  {
    id: "del-line",
    label: "del-line",
    value: "del-line",
    action: "deleteLine",
  },
  // { id: 'left', label: 'left', value: 'left', action: 'moveCursorLeft' },
  // { id: 'right', label: 'right', value: 'right', action: 'moveCursorRight' }
];

export const DEAFULT_KEYBOARD_CONFIG_STATE: KeyboardConfigState = {
  included: keys,
  more: [],
  disabled: false,
};
