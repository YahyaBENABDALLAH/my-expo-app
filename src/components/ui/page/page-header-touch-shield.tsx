import { useContext } from 'react';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { PageWaveContext } from './page-wave-context';

const claimTouch = () => true;
const keepTouch = () => false;

/** Intercepts covered content without reserving space or covering the back control. */
export function PageHeaderTouchShield({ height }: { height: number }) {
  const wave = useContext(PageWaveContext);
  const fit = wave?.fit;
  const waveHeight = wave?.waveHeight ?? 0;
  const hasWave = wave !== null;
  const animatedStyle = useAnimatedStyle(() => ({
    height: Math.max(height, hasWave ? (fit?.get()[1].translateY ?? 0) + waveHeight : 0),
  }));

  return (
    <Animated.View
      testID="page-header-touch-shield"
      collapsable={false}
      pointerEvents="box-only"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      onStartShouldSetResponder={claimTouch}
      onMoveShouldSetResponder={claimTouch}
      onResponderTerminationRequest={keepTouch}
      style={[{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }, animatedStyle]}
    />
  );
}
