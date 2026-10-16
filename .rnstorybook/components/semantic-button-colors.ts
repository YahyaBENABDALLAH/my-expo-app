import { semanticButtonColors as appButtonColors } from '@/components/ui/button/semantic-button-colors';
import type { UniversalButtonContentProps, UniversalButtonVariant } from '@components/ui';
import type { ColorTokens } from '@/constants/colors';

/** Glass previews keep native defaults; other variants share the app's semantic pairs. */
export function semanticButtonColors(
  variant: UniversalButtonVariant,
  colors: ColorTokens,
): Pick<UniversalButtonContentProps, 'color' | 'contentColor'> {
  return variant === 'glass' ? {} : appButtonColors(variant, colors);
}
