import { useTranslation } from 'react-i18next';
import {
  OtpBottomSheet,
  PageScreen,
  PageSection,
  UniversalButtonContent,
  UniversalTextContent,
} from '@components/ui';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { lookupOptions, recipeListOptions } from '@/features/recipes/queries';
import { useAuthContext } from '@/context/auth.context';
import { appDevEnabled } from '@/constants/app-dev';

import { useScreenRefresh } from '@/hooks/use-screen-refresh';
import { componentPages } from '@/features/ui-showcase/catalog';
export function HealthCheckScreen() {
  const { t } = useTranslation();
  return (
    <PageScreen
      title={t('common.healthCheck')}
      description={t('tools.healthDescription')}
      tab={false}
      actions={[
        {
          label: t('tools.deviceInfo'),
          testID: 'page-action-device-information',
          href: '/device-info',
        },
      ]}
    />
  );
}

export function UiShowcaseScreen() {
  const { t } = useTranslation();
  return (
    <PageScreen
      title={t('tools.showcase')}
      description={t('tools.showcaseDescription')}
      actions={[
        ...componentPages.map(({ name, label, testID }) => ({
          label: t(label),
          testID,
          href: { pathname: '/ui-component/[name]' as const, params: { name } },
        })),
        ...(appDevEnabled
          ? [
              {
                label: t('tools.openStorybook'),
                testID: 'page-action-open-storybook',
                href: '/storybook' as const,
              },
            ]
          : []),
      ]}
    />
  );
}
export function DevelopmentPagesScreen() {
  const { t } = useTranslation();
  const [otpPresented, setOtpPresented] = useState(false);
  const { developmentGuest, exitDevelopmentGuest } = useAuthContext();
  const recipeOptions = recipeListOptions({ pageSize: 1 });
  const categoryOptions = lookupOptions('FoodCategory');
  const recipes = useQuery(recipeOptions);
  const categories = useQuery(categoryOptions);
  const onRefresh = useScreenRefresh([recipeOptions.queryKey, categoryOptions.queryKey]);
  const previewUuid = '00000000-0000-4000-8000-000000000001';
  const recipeUuid = recipes.data?.data[0]?.uuid ?? previewUuid;
  const categoryUuid = categories.data?.data[0]?.uuid ?? previewUuid;
  return (
    <>
      <PageScreen
        title={t('tools.allPages')}
        onRefresh={onRefresh}
        description={developmentGuest ? t('tools.guestDescription') : t('tools.pagesDescription')}
        actions={[
          ...(developmentGuest
            ? ([
                { label: t('auth.login'), testID: 'page-action-login', href: '/login' },
                { label: t('tools.register'), testID: 'page-action-register', href: '/register' },
                {
                  label: t('auth.forgotPassword'),
                  testID: 'page-action-forgot-password',
                  href: '/forgot-password',
                },
                {
                  label: t('auth.resetPasswordTitle'),
                  testID: 'page-action-reset-password',
                  href: '/reset-password',
                },
                {
                  label: t('auth.verifyEmail'),
                  testID: 'page-action-verify-email',
                  href: '/verify-email',
                },
              ] as const)
            : []),
          { label: t('common.home'), testID: 'page-action-home', href: '/' },
          { label: t('common.search'), testID: 'page-action-search', href: '/search' },
          {
            label: t('common.createRecipe'),
            testID: 'page-action-create-recipe',
            href: '/create-recipe',
          },
          { label: t('common.myRecipes'), testID: 'page-action-my-recipes', href: '/recipes' },
          { label: t('common.more'), testID: 'page-action-more', href: '/more' },
          { label: t('settings.title'), testID: 'page-action-app-settings', href: '/settings' },
          { label: t('common.account'), testID: 'page-action-account', href: '/account' },
          {
            label: t('chefProfile.heroTitle'),
            testID: 'page-action-become-a-chef',
            href: '/become-chef',
          },
          {
            label: t('common.likedRecipes'),
            testID: 'page-action-liked-recipes',
            href: {
              pathname: '/my-recipes/liked-favorites',
              params: { tab: t('common.likedOnly') },
            },
          },
          {
            label: t('common.favoritesOnly'),
            testID: 'page-action-favorites',
            href: { pathname: '/my-recipes/liked-favorites', params: { tab: 'favorite' } },
          },
          {
            label: t('common.recipeHistory'),
            testID: 'page-action-history',
            href: '/my-recipes/history',
          },
          {
            label: t('common.myOwnTitle'),
            testID: 'page-action-my-creations',
            href: '/my-recipes/creations',
          },
          {
            label: t('recipes.details'),
            testID: 'page-action-recipe-details',
            href: { pathname: '/recipe/[uuid]', params: { uuid: recipeUuid } },
          },
          {
            label: t('tools.categoryRecipes'),
            testID: 'page-action-category-recipes',
            href: { pathname: '/category/[uuid]', params: { uuid: categoryUuid } },
          },
          {
            label: t('common.ingredients'),
            testID: 'page-action-ingredients',
            href: '/ingredients',
          },
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
          ...(appDevEnabled
            ? ([
                { label: t('tools.showcase'), testID: 'page-action-ui-showcase', href: '/ui' },
                { label: t('tools.storybook'), href: '/storybook' },
                { label: t('tools.skia'), href: '/skia' },
                { label: t('tools.maps'), testID: 'page-action-maps', href: '/maps' },
              ] as const)
            : []),
        ]}
      >
        <PageSection>
          {appDevEnabled && (
            <>
              <UniversalButtonContent
                variant="primary"
                fullWidth
                label={t('otp.openDemo')}
                testID="development-otp-open"
                onPress={() => setOtpPresented(true)}
              />
              <UniversalTextContent variant="caption">{t('otp.demoHint')}</UniversalTextContent>
            </>
          )}
          {developmentGuest && (
            <UniversalButtonContent
              variant="secondary"
              label={t('tools.exitGuest')}
              testID="development-guest-exit"
              onPress={exitDevelopmentGuest}
            />
          )}
        </PageSection>
      </PageScreen>
      {appDevEnabled && (
        <OtpBottomSheet
          isPresented={otpPresented}
          onDismiss={() => setOtpPresented(false)}
          recipient="hello@likan.app"
          hint={t('otp.demoHint')}
          onVerify={async (code) => {
            await new Promise((resolve) => setTimeout(resolve, 650));
            return code === '123456';
          }}
          onResend={async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }}
          testID="development-otp"
        />
      )}
    </>
  );
}
