import { useTranslation } from 'react-i18next';
import { PageScreen } from '@components/ui';
import { componentPages } from '@/features/ui-showcase/catalog';

export function UiShowcaseScreen() {
  const { t } = useTranslation();
  return (
    <PageScreen
      title={t('tools.showcase')}
      description={t('tools.showcaseDescription')}
      actions={componentPages.map(({ name, label, testID }) => ({
        label: t(label),
        testID,
        href: { pathname: '/ui-component/[name]' as const, params: { name } },
      }))}
    />
  );
}
