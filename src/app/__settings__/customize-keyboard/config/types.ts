export type KeyHelper = {
  id: string;
  label: string;
  value: string;
  action: string;
};
export type KeyboardConfigState = {
  included: KeyHelper[];
  more: KeyHelper[];
  disabled: boolean;
};
