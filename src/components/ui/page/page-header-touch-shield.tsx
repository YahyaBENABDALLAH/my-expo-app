import { useContext, type ContextType } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { PageWaveContext } from './page-wave-context';

const claimTouch = () => true;
const keepTouch = () => false;
const shieldStyle = { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 } as const;
const shieldProps = {
  testID: 'page-header-touch-shield',
  collapsable: false,
  pointerEvents: 'box-only' as const,
  accessible: false,
  accessibilityElementsHidden: true,
  importantForAccessibility: 'no-hide-descendants' as const,
  onStartShouldSetResponder: claimTouch,
  onMoveShouldSetResponder: claimTouch,
  onResponderTerminationRequest: keepTouch,
};

/** Intercepts covered content without reserving space or covering the back control. */
export function PageHeaderTouchShield({ height }: { height: number }) {
  const wave = useContext(PageWaveContext);
  return wave ? (
    <WaveTouchShield height={height} wave={wave} />
  ) : (
    <View {...shieldProps} style={{ ...shieldStyle, height }} />
  );
}

function WaveTouchShield({
  height,
  wave,
}: {
  height: number;
  wave: NonNullable<ContextType<typeof PageWaveContext>>;
}) {
  const { fit, waveHeight } = wave;
  const animatedStyle = useAnimatedStyle(() => ({
    height: Math.max(height, (fit.get()[1].translateY ?? 0) + waveHeight),
  }));

  return <Animated.View {...shieldProps} style={[shieldStyle, animatedStyle]} />;
}
