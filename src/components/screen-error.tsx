import type { ErrorBoundaryProps } from 'expo-router';
import { Pressable, ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { TAB_BAR_CONTENT_HEIGHT } from '@/constants/layout';
import { useColorScheme } from '@/hooks/use-color-scheme';

/** Uses RN controls so it still renders when an optional native UI module fails. */
export function ScreenError({ error, retry }: ErrorBoundaryProps) {
  const colors = Colors[useColorScheme()];
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      testID="screen-error"
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        gap: 16,
        paddingTop: insets.top + 24,
        paddingBottom: TAB_BAR_CONTENT_HEIGHT + insets.bottom + 24,
        paddingHorizontal: Math.max(24, insets.left + 16, insets.right + 16),
      }}
    >
      <Text
        accessibilityRole="header"
        style={{ color: colors.text, fontSize: 24, fontWeight: '600' }}
      >
        This screen couldn’t load
      </Text>
      <Text style={{ color: colors.muted, fontSize: 16 }}>
        You can try again or open another tab.
      </Text>
      {__DEV__ ? (
        <Text selectable style={{ color: colors.error }}>
          {error.message}
        </Text>
      ) : null}
      <Pressable
        testID="screen-error-retry"
        accessibilityRole="button"
        onPress={() => {
          void retry();
        }}
        style={({ pressed }) => ({
          alignSelf: 'flex-start',
          padding: 16,
          borderRadius: 12,
          backgroundColor: colors.tint,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Try again</Text>
      </Pressable>
    </ScrollView>
  );
}
