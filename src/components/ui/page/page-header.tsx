import { Column, Row } from '@expo/ui';
import { Platform } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { UniversalTextContent as Text } from '../text/universal-text';
import { PageBackButton } from './page-back-button';
import { nativeFillWidth, nativeRowWeight } from '../native/native-fill-width';

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
        spacing={8}
        modifiers={nativeFillWidth}
        style={{ paddingHorizontal: 16, paddingVertical: isIOS ? 4 : 8 }}
      >
        {title ? (
          <Row alignment="center" spacing={8} modifiers={nativeFillWidth}>
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
