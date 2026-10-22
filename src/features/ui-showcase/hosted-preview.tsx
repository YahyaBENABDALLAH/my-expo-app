import type { ReactNode } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RNHostView } from '@components/ui';
import { spacing } from '@/constants/layout';

/** Real RN boundary for demonstrating hosted components inside a native page section. */
export function HostedPreview({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const contentWidth = Math.max(1, width - insets.left - insets.right - spacing.lg * 2);
  return (
    <RNHostView matchContents>
      <View style={{ width: contentWidth, gap: spacing.lg, alignItems: 'flex-start' }}>
        {children}
      </View>
    </RNHostView>
  );
}
