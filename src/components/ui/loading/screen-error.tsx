import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/use-theme';
import { ScrollView } from '@expo/ui';
import type { ErrorBoundaryProps } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UniversalHost } from '../host/universal-host';
import { UniversalButtonContent } from '../button/universal-button-content';
import { UniversalTextContent as Text } from '../text/universal-text';
import { PageFrame } from '../page/page-frame';
import { PageSection } from '../page/page-section';
import { screenInsets } from '@/lib/screen-insets';

/** Recovery UI uses the same native Expo UI controls as the rest of the app. */
export function ScreenError({ error, retry }: ErrorBoundaryProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  return (
    <PageFrame title={t('recovery.title')}>
      <UniversalHost
        testID="screen-error"
        matchContents={false}
        ignoreSafeArea="all"
        style={{ flex: 1, ...screenInsets(insets, { headerShown: true }) }}
      >
        <ScrollView>
          <PageSection>
            <Text variant="title">{t('recovery.failed')}</Text>
            <Text>{t('recovery.description')}</Text>
            {__DEV__ ? <Text textStyle={{ color: colors.error }}>{error.message}</Text> : null}
            <UniversalButtonContent
              variant="secondary"
              label={t('common.tryAgain')}
              testID="screen-error-retry"
              onPress={() => {
                void retry();
              }}
            />
          </PageSection>
        </ScrollView>
      </UniversalHost>
    </PageFrame>
  );
}
