import { Column, Row } from '@expo/ui';
import { Platform } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { UniversalTextContent as Text } from '../text/universal-text';
import { PageBackButton } from './page-back-button';
import { nativeFillWidth, nativeRowWeight } from '../native/native-fill-width';
import { spacing } from '@/constants/layout';

/** Page title and optional navigation action. Preferences live in App Settings. */
export function PageHeader({
  title,
  onBack,
  colorScheme,
}: {
  title?: string;
  onBack?: () => void;
  colorScheme?: 'light' | 'dark';
}) {
  const scheme = useHostColorScheme(colorScheme);
  const colors = useThemeColors(scheme);
  const isIOS = Platform.OS === 'ios';
  return (
    <UniversalHost colorScheme={scheme} ignoreSafeArea="all" testID="page-header">
      <Column
        spacing={spacing.sm}
        modifiers={nativeFillWidth}
        style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.sm }}
      >
        {/* A taller back action must not move the title below title-only headers. */}
        {title ? (
          <Row alignment="start" spacing={spacing.sm} modifiers={nativeFillWidth}>
            {onBack ? <PageBackButton color={colors.text} onPress={onBack} /> : null}
            <Column alignment="start" modifiers={isIOS ? nativeFillWidth : nativeRowWeight}>
              <Text variant="title" testID="page-title">
                {title}
              </Text>
            </Column>
          </Row>
        ) : null}
      </Column>
    </UniversalHost>
  );
}
