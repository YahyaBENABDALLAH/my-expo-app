import { useTranslation } from 'react-i18next';
import { PageScreen } from '@components/ui';
export default function NotFoundScreen() {
  const { t } = useTranslation();
  return (
    <PageScreen
      title={t('recovery.notFound')}
      description={t('recovery.notFoundDescription')}
      actions={[{ label: t('recovery.home'), testID: 'page-action-go-home', href: '/' }]}
    />
  );
}
