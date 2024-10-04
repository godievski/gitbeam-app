export const getBackgroundColorHljs = (type, style): string => {
  switch (type) {
    case "brownPaper":
      return "#b7a68e";
    case "magula":
      return "#f4f4f4";
    case "pojoaque":
      return "#181914";
    case "schoolBook":
      return "#f6f6ae";
    default:
      return style["hljs"]["background"];
  }
};

export const styles_hljs = [
  "agate",
  "androidstudio",
  "arduinoLight",
  "arta",
  "ascetic",
  "atelierCaveDark",
  "atelierCaveLight",
  "atelierDuneDark",
  "atelierDuneLight",
  "atelierEstuaryDark",
  "atelierEstuaryLight",
  "atelierForestDark",
  "atelierForestLight",
  "atelierHeathDark",
  "atelierHeathLight",
  "atelierLakesideDark",
  "atelierLakesideLight",
  "atelierPlateauDark",
  "atelierPlateauLight",
  "atelierSavannaDark",
  "atelierSavannaLight",
  "atelierSeasideDark",
  "atelierSeasideLight",
  "atelierSulphurpoolDark",
  "atelierSulphurpoolLight",
  "atomOneDark",
  "atomOneLight",
  "brownPaper", //#b7a68e
  "codepenEmbed",
  "colorBrewer",
  "darcula",
  "dark",
  // 'darkula', //not working
  "defaultStyle",
  "docco",
  "dracula",
  "far",
  "foundation",
  "githubGist",
  "github",
  "googlecode",
  "grayscale",
  "gruvboxDark",
  "gruvboxLight",
  "hopscotch",
  "hybrid",
  "idea",
  "irBlack",
  "kimbieDark",
  "kimbieLight",
  "magula", //#f4f4f4
  "monoBlue",
  "monokaiSublime",
  "monokai",
  "obsidian",
  "ocean",
  "paraisoDark",
  "paraisoLight",
  "pojoaque", //#181914
  "purebasic",
  "qtcreatorDark",
  "qtcreatorLight",
  "railscasts",
  "rainbow",
  "routeros",
  // 'schoolBook', //bugged not working
  "solarizedDark",
  "solarizedLight",
  "sunburst",
  "tomorrowNightBlue",
  "tomorrowNightBright",
  "tomorrowNightEighties",
  "tomorrowNight",
  "tomorrow",
  "vs",
  "vs2015",
  "xcode",
  // 'xt256', //not working
  "zenburn",
];

export const styles_prism = [
  "coy",
  "dark",
  "funky",
  "okaidia",
  "solarizedlight",
  "tomorrow",
  "twilight",
  "prism",
  "atomDark",
  "base16AteliersulphurpoolLight",
  "cb",
  "darcula",
  "duotoneDark",
  "duotoneEarth",
  "duotoneForest",
  "duotoneLight",
  "duotoneSea",
  "duotoneSpace",
  "ghcolors",
  "hopscotch",
  "pojoaque",
  "vs",
  "xonokai",
];
