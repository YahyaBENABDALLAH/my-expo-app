import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PageScreen,
  PageSection,
  QueryContent,
  UniversalButtonContent,
  UniversalTextContent as Text,
  type ContentQuery,
} from '@components/ui';

export default function LoadingScreen() {
  const { t } = useTranslation();
  return (
    <PageScreen title={t('showcase.queryStates')} description={t('showcase.queryStatesHint')}>
      <QueryRetryPreview testID="demo-query-recipes" title={t('common.recipes')} />
      <QueryRetryPreview testID="demo-query-favorites" title={t('common.favoritesOnly')} />
    </PageScreen>
  );
}

/** Local presentation state only; retries never make backend requests. */
export function QueryRetryPreview({ testID, title }: { testID: string; title: string }) {
  const { t } = useTranslation();
  const [retries, setRetries] = useState(0);
  const query: ContentQuery<boolean> = {
    data: retries > 0 ? true : undefined,
    error: retries > 0 ? null : new Error('Preview error'),
    fetchStatus: 'idle',
    isFetching: false,
    isEnabled: true,
    refetch: () => setRetries((count) => count + 1),
  };
  return (
    <PageSection>
      <Text variant="subtitle">{title}</Text>
      <QueryContent query={query} testID={testID}>
        <Text testID={`${testID}-content`}>{t('showcase.gallery.loaded')}</Text>
      </QueryContent>
      <Text testID={`${testID}-count`}>{t('showcase.actions', { count: retries })}</Text>
      <UniversalButtonContent
        variant="link"
        label={t('showcase.buttonGallery.reset')}
        testID={`${testID}-reset`}
        onPress={() => setRetries(0)}
      />
    </PageSection>
  );
}
