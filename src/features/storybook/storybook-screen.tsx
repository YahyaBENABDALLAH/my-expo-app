import { PageFrame } from '@components/ui';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { storybookEnabled } from '@/config/developer-tools';

// Keep the registration dependency inside a branch Expo removes from release bundles.
const StorybookUI: typeof import('@storybook').default | undefined = __DEV__
  ? // eslint-disable-next-line @typescript-eslint/no-require-imports -- Expo removes this dependency in release mode.
    require('@storybook').default
  : undefined;

export default function StorybookScreen() {
  const { storyId, canvas } = useLocalSearchParams<{ storyId?: string; canvas?: string }>();

  if (!storybookEnabled || !StorybookUI) return <Redirect href="/" />;

  const canvasMode = canvas === 'true';
  return (
    <PageFrame
      title="Storybook"
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/'))}
    >
      <StorybookUI
        key={`${canvasMode ? 'canvas' : 'browser'}:${storyId ?? ''}`}
        canvasMode={canvasMode}
        initialStoryId={storyId}
      />
    </PageFrame>
  );
}
