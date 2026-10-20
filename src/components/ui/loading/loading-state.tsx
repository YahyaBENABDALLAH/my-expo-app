import { spacing } from '@/constants/layout';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/use-theme';
import { Column, Row, Spacer } from '@expo/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LoadingIndicator } from './loading-indicator';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { UniversalTextContent } from '../text/universal-text';
import { nativeFillSize } from '../native/native-fill-width';
import { screenInsets } from '@/lib/screen-insets';
import { PageSection } from '../page/page-section';

export function LoadingContent({
  label,
  testID = 'loading-state',
}: {
  label?: string;
  testID?: string;
}) {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  return (
    <Row spacing={spacing.md} alignment="center" testID={testID}>
      <LoadingIndicator color={colors.tint} />
      <UniversalTextContent>{label ?? t('common.loading')}</UniversalTextContent>
    </Row>
  );
}

/** Fullscreen fallback for native route/Suspense boundaries. */
export function LoadingScreen({
  label,
  colorScheme,
}: {
  label?: string;
  colorScheme?: 'light' | 'dark';
}) {
  const scheme = useHostColorScheme(colorScheme);
  const insets = useSafeAreaInsets();
  const colors = useThemeColors(scheme);
  return (
    <UniversalHost
      colorScheme={scheme}
      matchContents={false}
      ignoreSafeArea="all"
      style={{ flex: 1, backgroundColor: colors.background, ...screenInsets(insets) }}
    >
      <Column alignment="center" modifiers={nativeFillSize}>
        <Spacer flexible />
        <PageSection alignment="center">
          <LoadingContent label={label} />
        </PageSection>
        <Spacer flexible />
      </Column>
    </UniversalHost>
  );
}
