export type NavigationTabName = 'index' | 'search' | 'recipes' | 'more';
export type NavigationTabProps = {
  name: NavigationTabName;
  label: string;
  selected: boolean;
  color: string;
  selectedBackgroundColor: string;
  testID: string;
  onPress: () => void;
};
