import { useTranslation } from 'react-i18next';
import { LoadingScreen, PageFrame } from '@components/ui';
import { Redirect } from 'expo-router';
import { Suspense, lazy } from 'react';
import { appDevEnabled } from '@/constants/app-dev';

export { ScreenError as ErrorBoundary } from '@components/ui';

const StorybookScreen = appDevEnabled
  ? lazy(() => import('@/features/storybook/storybook-screen'))
  : null;

export default function StorybookRoute() {
  const { t } = useTranslation();
  if (!StorybookScreen) return <Redirect href="/skia" />;

  return (
    <PageFrame title={t('tools.storybook')}>
      <Suspense fallback={<LoadingScreen label={t('tools.loadingStories')} />}>
        <StorybookScreen />
      </Suspense>
    </PageFrame>
  );
}
