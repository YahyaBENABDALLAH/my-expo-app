import type { EdgeInsets } from 'react-native-safe-area-context';

/** Navigators own their visible header/bar edges; content always owns side cutouts. */
export function screenInsets(
  insets: EdgeInsets,
  { headerShown = false, tabBarShown = false } = {},
) {
  return {
    paddingTop: headerShown ? 0 : insets.top,
    paddingBottom: tabBarShown ? 0 : insets.bottom,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };
}
