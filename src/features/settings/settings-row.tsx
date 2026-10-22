import type { ReactNode } from 'react';
import { Platform } from 'react-native';
import {
  Column,
  Row,
  UniversalButtonContent,
  UniversalTextContent as Text,
  nativeFillWidth,
  nativeRowWeight,
  useHostColorScheme,
} from '@components/ui';
import { spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';

/** Shared settings-row geometry for App Settings and its FieldGroup showcase. */
export function SettingsRow({
  label,
  detail,
  leading,
  trailing,
  onPress,
  disabled = false,
  testID,
}: {
  label: string;
  detail?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
}) {
  const colors = useThemeColors(useHostColorScheme());
  const content = (
    <Row
      alignment="center"
      spacing={spacing.lg}
      modifiers={nativeFillWidth}
      style={{ paddingVertical: spacing.lg }}
    >
      {leading}
      <Column
        spacing={spacing.xs}
        modifiers={Platform.OS === 'ios' ? nativeFillWidth : nativeRowWeight}
      >
        <Text>{label}</Text>
        {detail ? (
          <Text fontSize={14} textStyle={{ color: colors.muted }}>
            {detail}
          </Text>
        ) : null}
      </Column>
      {trailing}
    </Row>
  );
  if (onPress) {
    return (
      <UniversalButtonContent
        variant="link"
        fullWidth
        contentPadding={spacing.none}
        onPress={() => {
          if (!disabled) onPress();
        }}
        disabled={disabled}
        testID={testID}
      >
        {content}
      </UniversalButtonContent>
    );
  }
  return (
    <Column modifiers={nativeFillWidth} disabled={disabled} testID={testID}>
      {content}
    </Column>
  );
}
