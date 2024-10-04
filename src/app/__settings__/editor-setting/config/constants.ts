import { EditorConfigState, FontFamilyEditor, ThemeEditor } from "./types";

type Config = {
  size: number[];
  theme: ThemeEditor[];
  fontFamliy: FontFamilyEditor[];
};

const config: Config = {
  size: [10, 12, 14, 16, 18],
  theme: [
    {
      id: "basic",
      name: "Basic",
      backgroundColor: "#fff",
      color: "#000",
      placeholder: "rgba(0,0,0,0.5)",
    },
    {
      id: "material-dark",
      name: "Dark Material",
      backgroundColor: "#263238",
      color: "#CDD3DE",
      placeholder: "rgba(205,211,222, 0.5)",
    },
    {
      id: "Tech49",
      name: "Tech49",
      backgroundColor: "#000000",
      color: "#accecb",
      placeholder: "rgba(172,206,203, 0.5)",
    },
    {
      id: "cobalt",
      name: "Cobalt",
      backgroundColor: "#1e4058",
      color: "#ffffff",
      placeholder: "rgba(255,255,255, 0.5)",
    },
    {
      id: "dracula",
      name: "Dracula",
      backgroundColor: "#282a36",
      color: "#f8f8f2",
      placeholder: "rgba(248,248,242, 0.5)",
    },
    {
      id: "Solarized-light",
      name: "Solarized Light",
      backgroundColor: "#FDF6E3",
      color: "#657A81",
      placeholder: "rgba(101,122,129, 0.5)",
    },
    {
      id: "Solarized Dark",
      name: "Solarized Dark",
      backgroundColor: "#1b2b34",
      color: "#cdd3de",
      placeholder: "rgba(205,211,222, 0.5)",
    },
    {
      id: "RecognEyes",
      name: "RecognEyes",
      backgroundColor: "#101020",
      color: "#D0D0D0",
      placeholder: "rgba(208,208,208, 0.5)",
    },
    {
      id: "relax-your-eyes-green",
      name: "Relax Your Eyes Green",
      backgroundColor: "#cae6ca",
      color: "#000000",
      placeholder: "rgba(0,0,0,0.5)",
    },
    {
      id: "bluish",
      name: "Bluish",
      backgroundColor: "#132443",
      color: "#ffffff",
      placeholder: "rgba(255,255,255, 0.5)",
    },
    {
      id: "greenish",
      name: "Greenish",
      backgroundColor: "#2a2a2a",
      color: "#969696",
      placeholder: "rgba(150,150,150, 0.5)",
    },
  ],
  fontFamliy: [
    {
      id: "PT-Mono",
      value: "PT Mono",
      name: "PT Mono",
    },
    {
      id: "DejaVu-Sans-Mono",
      value: "DejaVu Sans Mono",
      name: "DejaVu Sans Mono",
    },
    {
      id: "Andale-Mono",
      value: "Andale Mono",
      name: "Andale Mono",
    },
    {
      id: "SourceCodePro-Regular",
      value: "Source Code Pro",
      name: "Source Code Pro Regular",
    },
    {
      id: "Ubuntu-Mono-derivative-Powerline",
      value: "Ubuntu Mono derivative Powerline",
      name: "Ubuntu Mono derivative Powerline",
    },
    {
      id: "system-font-default",
      value: "system font",
      name: "System Font Default",
    },
  ],
};

export const sizeOptions = config.size;

export const themeOptions = config.theme;

export const fontFamliyOptions = config.fontFamliy;

export const DEFAULT_EDITOR_SETTINGS_STATE: EditorConfigState = {
  size: sizeOptions[2],
  theme: themeOptions[0],
  fontFamily: fontFamliyOptions[0],
};
