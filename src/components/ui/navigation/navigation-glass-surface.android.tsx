import { useThemeColors } from '@/hooks/use-theme';
import { BlurTargetView, BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NavigationGlassSurfaceProps } from './navigation-glass-surface.types';

export function NavigationGlassSurface({ colorScheme }: NavigationGlassSurfaceProps) {
  const colors = useThemeColors(colorScheme);
  const backdrop = useRef<View>(null);
  return (
    <View style={{ flex: 1, overflow: 'hidden' }}>
      {/* The target contains only the dock's tonal backdrop, never the blur
          or native controls themselves. The bar keeps its normal-flow layout. */}
      <BlurTargetView ref={backdrop} style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={[colors.background, colors.tabBarGlassBackdrop, colors.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </BlurTargetView>
      <BlurView
        blurTarget={backdrop}
        blurMethod="dimezisBlurViewSdk31Plus"
        tint={colorScheme}
        intensity={60}
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
