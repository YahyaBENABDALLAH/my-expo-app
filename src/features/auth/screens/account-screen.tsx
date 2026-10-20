import { spacing } from '@/constants/layout';
import { useTranslation } from 'react-i18next';
import {
  Column,
  nativeFillWidth,
  AuthScreenFrame,
  AuthText,
  UniversalButtonContent,
} from '@components/ui';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useScreenRefresh } from '@/hooks/use-screen-refresh';
import { useAuthContext } from '@/context/auth.context';
import { currentIdentityQuery } from '@/services/auth/auth.queries';

export function AccountScreen() {
  const { t } = useTranslation();
  const { user, signOut, developmentGuest } = useAuthContext();
  const options = currentIdentityQuery(user?.uuid);
  const identity = useQuery(options);
  const onRefresh = useScreenRefresh([options.queryKey]);
  const logout = useMutation({ mutationFn: signOut, networkMode: 'always', retry: 0 });
  const signOutLabel = developmentGuest ? t('tools.exitGuest') : t('common.signOut');
  const name = identity.data
    ? `${identity.data.firstName} ${identity.data.lastName}`.trim()
    : `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
  return (
    <AuthScreenFrame
      testID="auth-account"
      onRefresh={user?.uuid && !logout.isPending ? onRefresh : undefined}
      title={developmentGuest ? t('tools.guest') : name || t('common.account')}
      description={developmentGuest ? t('account.guestDescription') : t('account.signedIn')}
      tab
    >
      <Column spacing={spacing.lg} modifiers={nativeFillWidth}>
        <AuthText>{identity.data?.email ?? user?.email ?? ''}</AuthText>
        {identity.isLoading ? <AuthText>{t('account.loadingProfile')}</AuthText> : null}
        {identity.fetchStatus === 'paused' ? <AuthText>{t('account.offline')}</AuthText> : null}
        {identity.error ? (
          <>
            <AuthText>{t('account.refreshFailed')}</AuthText>
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
        {logout.error ? <AuthText>{t('account.signOutFailed')}</AuthText> : null}
      </Column>
    </AuthScreenFrame>
  );
}
