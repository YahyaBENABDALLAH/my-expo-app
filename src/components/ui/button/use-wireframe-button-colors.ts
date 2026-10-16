import { useAppTheme } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';
import { semanticButtonColors } from './semantic-button-colors';
import type { UniversalButtonProps } from './universal-button.types';

type ColorProps = Pick<UniversalButtonProps, 'variant' | 'color' | 'contentColor' | 'colorScheme'>;

/** UX keeps exact primary and semantic pairs; a native seed can change their contrast. */
export function useWireframeButtonColors({
  variant,
  color,
  contentColor,
  colorScheme,
}: ColorProps) {
  const { themeId, colors } = useAppTheme(useHostColorScheme(colorScheme));
  if (themeId !== 'ux' || color !== undefined || contentColor !== undefined) {
    return { color, contentColor };
  }
  return semanticButtonColors(variant, colors);
}
