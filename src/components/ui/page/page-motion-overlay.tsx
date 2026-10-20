import { useThemeColors } from '@/hooks/use-theme';
import { Canvas, Group, LinearGradient, Path, vec } from '@shopify/react-native-skia';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { PageWaveContext } from './page-wave-context';
import { PAGE_WAVE_HEIGHT, usePageWaveMotion } from './use-page-wave-motion';

export { PAGE_WAVE_HEIGHT } from './use-page-wave-motion';

/** Shared wave artwork for the page header and the splash's moving bottom edge. */
export function PageMotionOverlay({
  animate = true,
  colorScheme,
  variant = 'overlay',
  expanded = false,
  onCollapseComplete,
  children,
  visible = true,
}: {
  animate?: boolean;
  colorScheme?: 'light' | 'dark';
  variant?: 'overlay' | 'splash';
  expanded?: boolean;
  onCollapseComplete?: () => void;
  children?: ReactNode;
  visible?: boolean;
}) {
  const scheme = useColorScheme(colorScheme);
  const colors = useThemeColors(scheme);
  const splash = variant === 'splash';
  const motion = usePageWaveMotion({
    animate: animate && visible,
    expanded,
    splash,
    onCollapseComplete,
  });
  const { frontWave, backWave, fit, gradientStart, frontDrift, backDrift, width, overlayHeight } =
    motion;
  const overlayBackOpacity = scheme === 'dark' ? 0.12 : 0.08;
  const overlayColors = [colors.tint, `${colors.tint}CC`];

  const artwork = visible ? (
    <View
      testID={splash ? 'launch-wave-edge' : 'page-motion-overlay'}
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      collapsable={false}
      onLayout={({ nativeEvent }) => width.set(nativeEvent.layout.width)}
      style={
        splash
          ? { height: PAGE_WAVE_HEIGHT }
          : {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: overlayHeight,
            }
      }
    >
      <Canvas pointerEvents="none" style={{ flex: 1 }}>
        <Group transform={fit}>
          <Group transform={backDrift}>
            <Path path={backWave} opacity={splash ? 1 : overlayBackOpacity}>
              <LinearGradient
                start={gradientStart}
                end={vec(0, 0)}
                colors={splash ? [colors.tint, colors.tabIconSelected] : overlayColors}
              />
            </Path>
          </Group>
          <Group transform={frontDrift}>
            {splash ? <Path path={frontWave} color={colors.background} /> : null}
            <Path path={frontWave} opacity={scheme === 'dark' ? 0.2 : 0.12}>
              <LinearGradient
                start={gradientStart}
                end={vec(0, 0)}
                colors={splash ? [colors.tint, `${colors.tint}00`] : overlayColors}
              />
            </Path>
            <Path
              path={frontWave}
              color={colors.tint}
              opacity={scheme === 'dark' ? 0.22 : 0.12}
              style="stroke"
              strokeWidth={2}
            />
          </Group>
        </Group>
      </Canvas>
    </View>
  ) : null;

  return (
    <PageWaveContext.Provider value={visible && !splash ? motion : null}>
      {children !== undefined ? (
        <View style={{ flex: 1 }}>
          {children}
          {artwork}
        </View>
      ) : (
        artwork
      )}
    </PageWaveContext.Provider>
  );
}
