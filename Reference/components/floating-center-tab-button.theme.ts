export interface FloatingButtonPalette {
  base: string[];
  wave1: string[];
  wave2: string[];
}

interface HueSaturation {
  h: string;
  s: string;
}

const PALETTES = {
  creating: {
    dark: { base: ["#3D2800", "#1F1400"], wave1: ["#FF8F00", "#FFB300"], wave2: ["#FFA000", "#FFD54F"] },
    light: { base: ["#FFF3E0", "#FFE0B2"], wave1: ["#FF9800", "#FFB74D"], wave2: ["#FFA726", "#FFD54F"] },
  },
  filter: {
    dark: { base: ["#3E1212", "#240A0A"], wave1: ["#5C1A1A", "#8F2C2C"], wave2: ["#B83C3C", "#FF6B6B"] },
    light: { base: ["#FFEBEE", "#FFCDD2"], wave1: ["#EF9A9A", "#E57373"], wave2: ["#EF5350", "#E53935"] },
  },
  liked: {
    dark: { base: ["#3D1225", "#210A14"], wave1: ["#5C1A38", "#8F2C59"], wave2: ["#B83C72", "#FF6B9E"] },
    light: { base: ["#FCE4EC", "#F8BBD0"], wave1: ["#F48FB1", "#F06292"], wave2: ["#EC407A", "#D81B60"] },
  },
  profile: {
    dark: { base: ["#0B2E1D", "#04140D"], wave1: ["#0D5C34", "#117543"], wave2: ["#1B9C5A", "#2ECC71"] },
    light: { base: ["#E8F5E9", "#C8E6C9"], wave1: ["#0D5C34", "#117543"], wave2: ["#1B9C5A", "#2ECC71"] },
  },
  search: {
    dark: { base: ["#2C2C2C", "#1A1A1A"], wave1: ["#3D3D3D", "#4A4A4A"], wave2: ["#5C5C5C", "#7A7A7A"] },
    light: { base: ["#F5F5F5", "#E0E0E0"], wave1: ["#D6D6D6", "#CCCCCC"], wave2: ["#B8B8B8", "#9E9E9E"] },
  },
} satisfies Record<string, Record<"dark" | "light", FloatingButtonPalette>>;

function rgbToHsl(r: number, g: number, b: number): HueSaturation {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const delta = max - min;
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === r) h = (g - b) / delta + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h /= 6;
  }

  return { h: String(Math.round(h * 360)), s: `${Math.round(s * 100)}%` };
}

export function getPrimaryHueSaturation(value: string): HueSaturation {
  const color = value.trim();
  const hslParts = color.split(/\s+/);
  if (hslParts.length === 3 && !color.includes("(")) {
    return { h: hslParts[0], s: hslParts[1].endsWith("%") ? hslParts[1] : `${hslParts[1]}%` };
  }

  const hslMatch = color.match(/hsla?\((\d+),\s*([\d.]+)%?/);
  if (hslMatch) return { h: hslMatch[1], s: `${hslMatch[2]}%` };

  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return rgbToHsl(
      Number.parseInt(rgbMatch[1], 10) / 255,
      Number.parseInt(rgbMatch[2], 10) / 255,
      Number.parseInt(rgbMatch[3], 10) / 255,
    );
  }

  if (color.startsWith("#")) {
    const hex = color.slice(1);
    const expanded = hex.length === 3 ? hex.split("").map((part) => part + part).join("") : hex;
    if (expanded.length >= 6) {
      return rgbToHsl(
        Number.parseInt(expanded.slice(0, 2), 16) / 255,
        Number.parseInt(expanded.slice(2, 4), 16) / 255,
        Number.parseInt(expanded.slice(4, 6), 16) / 255,
      );
    }
  }

  return { h: "146", s: "79%" };
}

export function getFloatingButtonPalette({
  hue,
  isActive,
  isDark,
  isFilterActive,
  isMore,
  isRecipes,
  isSearch,
}: {
  hue: HueSaturation;
  isActive: boolean;
  isDark: boolean;
  isFilterActive: boolean;
  isMore: boolean;
  isRecipes: boolean;
  isSearch: boolean;
}): FloatingButtonPalette {
  const mode = isDark ? "dark" : "light";
  if (isSearch) return PALETTES[isFilterActive ? "filter" : "search"][mode];
  if (isMore) return PALETTES.profile[mode];
  if (isRecipes) return PALETTES.liked[mode];
  if (isActive) return PALETTES.creating[mode];

  const { h, s } = hue;
  return isDark
    ? {
        base: [`hsl(${h}, ${s}, 17%)`, `hsl(${h}, ${s}, 9%)`],
        wave1: [`hsl(${h}, ${s}, 26%)`, `hsl(${h}, ${s}, 35%)`],
        wave2: [`hsl(${h}, ${s}, 55%)`, `hsl(${h}, ${s}, 66%)`],
      }
    : {
        base: [`hsl(${h}, ${s}, 95%)`, `hsl(${h}, ${s}, 89%)`],
        wave1: [`hsl(${h}, ${s}, 77%)`, `hsl(${h}, ${s}, 66%)`],
        wave2: [`hsl(${h}, ${s}, 55%)`, `hsl(${h}, ${s}, 44%)`],
      };
}
