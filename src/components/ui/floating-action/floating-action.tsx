import { useThemeColors } from '@/hooks/use-theme';
import { Icon, type IconName } from '@expo/ui';
import * as Haptics from 'expo-haptics';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { NativeFloatingActionButton } from './floating-action-button';

export type FloatingActionKind =
  'create' | 'continue' | 'filters' | 'active-filters' | 'liked' | 'profile' | 'submit';

export type FloatingActionButtonProps = {
  kind: FloatingActionKind;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  colorScheme?: 'light' | 'dark';
  testID?: string;
};

const filters = Icon.select({
  ios: 'slider.horizontal.3',
  android: require('@expo/material-symbols/tune.xml'),
});

const floatingActionIcons = {
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

/** Circular native content; reuse the existing Host. */
export function FloatingActionButton({
  kind,
  label,
  onPress,
  disabled,
  colorScheme,
  testID = 'tab-context-action',
}: FloatingActionButtonProps) {
  const colors = useThemeColors(useHostColorScheme(colorScheme));
  return (
    <NativeFloatingActionButton
      testID={testID}
      label={label}
      onPress={onPress}
      disabled={disabled}
      color={disabled ? colors.controlDisabledSurface : colors.primary}
    >
      <Icon
        name={floatingActionIcons[kind]}
        size={28}
        color={disabled ? colors.controlDisabledContent : colors.onPrimary}
      />
    </NativeFloatingActionButton>
  );
}

/** Standalone circle for a React Native boundary. */
export function FloatingAction(props: FloatingActionButtonProps) {
  return (
    <UniversalHost
      colorScheme={props.colorScheme}
      matchContents={false}
      ignoreSafeArea="all"
      style={{ width: 76, height: 76 }}
    >
      <FloatingActionButton
        {...props}
        onPress={() => {
          if (props.disabled) return;
          if (process.env.EXPO_OS === 'android') {
            void Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Context_Click).catch(
              () => {},
            );
          } else {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
          }
          props.onPress();
        }}
      />
    </UniversalHost>
  );
}
