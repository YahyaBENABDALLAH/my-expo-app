import {
  Column,
  LayoutDirectionControl,
  nativeFillWidth,
  UniversalHost,
  useHostColorScheme,
} from '@components/ui';
import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { SafeAreaInsetsContext, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/use-theme';

/** Direction-only composition retained for isolated native Storybook fixtures. */
export function LayoutDirectionFrame({
  children,
  colorScheme,
  testIDPrefix = 'page-layout-direction',
}: PropsWithChildren<{
  colorScheme?: 'light' | 'dark';
  testIDPrefix?: string;
}>) {
  const insets = useSafeAreaInsets();
  const scheme = useHostColorScheme(colorScheme);
  const colors = useThemeColors(scheme);
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        testID={`${testIDPrefix}-toolbar`}
        style={{ paddingTop: insets.top, paddingLeft: insets.left, paddingRight: insets.right }}
      >
        <UniversalHost colorScheme={scheme} ignoreSafeArea="all">
          <Column
            modifiers={nativeFillWidth}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: colors.surface,
            }}
          >
            <LayoutDirectionControl compact testIDPrefix={testIDPrefix} />
          </Column>
        </UniversalHost>
      </View>
      <SafeAreaInsetsContext.Provider value={{ ...insets, top: 0 }}>
        <View style={{ flex: 1 }}>{children}</View>
      </SafeAreaInsetsContext.Provider>
    </View>
  );
}
