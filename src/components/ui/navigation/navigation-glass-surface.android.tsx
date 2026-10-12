import { useThemeColors } from '@/hooks/use-theme';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import type { NavigationGlassSurfaceProps } from './navigation-glass-surface.types';

export function NavigationGlassSurface({ colorScheme }: NavigationGlassSurfaceProps) {
  const colors = useThemeColors(colorScheme);
  return (
    <View style={{ flex: 1, overflow: 'hidden' }}>
      {/* The backdrop is already a smooth gradient; blurring it adds a render pass. */}
      <LinearGradient
        colors={[colors.background, colors.tabBarGlassBackdrop, colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={[
          colors.tabBarGlassHighlight,
          colors.tabBarGlassMidHighlight,
          colors.tabBarGlassClear,
        ]}
        locations={[0, 0.45, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
