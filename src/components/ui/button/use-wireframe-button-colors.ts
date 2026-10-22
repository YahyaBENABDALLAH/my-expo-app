import { useAppTheme } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';
import { semanticButtonColors } from './semantic-button-colors';
import type { UniversalButtonProps } from './universal-button.types';

type ColorProps = Pick<UniversalButtonProps, 'variant' | 'color' | 'contentColor' | 'colorScheme'>;

/** Every theme supplies semantic intent colors instead of reusing the Host's accent. */
export function useWireframeButtonColors({
  variant,
  color,
  contentColor,
  colorScheme,
}: ColorProps) {
  const { colors } = useAppTheme(useHostColorScheme(colorScheme));
  if (color !== undefined || contentColor !== undefined) {
    return { color, contentColor };
  }
  return semanticButtonColors(variant, colors);
}
