import { useTranslation } from 'react-i18next';
import { ReferenceNavigationBar } from '@components/ui';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router, useIsFocused, type Tabs } from 'expo-router';
import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { Keyboard } from 'react-native';
import { useTabActions } from './tab-actions';

type BottomTabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

export function ReferenceTabBar({ state, navigation, insets }: BottomTabBarProps) {
  const { t } = useTranslation();
  const scheme = useColorScheme();
  const focused = useIsFocused();
  const activeRoute = state.routes[state.index];
  const { actions } = useTabActions();
  const action = actions[activeRoute.name];
  const lastPress = useRef(0);
  const [keyboardVisible, setKeyboardVisible] = useState(Keyboard.isVisible());
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  const kind =
    action?.kind ??
    (activeRoute.name === 'search'
      ? 'filters'
      : activeRoute.name === 'more'
        ? 'profile'
        : activeRoute.name === 'recipes'
          ? 'liked'
          : activeRoute.name === 'create-recipe'
            ? 'continue'
            : 'create');

  if (keyboardVisible) return null;

  return (
    <ReferenceNavigationBar
      colorScheme={scheme}
      selected={activeRoute.name}
      animate={focused}
      leftInset={insets.left}
      rightInset={insets.right}
      bottomInset={insets.bottom}
      action={{
        kind,
        label:
          action?.label ?? (kind === 'liked' ? t('recipes.openLiked') : t('common.createRecipe')),
        disabled:
          action?.disabled ||
          ((kind === 'filters' || kind === 'active-filters' || kind === 'profile') && !action),
        onPress: () => {
          const now = Date.now();
          if (now - lastPress.current < 800) return;
          lastPress.current = now;
          if (action) action.onPress();
          else router.navigate(kind === 'liked' ? '/my-recipes/liked-favorites' : '/create-recipe');
        },
      }}
      onSelect={(name) => {
        const route = state.routes.find((candidate) => candidate.name === name);
        if (!route) return;
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });
        if (route.key !== activeRoute.key && !event.defaultPrevented)
          navigation.navigate(route.name, route.params);
      }}
    />
  );
}
