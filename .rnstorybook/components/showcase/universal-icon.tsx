import { Icon, type IconProps } from '@expo/ui';
import { useThemeColors } from '@/hooks/use-theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { UniversalHost, type UniversalThemeProps } from '@components/ui';

const icons = {
  favorite: Icon.select({
    ios: 'heart.fill',
    android: require('@expo/material-symbols/favorite.xml'),
  }),
  star: Icon.select({ ios: 'star.fill', android: require('@expo/material-symbols/star.xml') }),
  settings: Icon.select({
    ios: 'gearshape.fill',
    android: require('@expo/material-symbols/settings.xml'),
  }),
  notifications: Icon.select({
    ios: 'bell.fill',
    android: require('@expo/material-symbols/notifications.xml'),
  }),
  home: Icon.select({ ios: 'house.fill', android: require('@expo/material-symbols/home.xml') }),
};

export type UniversalIconProps = Omit<IconProps, 'name'> &
  UniversalThemeProps & { icon?: keyof typeof icons };

export function UniversalIcon({
  colorScheme,
  seedColor,
  icon = 'favorite',
  color,
  disabled,
  onPress,
  ...props
}: UniversalIconProps) {
  const scheme = useColorScheme(colorScheme);
  const colors = useThemeColors(scheme);
  return (
    <UniversalHost
      testID={props.testID ? `${props.testID}-container` : undefined}
      inline
      colorScheme={scheme}
      seedColor={seedColor}
    >
      <Icon
        {...props}
        name={icons[icon]}
        color={color ?? colors.text}
        disabled={disabled}
        onPress={disabled ? undefined : onPress}
      />
    </UniversalHost>
  );
}
