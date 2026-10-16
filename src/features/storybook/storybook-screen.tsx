import { useIsFocused, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import StorybookUI from '@storybook';
import { useAppTheme } from '@/hooks/use-theme';
import { screenInsets } from '@/lib/screen-insets';

export default function StorybookScreen() {
  const focused = useIsFocused();
  const { scheme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ mode?: string; STORYBOOK_STORY_ID?: string }>();
  const canvasMode = params.mode === 'canvas';

  return (
    <GestureHandlerRootView
      testID="storybook-screen"
      style={{
        flex: 1,
        ...screenInsets(insets, { tabBarShown: true }),
      }}
    >
      {focused ? <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} /> : null}
      <StorybookUI
        key={canvasMode ? 'canvas' : 'browser'}
        canvasMode={canvasMode}
        initialStoryId={params.STORYBOOK_STORY_ID}
      />
    </GestureHandlerRootView>
  );
}
