import { Suspense, lazy } from 'react';
import { useIsFocused } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';

export { ScreenError as ErrorBoundary } from '@/components/screen-error';

const MapExperience = lazy(() =>
  import('@/features/maps/map-experience').then(({ MapExperience }) => ({
    default: MapExperience,
  })),
);

export default function MapsScreen() {
  const focused = useIsFocused();
  return (
    <View style={{ flex: 1, backgroundColor: '#E9F1EE' }}>
      {focused ? <StatusBar style="dark" /> : null}
      <Suspense
        fallback={
          <ActivityIndicator color="#173C35" style={{ flex: 1, justifyContent: 'center' }} />
        }
      >
        <MapExperience />
      </Suspense>
    </View>
  );
}
