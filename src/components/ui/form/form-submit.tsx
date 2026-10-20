import { spacing } from '@/constants/layout';
import { useTranslation } from 'react-i18next';
import { Column } from '@expo/ui';
import { nativeFillWidth } from '../native/native-fill-width';
import { UniversalButtonContent } from '../button/universal-button-content';
import { UniversalTextContent as AuthText } from '../text/universal-text';
import { useAuthTheme } from '../auth/auth-theme';

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
  const { colors } = useAuthTheme();
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
        <AuthText testID={`${testID}-error`} textStyle={{ color: colors.error }}>
          {error}
        </AuthText>
      ) : null}
      {notice ? (
        <AuthText testID={`${testID}-status`} textStyle={{ color: colors.success }}>
          {notice}
        </AuthText>
      ) : null}
    </Column>
  );
}
