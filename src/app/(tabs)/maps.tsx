import { useTranslation } from 'react-i18next';
import { LoadingScreen, PageFrame } from '@components/ui';
import { Suspense, lazy } from 'react';
import { useIsFocused } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/use-color-scheme';

export { ScreenError as ErrorBoundary } from '@components/ui';

const MapExperience = lazy(() =>
  import('@components/ui/map-experience').then(({ MapExperience }) => ({
    default: MapExperience,
  })),
);

export default function MapsScreen() {
  const { t } = useTranslation();
  const focused = useIsFocused();
  const scheme = useColorScheme();
  return (
    <PageFrame title={t('tools.maps')} tab>
      {focused ? <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} /> : null}
      <Suspense fallback={<LoadingScreen label={t('tools.loadingMap')} />}>
        <MapExperience />
      </Suspense>
    </PageFrame>
  );
}
