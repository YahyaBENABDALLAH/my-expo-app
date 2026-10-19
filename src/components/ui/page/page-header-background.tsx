import { useContext, useEffect, useState, type RefObject } from 'react';
import { AccessibilityInfo, Platform, type View } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';
import { PageWaveContext } from './page-wave-context';
import { PageWaveSurface } from './page-wave-surface';

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
    <PageWaveSurface
      wave={wave}
      blurTarget={blurTarget}
      colorScheme={scheme}
      backgroundColor={colors.background}
      reduceTransparency={reduceTransparency}
    />
  );
}
