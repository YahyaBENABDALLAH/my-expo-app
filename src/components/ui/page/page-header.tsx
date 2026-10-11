import { Column, Row, Spacer } from '@expo/ui';
import { useThemeColors } from '@/hooks/use-theme';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { UniversalTextContent as Text } from '../text/universal-text';
import { PageBackButton } from './page-back-button';
import { nativeFillWidth, nativeRowWeight } from '../native/native-fill-width';
import { UniversalButtonContent } from '../button/universal-button-content';

export type PageHeaderAction = { label: string; onPress: () => void; testID?: string };

/** Page title and optional navigation action. Preferences live in App Settings. */
export function PageHeader({
  title,
  onBack,
  colorScheme,
  action,
}: {
  title?: string;
  onBack?: () => void;
  colorScheme?: 'light' | 'dark';
  action?: PageHeaderAction;
}) {
  const scheme = useHostColorScheme(colorScheme);
  const colors = useThemeColors(scheme);
  return (
    <UniversalHost colorScheme={scheme} ignoreSafeArea="all" testID="page-header">
      <Column
        spacing={8}
        modifiers={nativeFillWidth}
        style={{ paddingHorizontal: 24, paddingVertical: 8 }}
      >
        {title ? (
          <Row alignment="center" spacing={8} modifiers={nativeFillWidth}>
            {onBack ? <PageBackButton color={colors.text} onPress={onBack} /> : null}
            <Column modifiers={nativeRowWeight}>
              <Text variant="title" fontSize={24} testID="page-title">
                {title}
              </Text>
            </Column>
            {/* Stable minimum row height; titles may still grow with Dynamic Type. */}
            <Spacer style={{ width: 0, height: 48 }} />
            {action ? <UniversalButtonContent variant="link" {...action} /> : null}
          </Row>
        ) : null}
      </Column>
    </UniversalHost>
  );
}
