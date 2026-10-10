import { useTranslation } from 'react-i18next';
import { Column } from '@expo/ui';
import { nativeFillWidth } from './native-fill-width';
import { UniversalButtonContent } from './universal-button-content';
import { UniversalTextContent as AuthText } from './universal-text';
import { useAuthTheme } from './auth-theme';

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
    <Column spacing={16} modifiers={nativeFillWidth}>
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
