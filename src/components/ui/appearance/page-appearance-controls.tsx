import { useTranslation } from 'react-i18next';
import { Column, Row } from '@expo/ui';
import { useThemeColors } from '@/hooks/use-theme';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { UniversalTextContent as Text } from '../text/universal-text';
import { LayoutDirectionControl } from './layout-direction-control';
import { ColorSchemeControl } from './color-scheme-control';
import { ThemePicker } from './theme-picker';
import { LanguagePicker } from './language-picker';
import { nativeFillWidth, nativeRowWeight } from '../native/native-fill-width';

/** Compose after the last page action, inside the page's existing native scroll content. */
export function PageAppearanceControls() {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  return (
    <Column
      testID="page-appearance-footer"
      spacing={8}
      modifiers={nativeFillWidth}
      style={{ padding: 16, backgroundColor: colors.surface }}
    >
      <Row spacing={16} alignment="center" modifiers={nativeFillWidth}>
        <Column modifiers={nativeRowWeight}>
          <LayoutDirectionControl compact testIDPrefix="page-layout-direction" />
        </Column>
        <Column modifiers={nativeRowWeight}>
          <ColorSchemeControl />
        </Column>
      </Row>
      <Row spacing={12} alignment="center" modifiers={nativeFillWidth}>
        <Text variant="caption">{t('common.language')}</Text>
        <Column modifiers={nativeRowWeight}>
          <LanguagePicker />
        </Column>
      </Row>
      <Row spacing={12} alignment="center" modifiers={nativeFillWidth}>
        <Text variant="caption">{t('common.theme')}</Text>
        <Column modifiers={nativeRowWeight}>
          <ThemePicker />
        </Column>
      </Row>
    </Column>
  );
}

/** RN map/canvas boundaries append a separate native Host below their content. */
export function PageAppearanceFooter({ colorScheme }: { colorScheme?: 'light' | 'dark' }) {
  return (
    <UniversalHost
      colorScheme={colorScheme}
      ignoreSafeArea="all"
      testID="page-appearance-footer-container"
    >
      <PageAppearanceControls />
    </UniversalHost>
  );
}
