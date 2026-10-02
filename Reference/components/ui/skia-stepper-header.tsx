import { Text } from "@/components/Universal/text";
import { SkiaStepCircle } from "@/components/ui/skia-step-circle";
import { useTheme } from "@/context/theme.context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
    Canvas,
    LinearGradient,
    Path,
    Skia,
    vec,
} from "@shopify/react-native-skia";
import { useIsFocused } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import {
    cancelAnimation,
    Easing,
    useDerivedValue,
    useReducedMotion,
    useSharedValue,
    withRepeat,
    withSpring,
    withTiming,
} from "react-native-reanimated";

// ── Reusable Skia Stepper Header Component ─────────────────────────────
interface StepperStep {
  id: string;
  title: string;
  isValid?: boolean;
}

interface SkiaStepperHeaderProps {
  steps: readonly StepperStep[];
  currentIndex: number;
}

export function SkiaStepperHeader({
  steps,
  currentIndex,
}: SkiaStepperHeaderProps) {
  const colorScheme = useColorScheme();
  const isFocused = useIsFocused();
  const isDark = colorScheme === "dark";
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const borderColor = isDark ? "#27272a" : "#e4e4e7";

  const progressPercent = (currentIndex / (steps.length - 1)) * 100;
  const progress = useSharedValue(progressPercent);
  const flowOffset = useSharedValue(0);
  const [lineWidth, setLineWidth] = useState(0);

  useEffect(() => {
    cancelAnimation(progress);
    progress.value = reduceMotion || !isFocused
      ? progressPercent
      : withSpring(progressPercent, {
          damping: 15,
          stiffness: 90,
        });
  }, [isFocused, progressPercent, progress, reduceMotion]);

  useEffect(() => {
    cancelAnimation(flowOffset);
    if (reduceMotion || !isFocused) {
      flowOffset.value = 0;
      return () => cancelAnimation(flowOffset);
    }

    flowOffset.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }),
      -1,
      false,
    );

    return () => cancelAnimation(flowOffset);
  }, [flowOffset, isFocused, reduceMotion]);

  const gradientStart = useDerivedValue(() => vec(flowOffset.value * 80, 0));
  const gradientEnd = useDerivedValue(() => vec(flowOffset.value * 80 + 80, 0));

  const activeLineEnd = useDerivedValue(() => {
    const clampedProgress = Math.max(0, Math.min(100, progress.value));
    return lineWidth * (clampedProgress / 100);
  });

  const activeLinePath = useDerivedValue(() => {
    const builder = Skia.PathBuilder.Make();
    if (builder) {
      builder.moveTo(0, 3);
      builder.lineTo(activeLineEnd.value, 3);
      return builder.build();
    }
    return Skia.Path.Circle(0, 0, 0);
  });

  const backgroundLinePath = useDerivedValue(() => {
    const builder = Skia.PathBuilder.Make();
    if (builder) {
      builder.moveTo(0, 3);
      builder.lineTo(lineWidth, 3);
      return builder.build();
    }
    return Skia.Path.Circle(0, 0, 0);
  });

  return (
    <View
      style={{ paddingHorizontal: 16, paddingVertical: 16, marginBottom: 8 }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Background progress line */}
        <View
          style={{
            position: "absolute",
            left: 46,
            right: 46,
            top: 27,
            height: 6,
            justifyContent: "center",
          }}
          onLayout={(e) => setLineWidth(e.nativeEvent.layout.width)}
        >
          {lineWidth > 0 && (
            <Canvas style={{ width: lineWidth, height: 6 }}>
              <Path
                path={backgroundLinePath}
                color={borderColor}
                strokeWidth={2}
                style="stroke"
              />
              <Path path={activeLinePath} strokeWidth={4} style="stroke">
                <LinearGradient
                  start={gradientStart}
                  end={gradientEnd}
                  colors={["#006fee", "#99c7fb", "#006fee"]}
                  mode="repeat"
                />
              </Path>
            </Canvas>
          )}
        </View>

        {steps.map((step, index) => {
          const isCompleted = currentIndex > index;
          const isActive = currentIndex === index;

          return (
            <View key={step.id} style={{ alignItems: "center", zIndex: 10 }}>
              <SkiaStepCircle
                animate={isFocused}
                index={index}
                isActive={isActive}
                isCompleted={isCompleted}
                isValid={step.isValid}
              />
              <View style={{ marginTop: 6 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: isActive ? "600" : "500",
                    color: isActive
                      ? colors.secondary
                      : isCompleted
                        ? colors.foreground
                        : colors.mutedForeground,
                  }}
                >
                  {step.title}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
