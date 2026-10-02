import type { ReactNode } from 'react';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UniversalText } from '@/components/ui/universal-text';
import { TAB_BAR_CONTENT_HEIGHT } from '@/constants/layout';
import Colors from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function AuthScreenFrame({
  testID,
  description,
  children,
  tabbed = false,
}: {
  testID: string;
  description: string;
  children: ReactNode;
  tabbed?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAvoidingView
      testID={testID}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: Colors[scheme].background }}
    >
      <ScrollView
        testID={`${testID}-scroll`}
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: headerHeight + 28,
          paddingHorizontal: Math.max(24, insets.left + 16, insets.right + 16),
          paddingBottom: 24 + insets.bottom + (tabbed ? TAB_BAR_CONTENT_HEIGHT : 0),
        }}
      >
        <View style={{ width: '100%', maxWidth: 480, alignSelf: 'center', gap: 28 }}>
          <View style={{ gap: 12 }}>
            <UniversalText
              variant="caption"
              fontWeight="700"
              textStyle={{ letterSpacing: 3 }}
              colorScheme={scheme}
            >
              LIKAN
            </UniversalText>
            <UniversalText variant="body" colorScheme={scheme}>
              {description}
            </UniversalText>
          </View>
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
