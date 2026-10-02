/* ── Base Palette ── */

export const PALETTE = {
  blue: {
    50: "#e7f1fe",
    100: "#cee4fd",
    200: "#98c6fb",
    300: "#67abf9",
    400: "#318df6",
    500: "#0070f0",
    600: "#005ac2",
    700: "#004594",
    800: "#002d61",
    900: "#001833",
  },
  green: {
    50: "#eafaf1",
    100: "#d2f4e1",
    200: "#a0e9c0",
    300: "#72dfa1",
    400: "#45d383",
    500: "#18c964",
    600: "#12a150",
    700: "#0e773b",
    800: "#094e27",
    900: "#052915",
  },
  red: {
    50: "#fee7ef",
    100: "#fdcede",
    200: "#fa9ebe",
    300: "#f872a1",
    400: "#f54281",
    500: "#f31260",
    600: "#c40e4d",
    700: "#930b3b",
    800: "#5f0726",
    900: "#2f0412",
  },
  yellow: {
    50: "#fefce7",
    100: "#fdedd3",
    200: "#fbdba7",
    300: "#f9c97b",
    400: "#f7b750",
    500: "#f5a524",
    600: "#c3841d",
    700: "#926316",
    800: "#62420e",
    900: "#312107",
  },
  purple: {
    50: "#f2eafa",
    100: "#e3d2f3",
    200: "#c9aae9",
    300: "#ad7dde",
    400: "#9455d3",
    500: "#7828c8",
    600: "#6120a2",
    700: "#471877",
    800: "#301051",
    900: "#170826",
  },
  pink: {
    50: "#ffebf9",
    100: "#ffdbf5",
    200: "#ffb8eb",
    300: "#ff94e1",
    400: "#ff70d7",
    500: "#ff4dcc",
    600: "#cc3ea3",
    700: "#982f7a",
    800: "#651f52",
    900: "#321029",
  },
  cyan: {
    50: "#f0fcff",
    100: "#e7fafe",
    200: "#d7f8fe",
    300: "#c4f5fd",
    400: "#a5eefd",
    500: "#7ee7fc",
    600: "#06b7db",
    700: "#09aace",
    800: "#0e8baa",
    900: "#053a48",
  },
  zinc: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
  },
} as const;

/* ── Semantic Color Tokens ── */

export interface ColorTokens {
  readonly background: string;
  readonly foreground: string;
  readonly overlay: string;
  readonly divider: string;
  readonly focus: string;
  readonly card: string;
  readonly cardForeground: string;
  readonly content2: string;
  readonly content2Foreground: string;
  readonly content3: string;
  readonly content3Foreground: string;
  readonly content4: string;
  readonly content4Foreground: string;
  readonly popover: string;
  readonly popoverForeground: string;
  readonly primary: string;
  readonly primaryForeground: string;
  readonly secondary: string;
  readonly secondaryForeground: string;
  readonly success: string;
  readonly successForeground: string;
  readonly warning: string;
  readonly warningForeground: string;
  readonly destructive: string;
  readonly destructiveForeground: string;
  readonly info: string;
  readonly infoForeground: string;
  readonly default: string;
  readonly defaultForeground: string;
  readonly disabled: string;
  readonly disabledForeground: string;
  readonly muted: string;
  readonly mutedForeground: string;
  readonly accent: string;
  readonly accentForeground: string;
  readonly input: string;
  readonly border: string;
  readonly ring: string;
  readonly tabBarBackground: string;
}

export const LIGHT_COLORS: ColorTokens = {
  background: "#ffffff",
  foreground: "#11181c",
  overlay: "#0000004d",
  divider: "#12121226",
  focus: PALETTE.blue[500],
  card: "#ffffff",
  cardForeground: "#11181c",
  content2: PALETTE.zinc[100],
  content2Foreground: PALETTE.zinc[800],
  content3: PALETTE.zinc[300],
  content3Foreground: PALETTE.zinc[700],
  content4: PALETTE.zinc[300],
  content4Foreground: PALETTE.zinc[600],
  popover: "#ffffff",
  popoverForeground: "#11181c",
  primary: PALETTE.blue[500],
  primaryForeground: "#ffffff",
  secondary: PALETTE.purple[500],
  secondaryForeground: "#ffffff",
  success: PALETTE.green[500],
  successForeground: "#000000",
  warning: PALETTE.yellow[500],
  warningForeground: "#000000",
  destructive: PALETTE.red[500],
  destructiveForeground: "#ffffff",
  info: PALETTE.cyan[600],
  infoForeground: "#ffffff",
  default: PALETTE.zinc[300],
  defaultForeground: "#000000",
  disabled: PALETTE.zinc[400],
  disabledForeground: PALETTE.zinc[700],
  muted: PALETTE.zinc[100],
  mutedForeground: PALETTE.zinc[500],
  accent: PALETTE.zinc[200],
  accentForeground: "#11181c",
  input: PALETTE.zinc[200],
  border: "#12121226",
  ring: PALETTE.blue[500],
  tabBarBackground: "#ffffff",
};

export const DARK_COLORS: ColorTokens = {
  background: "#000000",
  foreground: "#ecedee",
  overlay: "#0000004d",
  divider: "#ffffff26",
  focus: PALETTE.blue[500],
  card: PALETTE.zinc[900],
  cardForeground: PALETTE.zinc[50],
  content2: PALETTE.zinc[800],
  content2Foreground: PALETTE.zinc[100],
  content3: PALETTE.zinc[700],
  content3Foreground: PALETTE.zinc[200],
  content4: PALETTE.zinc[600],
  content4Foreground: PALETTE.zinc[300],
  popover: PALETTE.zinc[900],
  popoverForeground: PALETTE.zinc[50],
  primary: PALETTE.blue[200],
  primaryForeground: "#ffffff",
  secondary: PALETTE.purple[400],
  secondaryForeground: "#ffffff",
  success: PALETTE.green[500],
  successForeground: "#000000",
  warning: PALETTE.yellow[500],
  warningForeground: "#000000",
  destructive: PALETTE.red[500],
  destructiveForeground: "#ffffff",
  info: PALETTE.cyan[600],
  infoForeground: "#ffffff",
  default: PALETTE.zinc[700],
  defaultForeground: "#ffffff",
  disabled: PALETTE.zinc[900],
  disabledForeground: PALETTE.zinc[500],
  muted: PALETTE.zinc[800],
  mutedForeground: PALETTE.zinc[400],
  accent: PALETTE.zinc[700],
  accentForeground: PALETTE.zinc[50],
  input: PALETTE.zinc[800],
  border: "#ffffff26",
  ring: PALETTE.blue[500],
  tabBarBackground: PALETTE.zinc[900],
};
