import { useTranslation } from 'react-i18next';
import {
  BottomSheet,
  Column,
  UniversalButtonContent,
  UniversalTextContent as Text,
  PageScreen,
  LanguagePicker,
} from '@components/ui';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/context/auth.context';

import { useTabActions } from '@/features/pages/tab-actions';

export default function MoreScreen() {
  const { t } = useTranslation();
  const { user, signOut, developmentGuest } = useAuthContext();
  const { setAction } = useTabActions();
  const [profile, setProfile] = useState(false);
  const logout = useMutation({ mutationFn: signOut, networkMode: 'always', retry: 0 });
  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.userName ||
    (developmentGuest ? t('tools.guest') : t('common.account'));
  useEffect(() => {
    setAction('more', {
      kind: 'profile',
      label: t('account.openPreferences'),
      onPress: () => setProfile(true),
    });
    return () => setAction('more', undefined);
  }, [setAction, t]);
  return (
    <PageScreen
      title={t('common.more')}
      description={t('account.moreDescription')}
      tab
      actions={[
        {
          label: t('tools.browsePages'),
          testID: 'page-action-browse-all-pages',
          href: '/development-pages',
        },
        { label: t('common.account'), testID: 'page-action-account', href: '/account' },
        ...(user?.isChef === false
          ? [
              {
                label: t('chefProfile.heroTitle'),
                testID: 'page-action-become-a-chef',
                href: '/become-chef' as const,
              },
            ]
          : []),
        { label: t('common.ingredients'), testID: 'page-action-ingredients', href: '/ingredients' },
        {
          label: t('tools.deviceInfo'),
          testID: 'page-action-device-information',
          href: '/device-info',
        },
        {
          label: t('common.healthCheck'),
          testID: 'page-action-health-check',
          href: '/health-check',
        },
      ]}
    >
      <Text variant="title">{fullName}</Text>
      <Text>{user?.email ?? ''}</Text>
      <UniversalButtonContent
        variant="secondary"
        label={t('profile.preferences')}
        testID="more-profile"
        onPress={() => setProfile(true)}
      />
      <UniversalButtonContent
        variant="destructive"
        label={
          logout.isPending
            ? t('account.signingOut')
            : developmentGuest
              ? t('tools.exitGuest')
              : t('common.signOut')
        }
        testID="more-sign-out"
        disabled={logout.isPending}
        onPress={() => logout.mutate()}
      />
      {logout.error ? <Text>{t('account.signOutFailed')}</Text> : null}
      <BottomSheet isPresented={profile} onDismiss={() => setProfile(false)}>
        <Column spacing={16} style={{ padding: 24 }}>
          <Text variant="title" testID="profile-preferences-title">
            {t('profile.title')}
          </Text>
          <Text>{fullName}</Text>
          <Text>{user?.userName ?? user?.email ?? ''}</Text>
          <Text variant="caption">{t('common.language')}</Text>
          <LanguagePicker testID="profile-language-picker" />
          <UniversalButtonContent
            variant="secondary"
            label={t('account.details')}
            onPress={() => {
              setProfile(false);
              router.push('/account');
            }}
          />
          <UniversalButtonContent
            variant="primary"
            label={t('common.done')}
            testID="profile-preferences-done"
            onPress={() => setProfile(false)}
          />
        </Column>
      </BottomSheet>
    </PageScreen>
  );
}
