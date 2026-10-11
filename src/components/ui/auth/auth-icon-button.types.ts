import type { IconName } from '@expo/ui';

export interface AuthIconButtonProps {
  icon: IconName;
  color: string;
  accessibilityLabel: string;
  testID: string;
  disabled?: boolean;
  onPress: () => void;
}
