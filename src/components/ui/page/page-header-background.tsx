import { useContext, useEffect, useState, type RefObject } from 'react';
import { BlurView } from 'expo-blur';
import { AccessibilityInfo, Platform, View } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';
import { PageWaveContext } from './page-wave-context';
import { PageWaveSurface } from './page-wave-surface';

/** Native backdrop only; the title and back control remain above the blur. */
export function PageHeaderBackground({
  blurTarget,
  colorScheme,
  height = 0,
}: {
  blurTarget: RefObject<View | null>;
  colorScheme?: 'light' | 'dark';
  height?: number;
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

  if (!wave) {
    const style = { position: 'absolute' as const, top: 0, left: 0, right: 0, height };
    return reduceTransparency ? (
      <View
        testID="page-header-solid-background"
        pointerEvents="none"
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ ...style, backgroundColor: colors.background }}
      />
    ) : (
      <BlurView
        testID="page-header-blur"
        pointerEvents="none"
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        blurTarget={blurTarget}
        blurMethod="dimezisBlurViewSdk31Plus"
        tint={scheme === 'dark' ? 'dark' : 'extraLight'}
        intensity={40}
        style={style}
      />
    );
  }

  return (
    <PageWaveSurface
      wave={wave}
      blurTarget={blurTarget}
      colorScheme={scheme}
      backgroundColor={colors.background}
      reduceTransparency={reduceTransparency}
    />
  );
}
