import { useIsFocused, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import StorybookUI, { StorybookCanvas } from '@storybook';
import Colors from '@/constants/colors';
import { TAB_BAR_CONTENT_HEIGHT } from '@/constants/layout';

export default function StorybookScreen() {
  const focused = useIsFocused();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ mode?: string }>();

  return (
    <GestureHandlerRootView
      testID="storybook-screen"
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: TAB_BAR_CONTENT_HEIGHT + insets.bottom,
        backgroundColor: Colors.dark.background,
      }}
    >
      {focused ? <StatusBar style="light" /> : null}
      {params.mode === 'canvas' ? <StorybookCanvas /> : <StorybookUI />}
    </GestureHandlerRootView>
  );
}
