import Constants from 'expo-constants';
import { z } from 'zod';
import assets from '../../config/brand-assets.json';
import { themes, type ThemeId } from '@/constants/themes/index';
import { isHeaderStyle, type PageHeaderStyle } from '@/constants/header-motion';

export type HeadingFontId = keyof typeof assets.headingFonts;
export type LaunchArtworkId = keyof typeof assets.launchArtworks;

const publicBrandSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  variant: z.enum(['development', 'preview', 'production']),
  presentation: z.object({
    header: z.custom<PageHeaderStyle>(isHeaderStyle),
    launch: z.enum(['minimal', 'branded']),
    palette: z.custom<ThemeId>(
      (value) => typeof value === 'string' && Object.hasOwn(themes, value),
    ),
    headingFont: z.custom<HeadingFontId>(
      (value) => typeof value === 'string' && Object.hasOwn(assets.headingFonts, value),
    ),
    launchArtwork: z.custom<LaunchArtworkId>(
      (value) => typeof value === 'string' && Object.hasOwn(assets.launchArtworks, value),
    ),
  }),
});

export type AppBrand = z.infer<typeof publicBrandSchema>;

/** Only the selected public metadata reaches native consumers, never Node config. */
export function getAppBrand() {
  const result = publicBrandSchema.safeParse(Constants.expoConfig?.extra?.brand);
  if (!result.success) {
    throw new Error('Missing or invalid brand metadata. Restart Expo with the intended APP_BRAND.');
  }
  return result.data;
}
