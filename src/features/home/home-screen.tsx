import { useTranslation } from 'react-i18next';
import { PageScreen } from '@components/ui';
import { useAuthGuards } from '@/guards/auth-guards';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { requireAuth } = useAuthGuards();
  return (
    <PageScreen
      showBack={false}
      title={t('common.home')}
      description={t('starter.homeDescription')}
      actions={[
        { label: t('tools.showcase'), href: '/ui', testID: 'home-showcase' },
        { label: t('settings.title'), href: '/settings', testID: 'home-settings' },
        requireAuth
          ? { label: t('common.account'), href: '/account', testID: 'home-account' }
          : { label: t('auth.signIn'), href: '/login', testID: 'home-login' },
      ]}
    />
  );
}
