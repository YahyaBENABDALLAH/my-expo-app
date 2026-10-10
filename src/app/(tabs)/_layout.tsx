import { useTranslation } from 'react-i18next';
import { ReferenceTabBar } from '@/features/pages/reference-tab-bar';
import { Tabs } from 'expo-router';

import { TabActionsProvider } from '@/features/pages/tab-actions';

export const unstable_settings = { initialRouteName: 'index' };

export default function TabLayout() {
  const { t } = useTranslation();
  return (
    <TabActionsProvider>
      <Tabs
        tabBar={(props) => <ReferenceTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          animation: 'none',
          sceneStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Tabs.Screen name="index" options={{ title: t('common.home') }} />
        <Tabs.Screen name="search" options={{ title: t('common.search') }} />
        <Tabs.Screen name="create-recipe" options={{ title: t('common.create'), href: null }} />
        <Tabs.Screen name="recipes" options={{ title: t('common.myRecipes') }} />
        <Tabs.Screen name="more" options={{ title: t('common.more') }} />
        <Tabs.Screen name="account" options={{ href: null }} />
        <Tabs.Screen name="skia" options={{ href: null }} />
        <Tabs.Screen name="maps" options={{ href: null }} />
        <Tabs.Screen name="storybook" options={{ href: null }} />
      </Tabs>
    </TabActionsProvider>
  );
}
