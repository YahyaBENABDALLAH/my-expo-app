export type FloatingActionKind =
  'create' | 'continue' | 'filters' | 'active-filters' | 'liked' | 'profile' | 'submit';
export type FloatingActionButtonProps = {
  kind: FloatingActionKind;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  colorScheme?: 'light' | 'dark';
};
