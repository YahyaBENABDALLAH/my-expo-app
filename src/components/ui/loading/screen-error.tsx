import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/use-theme';
import { Column, ScrollView } from '@expo/ui';
import type { ErrorBoundaryProps } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UniversalHost } from '../host/universal-host';
import { UniversalButtonContent } from '../button/universal-button-content';
import { UniversalTextContent as Text } from '../text/universal-text';
import { nativeFillWidth } from '../native/native-fill-width';
import { PageFrame } from '../page/page-frame';
import { PageAppearanceControls } from '../appearance/page-appearance-controls';

/** Recovery UI uses the same native Expo UI controls as the rest of the app. */
export function ScreenError({ error, retry }: ErrorBoundaryProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  return (
    <PageFrame title={t('recovery.title')} showAppearanceFooter={false}>
      <UniversalHost
        testID="screen-error"
        matchContents={false}
        ignoreSafeArea="all"
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <ScrollView>
          <Column
            spacing={16}
            modifiers={nativeFillWidth}
            style={{
              paddingTop: 24,
              paddingBottom: insets.bottom + 24,
              paddingHorizontal: Math.max(24, insets.left + 16, insets.right + 16),
            }}
          >
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
            <PageAppearanceControls />
          </Column>
        </ScrollView>
      </UniversalHost>
    </PageFrame>
  );
}
