import { RNHostView } from '@expo/ui';
import { Box } from '@expo/ui/jetpack-compose';
import { size, zIndex } from '@expo/ui/jetpack-compose/modifiers';
import type { FloatingActionLayoutProps } from './floating-action-layout.types';

/** One native stacking tree keeps controls above hosted RN artwork. */
export function FloatingActionLayout({ artwork, children }: FloatingActionLayoutProps) {
  return (
    <Box contentAlignment="center" modifiers={[size(76, 76)]}>
      <RNHostView matchContents>{artwork}</RNHostView>
      <Box contentAlignment="center" modifiers={[size(76, 76), zIndex(1)]}>
        {children}
      </Box>
    </Box>
  );
}
