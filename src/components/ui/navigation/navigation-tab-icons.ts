import { Icon } from '@expo/ui';
import type { NavigationTabName } from './navigation-tab.types';

const symbols = {
  index: Icon.select({ ios: 'house', android: require('@expo/material-symbols/home.xml') }),
  search: Icon.select({
    ios: 'magnifyingglass',
    android: require('@expo/material-symbols/search.xml'),
  }),
  recipes: Icon.select({ ios: 'book', android: require('@expo/material-symbols/menu_book.xml') }),
  more: Icon.select({
    ios: 'line.3.horizontal',
    android: require('@expo/material-symbols/menu.xml'),
  }),
};
const selectedHome = Icon.select({
  ios: 'house.fill',
  android: require('@expo/material-symbols/home.xml'),
});

export function navigationTabIcon(name: NavigationTabName, selected: boolean) {
  return name === 'index' && selected ? selectedHome : symbols[name];
}

export function navigationTabIconSize(name: NavigationTabName) {
  return name === 'index' ? 22 : 21;
}
