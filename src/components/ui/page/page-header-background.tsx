import { BlurView } from 'expo-blur';
import { MaskedView } from '@expo/ui/community/masked-view';
import { Canvas, Group, Path } from '@shopify/react-native-skia';
import { useContext, useEffect, useState, type RefObject } from 'react';
import { AccessibilityInfo, Platform, StyleSheet, View } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';
import { PageWaveContext } from './page-wave-context';

/** Native backdrop only; the title and back control remain above the blur. */
export function PageHeaderBackground({
  blurTarget,
  colorScheme,
}: {
  blurTarget: RefObject<View | null>;
  colorScheme?: 'light' | 'dark';
}) {
  const scheme = useHostColorScheme(colorScheme);
  const colors = useThemeColors(scheme);
  const wave = useContext(PageWaveContext);
  const [reduceTransparency, setReduceTransparency] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    let active = true;
    let changed = false;
    const update = (value: boolean) => {
      changed = true;
      if (active) setReduceTransparency(value);
    };
    const subscription = AccessibilityInfo.addEventListener('reduceTransparencyChanged', update);
    void AccessibilityInfo.isReduceTransparencyEnabled()
      .then((value) => {
        if (active && !changed) setReduceTransparency(value);
      })
      .catch(() => {});
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  if (!wave) return null;

  return (
    <MaskedView
      testID="page-wave-blur-mask"
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, height: wave.overlayHeight }}
      maskElement={
        <Canvas pointerEvents="none" style={{ flex: 1 }}>
          <Group transform={wave.fit}>
            <Group transform={wave.backDrift}>
              <Path path={wave.backWave} color="black" />
            </Group>
            <Group transform={wave.frontDrift}>
              <Path path={wave.frontWave} color="black" />
            </Group>
          </Group>
        </Canvas>
      }
    >
      {reduceTransparency ? (
        <View
          pointerEvents="none"
          testID="page-header-solid-background"
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]}
        />
      ) : (
        <BlurView
          testID="page-header-blur"
          pointerEvents="none"
          blurTarget={blurTarget}
          blurMethod="dimezisBlurViewSdk31Plus"
          // Android's thin-material preset paints gray over the blur. Keep the tint neutral and light.
          tint={scheme === 'dark' ? 'dark' : 'extraLight'}
          intensity={40}
          style={StyleSheet.absoluteFill}
        />
      )}
    </MaskedView>
  );
}
