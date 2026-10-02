import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TAB_BAR_CONTENT_HEIGHT } from '@/constants/layout';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      detachInactiveScreens={false}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.65)',
        tabBarStyle: {
          position: 'absolute',
          height: TAB_BAR_CONTENT_HEIGHT + insets.bottom,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="skia"
        options={{
          title: 'Skia',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'sparkles',
                android: 'auto_awesome',
                web: 'auto_awesome',
              }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="maps"
        options={{
          title: 'Maps',
          tabBarActiveTintColor: '#173C35',
          tabBarInactiveTintColor: '#53736B',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'map', android: 'map', web: 'map' }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          headerShown: true,
          headerTitle: 'Log in',
          headerTransparent: true,
          headerShadowVisible: false,
          tabBarButtonTestID: 'tab-account',
          tabBarActiveTintColor: '#5AB9E8',
          tabBarInactiveTintColor: '#8298AD',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'person.crop.circle', android: 'account_circle' }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="storybook"
        options={{
          title: 'Storybook',
          href: __DEV__ ? undefined : null,
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'book.closed', android: 'menu_book', web: 'menu_book' }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
    </Tabs>
  );
}
