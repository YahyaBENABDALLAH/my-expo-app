import type { PropsWithChildren } from 'react';
import { Platform, ScrollView } from 'react-native';
import type { UniversalThemeProps } from '@/components/ui/types';
import Colors from '@/constants/colors';

export type NativeStoryTheme = UniversalThemeProps;

/** Shared on-device canvas for the Expo UI stories. */
export function NativeStoryFrame({
  children,
  colorScheme = 'dark',
  testID,
}: PropsWithChildren<NativeStoryTheme>) {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return null;
  return (
    <ScrollView
      testID={testID ? `${testID}-canvas` : undefined}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        flexGrow: 1,
        padding: 24,
        backgroundColor: Colors[colorScheme].background,
      }}
    >
      {children}
    </ScrollView>
  );
}

export const nativeThemeControls = {
  testID: { control: 'text' as const },
  colorScheme: { control: 'select' as const, options: ['light', 'dark'] },
  seedColor: { control: 'color' as const },
};
