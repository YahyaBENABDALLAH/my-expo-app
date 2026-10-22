import { spacing } from '@/constants/layout';
import { useTranslation } from 'react-i18next';
import { Column } from '@expo/ui';
import { nativeFillWidth } from '../native/native-fill-width';
import { UniversalButtonContent } from '../button/universal-button';
import { UniversalTextContent as Text } from '../text/universal-text';
import { useHostColorScheme } from '../host/universal-host';
import { useThemeColors } from '@/hooks/use-theme';

export function FormSubmit({
  testID,
  label,
  pending,
  onPress,
  error,
  notice,
}: {
  testID: string;
  label: string;
  pending: boolean;
  onPress: () => void;
  error?: string;
  notice?: string;
}) {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  return (
    <Column spacing={spacing.lg} modifiers={nativeFillWidth}>
      <UniversalButtonContent
        variant="primary"
        testID={testID}
        label={pending ? t('common.wait') : label}
        disabled={pending}
        fullWidth
        onPress={onPress}
      />
      {error ? (
        <Text testID={`${testID}-error`} textStyle={{ color: colors.error }}>
          {error}
        </Text>
      ) : null}
      {notice ? (
        <Text testID={`${testID}-status`} textStyle={{ color: colors.success }}>
          {notice}
        </Text>
      ) : null}
    </Column>
  );
}
