import { RNHostView } from '@expo/ui';
import { ZStack } from '@expo/ui/swift-ui';
import { frame } from '@expo/ui/swift-ui/modifiers';
import type { FloatingActionLayoutProps } from './floating-action-layout.types';

export function FloatingActionLayout({ artwork, children }: FloatingActionLayoutProps) {
  return (
    <ZStack modifiers={[frame({ width: 76, height: 76 })]}>
      <RNHostView matchContents>{artwork}</RNHostView>
      {children}
    </ZStack>
  );
}
