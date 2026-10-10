import {
  Column,
  RNHostView,
  ScrollView,
  UniversalHost,
  nativeFillWidth,
  type UniversalThemeProps,
} from '@components/ui';
import type { PropsWithChildren } from 'react';

import { View } from 'react-native';

import { useThemeColors } from '@/hooks/use-theme';

export type NativeStoryTheme = UniversalThemeProps;

/** Shared on-device canvas for the Expo UI stories. */
export function NativeStoryFrame({
  children,
  colorScheme = 'dark',
  testID,
}: PropsWithChildren<NativeStoryTheme>) {
  const colors = useThemeColors(colorScheme);
  return (
    <UniversalHost
      colorScheme={colorScheme}
      matchContents={false}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView testID={testID ? `${testID}-canvas` : undefined}>
        <Column modifiers={nativeFillWidth} style={{ padding: 24 }}>
          <RNHostView matchContents>
            <View>{children}</View>
          </RNHostView>
        </Column>
      </ScrollView>
    </UniversalHost>
  );
}

export const nativeThemeControls = {
  testID: { control: 'text' as const },
  colorScheme: { control: 'select' as const, options: ['light', 'dark'] },
  seedColor: { control: 'color' as const },
};
