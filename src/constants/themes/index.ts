import { instagramTheme } from './instagram';
import { uxTheme } from './ux';

export const themes = {
  ux: { label: 'UX Template', colors: uxTheme },
  instagram: { label: 'Instagram', colors: instagramTheme },
};

export type ThemeId = keyof typeof themes;
export const themeIds = Object.keys(themes) as ThemeId[];
