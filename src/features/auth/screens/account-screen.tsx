import { spacing } from '@/constants/layout';
import { useTranslation } from 'react-i18next';
import {
  Column,
  nativeFillWidth,
  AuthScreenFrame,
  UniversalTextContent as Text,
  UniversalButtonContent,
} from '@components/ui';
import { useMutation, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';

import { useScreenRefresh } from '@/hooks/use-screen-refresh';
import { useAuthContext } from '@/context/auth.context';
import { currentIdentityQuery } from '@/services/auth/auth.queries';

export function AccountScreen() {
  const { t } = useTranslation();
  const { user, signOut } = useAuthContext();
  const options = currentIdentityQuery(user?.uuid);
  const identity = useQuery(options);
  const onRefresh = useScreenRefresh([options.queryKey]);
  const logout = useMutation({ mutationFn: signOut, networkMode: 'always', retry: 0 });
  const signOutLabel = t('common.signOut');
  const name = identity.data
    ? `${identity.data.firstName} ${identity.data.lastName}`.trim()
    : `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
  return (
    <AuthScreenFrame
      testID="auth-account"
      onRefresh={user?.uuid && !logout.isPending ? onRefresh : undefined}
      title={name || t('common.account')}
      description={t('account.signedIn')}
    >
      <Column spacing={spacing.lg} modifiers={nativeFillWidth}>
        <Text>{identity.data?.email ?? user?.email ?? ''}</Text>
        {identity.isLoading ? <Text>{t('account.loadingProfile')}</Text> : null}
        {identity.fetchStatus === 'paused' ? <Text>{t('account.offline')}</Text> : null}
        {identity.error ? (
          <>
            <Text>{t('account.refreshFailed')}</Text>
            <UniversalButtonContent
              variant="secondary"
              disabled={identity.isFetching || identity.fetchStatus === 'paused'}
              label={t('account.retryProfile')}
              onPress={() => void onRefresh()}
            />
          </>
        ) : null}
        <UniversalButtonContent
          variant="secondary"
          fullWidth
          testID="auth-logout"
          label={logout.isPending ? t('account.signingOut') : signOutLabel}
          disabled={logout.isPending}
          onPress={() => logout.mutate()}
        />
        {logout.error ? <Text>{t('account.signOutFailed')}</Text> : null}
        <UniversalButtonContent
          variant="link"
          label={t('common.home')}
          onPress={() => router.replace('/')}
        />
      </Column>
    </AuthScreenFrame>
  );
}
