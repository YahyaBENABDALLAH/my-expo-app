import { useTranslation } from 'react-i18next';
import { LoadingScreen, PageFrame } from '@components/ui';
import { Suspense, lazy } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useIsFocused } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';

export { ScreenError as ErrorBoundary } from '@components/ui';
const SkiaExperience = lazy(() => import('@/features/skia/skia-experience'));

export default function SkiaScreen() {
  const { t } = useTranslation();
  const focused = useIsFocused();
  const scheme = useColorScheme();
  return (
    <PageFrame title={t('tools.skia')} tab>
      {focused ? <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} /> : null}
      <Suspense fallback={<LoadingScreen label={t('tools.loadingCanvas')} />}>
        <SkiaExperience />
      </Suspense>
    </PageFrame>
  );
}
