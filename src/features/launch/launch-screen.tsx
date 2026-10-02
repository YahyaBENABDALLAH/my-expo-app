import { Canvas, Path } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import LottieView from 'lottie-react-native';
import { Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import bluePepe from '@assets/animations/blue-pepe.lottie';
import { AuroraBackground } from '@/components/visuals/aurora-background';

const WAVE_HEIGHT = 144;
const EXIT_DURATION_MS = 3000;
// LottieView accepts Metro's numeric asset ID on native, though its source type omits it.
const bluePepeSource = bluePepe as unknown as string;

export function LaunchScreen({
  exiting,
  onExitComplete,
}: {
  exiting: boolean;
  onExitComplete: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const { width, height } = useWindowDimensions();
  const offsetY = useSharedValue(0);

  useEffect(() => {
    if (!exiting) return;

    if (reducedMotion) {
      onExitComplete();
      return;
    }

    offsetY.set(
      withTiming(
        -(height + WAVE_HEIGHT),
        { duration: EXIT_DURATION_MS, easing: Easing.bezier(0.23, 1, 0.32, 1) },
        (finished) => {
          if (finished) scheduleOnRN(onExitComplete);
        },
      ),
    );
  }, [exiting, height, offsetY, onExitComplete, reducedMotion]);

  const exitStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offsetY.get() }],
  }));

  return (
    <Animated.View
      testID="app-brand-screen"
      accessible
      accessibilityLabel="Likan is loading"
      pointerEvents={exiting ? 'none' : 'auto'}
      style={[
        {
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          height: height + WAVE_HEIGHT,
        },
        exitStyle,
      ]}
    >
      <View
        style={{
          height,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#081224',
        }}
      >
        <AuroraBackground style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }} />
        <LottieView
          source={bluePepeSource}
          autoPlay={!reducedMotion}
          loop={!reducedMotion}
          style={{ width: 260, height: 260 }}
          webStyle={{ width: 260, height: 260 }}
        />
        <Text style={{ color: '#DBEDF4', fontFamily: 'Inter-Black', fontSize: 28, marginTop: 16 }}>
          Likan
        </Text>
      </View>
      <Canvas style={{ width, height: WAVE_HEIGHT }}>
        <Path path={`M 0 0 H ${width} V 34 Q ${width / 2} 178 0 34 Z`} color="#0E5B67" />
        <Path path={`M 0 0 H ${width} V 20 Q ${width / 2} 150 0 20 Z`} color="#081224" />
      </Canvas>
    </Animated.View>
  );
}
