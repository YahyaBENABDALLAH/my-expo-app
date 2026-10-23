import type { FontSource } from 'expo-font';
import { Platform } from 'react-native';
import bluePepe from '@assets/animations/blue-pepe.lottie';
import assets from '../../config/brand-assets.json';
import { getAppBrand, type AppBrand, type HeadingFontId, type LaunchArtworkId } from './brand';

// Metro requires literal asset references. Keep paths aligned with brand-assets.json.
const fontSources: Record<HeadingFontId, FontSource | undefined> = {
  system: undefined,
  interBlack: require('@assets/fonts/Inter-Black.otf'),
};
const artworkSources: Record<LaunchArtworkId, number> = {
  bluePepe,
  templateIcon: require('@assets/images/icon.png'),
};

/** Stable build-time selection; the root loads only the selected font map. */
export function getBrandFonts(brand: AppBrand = getAppBrand()): Record<string, FontSource> {
  const id = brand.presentation.headingFont;
  const font = assets.headingFonts[id];
  const source = fontSources[id];
  return font.runtimeName && source !== undefined ? { [font.runtimeName]: source } : {};
}

/** Unsupported scripts keep native fallback instead of forcing a Latin font. */
export function getBrandHeadingFont(language: string, brand: AppBrand = getAppBrand()) {
  const font = assets.headingFonts[brand.presentation.headingFont];
  if (!font.languages.some((supported) => supported === language)) return undefined;
  return (Platform.OS === 'ios' ? font.nativeFamily.ios : font.nativeFamily.android) ?? undefined;
}

export function getBrandLaunchArtwork(brand: AppBrand = getAppBrand()) {
  const id = brand.presentation.launchArtwork;
  return { type: assets.launchArtworks[id].type, source: artworkSources[id] };
}
