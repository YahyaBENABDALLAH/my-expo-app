import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/use-theme';
import { Column, Row, Spacer } from '@expo/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LoadingIndicator } from './loading-indicator';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { UniversalTextContent } from '../text/universal-text';
import { nativeFillSize } from '../native/native-fill-width';

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
    <Row spacing={12} alignment="center" testID={testID}>
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
  return (
    <UniversalHost
      colorScheme={scheme}
      matchContents={false}
      ignoreSafeArea="all"
      style={{ flex: 1, backgroundColor: useThemeColors(scheme).background }}
    >
      <Column
        alignment="center"
        modifiers={nativeFillSize}
        style={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: Math.max(24, insets.left, insets.right),
        }}
      >
        <Spacer flexible />
        <LoadingContent label={label} />
        <Spacer flexible />
      </Column>
    </UniversalHost>
  );
}
