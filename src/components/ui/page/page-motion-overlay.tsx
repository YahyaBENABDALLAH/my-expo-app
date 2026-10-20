import { useThemeColors } from '@/hooks/use-theme';
import { Canvas, Group, LinearGradient, Path } from '@shopify/react-native-skia';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { PageWaveContext } from './page-wave-context';
import { PAGE_WAVE_HEIGHT, usePageWaveMotion } from './use-page-wave-motion';
import type { PageHeaderShape } from './page-header-shapes';

export { PAGE_WAVE_HEIGHT } from './use-page-wave-motion';
export type { PageHeaderShape } from './page-header-shapes';

/** Header waves are absolute decoration; their SVG bounds never reserve content space. */
export function PageMotionOverlay({
  animate = true,
  colorScheme,
  variant = 'overlay',
  shape = 'waves',
  expanded = false,
  onCollapseComplete,
  children,
  visible = true,
}: {
  animate?: boolean;
  colorScheme?: 'light' | 'dark';
  variant?: 'overlay' | 'splash';
  shape?: PageHeaderShape;
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
    shape,
    onCollapseComplete,
  });
  const {
    frontWave,
    backWave,
    fit,
    gradientStart,
    gradientEnd,
    frontDrift,
    backDrift,
    width,
    overlayHeight,
  } = motion;
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
                end={gradientEnd}
                colors={splash ? [colors.tint, colors.tabIconSelected] : overlayColors}
              />
            </Path>
          </Group>
          <Group transform={frontDrift}>
            {splash ? <Path path={frontWave} color={colors.background} /> : null}
            <Path path={frontWave} opacity={scheme === 'dark' ? 0.2 : 0.12}>
              <LinearGradient
                start={gradientStart}
                end={gradientEnd}
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
