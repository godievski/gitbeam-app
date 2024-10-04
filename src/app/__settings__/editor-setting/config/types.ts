export type ThemeEditor = {
  id: string;
  name: string;
  backgroundColor: string;
  color: string;
  placeholder: string;
};

export type FontFamilyEditor = {
  id: string;
  value: string;
  name: string;
};

export type EditorConfigState = {
  size: number;
  theme: ThemeEditor;
  fontFamily: FontFamilyEditor;
};
