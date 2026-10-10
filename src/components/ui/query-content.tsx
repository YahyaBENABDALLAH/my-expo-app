import { useTranslation } from 'react-i18next';
import { Column } from '@expo/ui';
import { UniversalButtonContent } from './universal-button-content';
import type { ReactNode } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import { UniversalTextContent as Text } from './universal-text';
import { LoadingContent } from './loading-state';

export type ContentQuery<T> = Pick<
  UseQueryResult<T, Error>,
  'data' | 'error' | 'fetchStatus' | 'isFetching' | 'isEnabled'
> & { refetch: () => unknown };

export function QueryContent<T>({
  query,
  empty,
  children,
  disabledMessage,
  emptyMessage,
}: {
  query: ContentQuery<T>;
  empty?: boolean;
  disabledMessage?: string;
  emptyMessage?: string;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <Column spacing={12}>
      {query.error ? (
        <>
          <Text testID="query-error">
            {query.data === undefined ? t('query.failed') : t('query.refreshFailed')}
          </Text>
          <UniversalButtonContent
            variant="secondary"
            label={t('common.retry')}
            onPress={() => {
              void query.refetch();
            }}
            disabled={query.isFetching || !query.isEnabled || query.fetchStatus === 'paused'}
          />
        </>
      ) : null}
      {query.fetchStatus === 'paused' ? (
        <Text testID="query-offline">
          {query.data === undefined ? t('query.offline') : t('query.offlineCached')}
        </Text>
      ) : null}
      {query.fetchStatus === 'fetching' ? (
        <LoadingContent
          label={query.data === undefined ? t('common.loading') : t('common.refreshing')}
        />
      ) : null}
      {query.data === undefined && !query.error && query.fetchStatus === 'idle' ? (
        <Text testID="query-idle">
          {query.isEnabled ? t('query.waiting') : (disabledMessage ?? t('query.disabled'))}
        </Text>
      ) : null}
      {query.data !== undefined ? (
        empty ? (
          <Text>{emptyMessage ?? t('query.empty')}</Text>
        ) : (
          children
        )
      ) : null}
    </Column>
  );
}
