import { Redirect } from 'expo-router';
import { Suspense, lazy } from 'react';
import { ActivityIndicator } from 'react-native';

export { ScreenError as ErrorBoundary } from '@/components/screen-error';

const StorybookScreen = __DEV__
  ? lazy(() => import('@/features/storybook/storybook-screen'))
  : null;

export default function StorybookRoute() {
  if (!StorybookScreen) return <Redirect href="/skia" />;

  return (
    <Suspense fallback={<ActivityIndicator style={{ flex: 1 }} />}>
      <StorybookScreen />
    </Suspense>
  );
}
