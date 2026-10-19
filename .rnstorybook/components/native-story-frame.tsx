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
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMeasuredWidth } from '@/hooks/use-measured-width';

export type NativeStoryTheme = UniversalThemeProps;
const canvasPadding = 24;

/** Shared on-device canvas for the Expo UI stories. */
export function NativeStoryFrame({
  children,
  colorScheme,
  seedColor,
  testID,
}: PropsWithChildren<NativeStoryTheme>) {
  const scheme = useColorScheme(colorScheme);
  const colors = useThemeColors(scheme);
  const [width, setWidth] = useMeasuredWidth();
  return (
    <View
      style={{ flex: 1, backgroundColor: colors.background }}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    >
      <UniversalHost
        colorScheme={scheme}
        seedColor={seedColor}
        matchContents={false}
        style={{ flex: 1 }}
      >
        <ScrollView testID={testID ? `${testID}-canvas` : undefined}>
          <Column modifiers={nativeFillWidth} style={{ padding: canvasPadding }}>
            {width > 0 && (
              <RNHostView matchContents>
                {/* Percentage widths collapse inside an intrinsically measured RN bridge. */}
                <View style={{ width: Math.max(1, width - canvasPadding * 2) }}>{children}</View>
              </RNHostView>
            )}
          </Column>
        </ScrollView>
      </UniversalHost>
    </View>
  );
}

export const nativeThemeControls = {
  seedColor: { control: 'color' as const },
};
