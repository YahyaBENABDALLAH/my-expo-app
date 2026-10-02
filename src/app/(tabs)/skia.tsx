import { Suspense, lazy } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useIsFocused } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { AsyncSkia } from '@/features/skia/async-skia';
import { useClientOnlyValue } from '@/hooks/use-client-only-value';

export { ScreenError as ErrorBoundary } from '@/components/screen-error';

const SkiaExperience = lazy(() => import('@/features/skia/skia-experience'));

export default function SkiaScreen() {
  const focused = useIsFocused();
  const clientReady = useClientOnlyValue(false, true);

  return (
    <View style={{ flex: 1, backgroundColor: '#081224' }}>
      {focused ? <StatusBar style="light" /> : null}
      {clientReady ? (
        <Suspense fallback={<ActivityIndicator color="#B8E9FF" style={{ flex: 1 }} />}>
          <AsyncSkia />
          <SkiaExperience />
        </Suspense>
      ) : null}
    </View>
  );
}
