import { Icon, type IconName } from '@expo/ui';
import type { FloatingActionKind } from './floating-action-button.types';

const filters = Icon.select({
  ios: 'slider.horizontal.3',
  android: require('@expo/material-symbols/tune.xml'),
});

export const floatingActionIcons = {
  create: Icon.select({
    ios: 'fork.knife',
    android: require('@expo/material-symbols/fork_spoon.xml'),
  }),
  continue: Icon.select({ ios: 'plus', android: require('@expo/material-symbols/add.xml') }),
  filters,
  'active-filters': filters,
  liked: Icon.select({
    ios: 'heart.fill',
    android: require('@expo/material-symbols/favorite.xml'),
  }),
  profile: Icon.select({
    ios: 'fork.knife',
    android: require('@expo/material-symbols/chef_hat.xml'),
  }),
  submit: Icon.select({ ios: 'checkmark', android: require('@expo/material-symbols/check.xml') }),
} satisfies Record<FloatingActionKind, IconName>;

export const FLOATING_ACTION_ICON_SIZE = 28;
