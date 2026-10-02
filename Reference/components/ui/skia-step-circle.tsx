import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  Canvas,
  Circle,
  Group,
  Path,
  Shadow,
  Skia,
} from "@shopify/react-native-skia";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// ── Skia Step Indicator Circle ───────────────────────────────────
interface SkiaStepCircleProps {
  animate?: boolean;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  isValid?: boolean;
}

export function SkiaStepCircle({
  animate = true,
  index,
  isActive,
  isCompleted,
  isValid = false,
}: SkiaStepCircleProps) {
  const colorScheme = useColorScheme();
  const reduceMotion = useReducedMotion();
  const animationsEnabled = animate && !reduceMotion;
  const isDark = colorScheme === "dark";

  const activeColor = "#006fee";
  const cardColor = isDark ? "#18181b" : "#FFFFFF";
  const borderColor = isDark ? "#27272a" : "#e4e4e7";

  // Shared values for transitions
  const activeProgress = useSharedValue(isActive ? 1 : 0);
  const completedProgress = useSharedValue(isCompleted ? 1 : 0);
  const isValidProgress = useSharedValue(isValid ? 1 : 0);
  const pulseValue = useSharedValue(0);
  const breatheValue = useSharedValue(0);
  const completedScale = useSharedValue(1);
  const wavePhase = useSharedValue(0);

  // Sync state transitions with spring/timing
  useEffect(() => {
    cancelAnimation(activeProgress);
    cancelAnimation(completedProgress);
    cancelAnimation(isValidProgress);
    const transition = (target: number) =>
      animationsEnabled
        ? withSpring(target, {
            damping: 15,
            stiffness: 120,
          })
        : target;
    activeProgress.value = transition(isActive ? 1 : 0);
    completedProgress.value = transition(isCompleted ? 1 : 0);
    isValidProgress.value = transition(isValid ? 1 : 0);
  }, [
    isActive,
    isCompleted,
    isValid,
    activeProgress,
    completedProgress,
    isValidProgress,
    animationsEnabled,
  ]);

  // Sync active step animations (breathing, pulsing, and waving)
  useEffect(() => {
    cancelAnimation(pulseValue);
    cancelAnimation(breatheValue);
    cancelAnimation(wavePhase);

    if (isActive && animationsEnabled) {
      pulseValue.value = withRepeat(
        withTiming(1, {
          duration: 1500,
          easing: Easing.out(Easing.ease),
        }),
        -1,
        false,
      );
      breatheValue.value = withRepeat(
        withTiming(1, {
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true,
      );
      wavePhase.value = withRepeat(
        withTiming(2 * Math.PI, {
          duration: 1500,
          easing: Easing.linear,
        }),
        -1,
        false,
      );
    } else {
      pulseValue.value = 0;
      breatheValue.value = 0;
      wavePhase.value = 0;
    }

    return () => {
      cancelAnimation(pulseValue);
      cancelAnimation(breatheValue);
      cancelAnimation(wavePhase);
    };
  }, [animationsEnabled, isActive, pulseValue, breatheValue, wavePhase]);

  // Trigger a satisfying "pop" spring animation when step gets completed
  useEffect(() => {
    cancelAnimation(completedScale);
    if (isCompleted && animationsEnabled) {
      completedScale.value = withSequence(
        withTiming(1.25, { duration: 150 }),
        withSpring(1.0, { damping: 10, stiffness: 140 }),
      );
    } else {
      completedScale.value = 1;
    }

    return () => cancelAnimation(completedScale);
  }, [animationsEnabled, isCompleted, completedScale]);

  // Derived styles for Skia shapes
  const strokeColor = useDerivedValue(() => {
    const targetBorderProgress = Math.max(
      activeProgress.value,
      completedProgress.value,
    );
    return interpolateColor(
      targetBorderProgress,
      [0, 1],
      [borderColor, activeColor],
    );
  });

  const baseRadius = useDerivedValue(() => {
    // Inactive/completed = 20, active = 26
    const targetBase = 20 + activeProgress.value * 6;
    const breathing = breatheValue.value * 1.5;
    return (targetBase + breathing) * completedScale.value;
  });

  const pulseRadius = useDerivedValue(() => {
    return baseRadius.value + pulseValue.value * 12;
  });

  const pulseOpacity = useDerivedValue(() => {
    // Disable pulsing completely when step is inactive or completed (activeProgress is 0)
    return (1 - pulseValue.value) * 0.8 * activeProgress.value;
  });

  const liquidLevelY = useDerivedValue(() => {
    const r = baseRadius.value;
    const activeVal = activeProgress.value;
    const completedVal = completedProgress.value;
    const validVal = isValidProgress.value;

    const targetFill = Math.max(
      completedVal,
      activeVal * (0.15 + validVal * 0.6),
    );

    return 50 + r - targetFill * (2 * r + 2);
  });

  const wavePath = useDerivedValue(() => {
    const builder = Skia.PathBuilder.Make();
    if (!builder) return Skia.Path.Circle(0, 0, 0);

    const r = baseRadius.value;
    const startX = 50 - r;
    const endX = 50 + r;
    const levelY = liquidLevelY.value;

    builder.moveTo(startX, 50 + r);
    const activeVal = activeProgress.value;
    const completedVal = completedProgress.value;
    const amplitude = 2.5 * activeVal * (1 - completedVal);

    // Optimized step size (3.0 instead of 1.5) reduces iterations by 50% per frame
    for (let x = startX; x <= endX; x += 3.0) {
      const waveHeight =
        Math.sin((x - startX) * 0.2 + wavePhase.value) * amplitude;
      builder.lineTo(x, levelY + waveHeight);
    }
    builder.lineTo(endX, 50 + r);
    builder.close();
    return builder.build();
  });

  const clipPath = useDerivedValue(() => {
    return Skia.Path.Circle(50, 50, baseRadius.value);
  });

  const shadowDy = useDerivedValue(() => {
    return 2 + activeProgress.value * 3.5;
  });

  const shadowBlur = useDerivedValue(() => {
    return 4 + activeProgress.value * 7;
  });

  const shadowColor = useDerivedValue(() => {
    const activeVal = activeProgress.value;
    if (isDark) {
      const alpha = 0.45 + activeVal * 0.25;
      return `rgba(0, 0, 0, ${alpha})`;
    } else {
      const r = Math.round(0 * (1 - activeVal) + 0 * activeVal);
      const g = Math.round(0 * (1 - activeVal) + 111 * activeVal);
      const b = Math.round(0 * (1 - activeVal) + 238 * activeVal);
      const a = 0.08 * (1 - activeVal) + 0.25 * activeVal;
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const scale = isCompleted
      ? completedScale.value
      : isActive
        ? 1.2 + breatheValue.value * 0.05
        : 1;

    const textColor = isCompleted
      ? "#FFFFFF"
      : isActive
        ? interpolateColor(
            isValidProgress.value,
            [0, 1],
            [activeColor, "#FFFFFF"],
          )
        : isDark
          ? "rgba(255, 255, 255, 0.35)"
          : "rgba(0, 0, 0, 0.3)";

    return {
      transform: [{ scale }],
      color: textColor,
    };
  });

  return (
    <View
      style={{
        width: 60,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Canvas
        style={{
          position: "absolute",
          width: 100,
          height: 100,
          top: -20,
          left: -20,
        }}
      >
        <Circle
          cx={50}
          cy={50}
          r={pulseRadius}
          color={activeColor}
          opacity={pulseOpacity}
          style="stroke"
          strokeWidth={1.5}
        />
        <Group>
          <Shadow dx={0} dy={shadowDy} blur={shadowBlur} color={shadowColor} />
          <Group clip={clipPath}>
            <Circle cx={50} cy={50} r={baseRadius} color={cardColor} />
            <Path path={wavePath} color={activeColor} />
          </Group>
          <Circle
            cx={50}
            cy={50}
            r={baseRadius}
            color={strokeColor}
            style="stroke"
            strokeWidth={2.5}
          />
        </Group>
      </Canvas>
      <View
        style={{
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Animated.Text
          style={[
            textAnimatedStyle,
            { fontSize: 16, fontWeight: isActive ? "800" : "700" },
          ]}
        >
          {index + 1}
        </Animated.Text>
      </View>
    </View>
  );
}
