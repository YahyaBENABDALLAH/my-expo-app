import { whatsappTheme } from './whatsapp';
import { facebookTheme } from './facebook';
import { instagramTheme } from './instagram';
import { tiktokTheme } from './tiktok';
import { uxTheme } from './ux';

export const themes = {
  whatsapp: { label: 'WhatsApp', colors: whatsappTheme },
  facebook: { label: 'Facebook', colors: facebookTheme },
  instagram: { label: 'Instagram', colors: instagramTheme },
  tiktok: { label: 'TikTok', colors: tiktokTheme },
  ux: { label: 'UX Template', colors: uxTheme },
};

export type ThemeId = keyof typeof themes;
export const themeIds = Object.keys(themes) as ThemeId[];
