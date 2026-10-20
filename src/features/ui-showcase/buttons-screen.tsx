import { useTranslation } from 'react-i18next';
import {
  PageScreen,
  PageSection,
  UniversalButtonContent,
  UniversalTextContent as Text,
} from '@components/ui';
import { useState } from 'react';

export default function ButtonsScreen() {
  const { t } = useTranslation();
  const [presses, setPresses] = useState(0);
  return (
    <PageScreen title={t('showcase.buttons')} description={t('showcase.buttonDescription')}>
      <PageSection>
        <Text testID="demo-button-count">{t('showcase.actions', { count: presses })}</Text>
        {(['primary', 'secondary', 'link', 'success', 'warning', 'destructive'] as const).map(
          (variant) => (
            <UniversalButtonContent
              key={variant}
              variant={variant}
              label={t(`showcase.${variant}`)}
              fullWidth
              onPress={() => setPresses((count) => count + 1)}
            />
          ),
        )}
        <UniversalButtonContent
          variant="primary"
          label={t('showcase.disabledAction')}
          disabled
          fullWidth
        />
      </PageSection>
    </PageScreen>
  );
}
