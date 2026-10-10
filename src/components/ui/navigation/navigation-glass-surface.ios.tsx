import { useThemeColors } from '@/hooks/use-theme';
import { HStack, Spacer } from '@expo/ui/swift-ui';
import { background, frame, glassEffect, shapes } from '@expo/ui/swift-ui/modifiers';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleSheet, View } from 'react-native';
import { UniversalHost } from '../host/universal-host';
import type { NavigationGlassSurfaceProps } from './navigation-glass-surface.types';

export function NavigationGlassSurface({ colorScheme }: NavigationGlassSurfaceProps) {
  const colors = useThemeColors(colorScheme);
  const liquidGlass = Number.parseInt(String(Platform.Version), 10) >= 26;
  return (
    <View style={{ flex: 1, borderRadius: 28, overflow: 'hidden' }}>
      <UniversalHost
        colorScheme={colorScheme}
        matchContents={false}
        ignoreSafeArea="all"
        style={{ flex: 1 }}
      >
        <HStack
          modifiers={[
            frame({ maxWidth: Infinity, maxHeight: Infinity }),
            liquidGlass
              ? glassEffect({
                  glass: { variant: 'regular', tint: colors.tabBarGlassTint },
                  shape: 'roundedRectangle',
                  cornerRadius: 28,
                })
              : background(
                  { type: 'material', material: 'thin' },
                  shapes.roundedRectangle({ cornerRadius: 28 }),
                ),
          ]}
        >
          <Spacer />
        </HStack>
      </UniversalHost>
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
