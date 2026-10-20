import { spacing } from '@/constants/layout';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/use-theme';
import { Column } from '@expo/ui';
import {
  Canvas,
  Circle,
  Group,
  interpolateColors,
  LinearGradient,
  Path,
  Skia,
  vec,
} from '@shopify/react-native-skia';
import { memo, useEffect } from 'react';
import { View } from 'react-native';
import {
  cancelAnimation,
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useHostColorScheme, useHostLayoutDirection } from '../host/universal-host';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { RecipeStepperLayout } from './recipe-stepper-layout';
import { UniversalTextContent as Text } from '../text/universal-text';
import { nativeFillWidth } from '../native/native-fill-width';

const steps = ['common.info', 'common.details', 'common.ingredients', 'common.steps'] as const;
const indicatorHeight = 80;
const centerY = indicatorHeight / 2;
const circleRadius = 26;
const waveLength = 80;
const clip = Skia.Path.Circle(0, 0, circleRadius);
const settle = { duration: 300, dampingRatio: 1, overshootClamping: true };

// Build a periodic liquid surface once. Only its transform changes each frame.
const waveBuilder = Skia.PathBuilder.Make();
const segmentWidth = waveLength / 4;
const frequency = (2 * Math.PI) / waveLength;
waveBuilder.moveTo(-waveLength, 0);
for (let segment = 0; segment < 12; segment++) {
  const start = -waveLength + segment * segmentWidth;
  const end = start + segmentWidth;
  waveBuilder.cubicTo(
    start + segmentWidth / 3,
    Math.sin(start * frequency) * 2.5 +
      (Math.cos(start * frequency) * frequency * 2.5 * segmentWidth) / 3,
    end - segmentWidth / 3,
    Math.sin(end * frequency) * 2.5 -
      (Math.cos(end * frequency) * frequency * 2.5 * segmentWidth) / 3,
    end,
    Math.sin(end * frequency) * 2.5,
  );
}
waveBuilder.lineTo(2 * waveLength, indicatorHeight);
waveBuilder.lineTo(-waveLength, indicatorHeight);
waveBuilder.close();
const wave = waveBuilder.build();

function StepCircle({
  index,
  current,
  isCurrentValid,
  width,
  phase,
  enabled,
  color,
  surface,
  border,
}: {
  index: number;
  current: number;
  isCurrentValid: boolean;
  width: SharedValue<number>;
  phase: SharedValue<number>;
  enabled: boolean;
  color: string;
  surface: string;
  border: string;
}) {
  const active = useSharedValue(index === current ? 1 : 0);
  const completed = useSharedValue(index < current ? 1 : 0);
  const valid = useSharedValue(isCurrentValid ? 1 : 0);
  useEffect(() => {
    cancelAnimation(active);
    cancelAnimation(completed);
    cancelAnimation(valid);
    const activeValue = index === current ? 1 : 0;
    const completedValue = index < current ? 1 : 0;
    const validValue = isCurrentValid ? 1 : 0;
    active.set(enabled ? withSpring(activeValue, settle) : activeValue);
    completed.set(enabled ? withSpring(completedValue, settle) : completedValue);
    valid.set(enabled ? withSpring(validValue, settle) : validValue);
    return () => {
      cancelAnimation(active);
      cancelAnimation(completed);
      cancelAnimation(valid);
    };
  }, [active, completed, current, enabled, index, isCurrentValid, valid]);

  const transform = useDerivedValue(() => {
    const breath = enabled ? (1 - Math.cos(phase.get() * frequency)) / 2 : 0;
    return [
      { translateX: (width.get() * (index + 0.5)) / steps.length },
      { translateY: centerY },
      { scale: (20 + active.get() * (6 + breath * 1.5)) / circleRadius },
    ];
  });
  const strokeColor = useDerivedValue(() =>
    interpolateColors(Math.max(active.get(), completed.get()), [0, 1], [border, color]),
  );
  const pulseRadius = useDerivedValue(() => circleRadius + (phase.get() / waveLength) * 12);
  const pulseOpacity = useDerivedValue(() =>
    enabled ? (1 - phase.get() / waveLength) * 0.4 * active.get() : 0,
  );
  const liquidTransform = useDerivedValue(() => {
    const fill = Math.max(completed.get(), active.get() * (0.15 + valid.get() * 0.6));
    return [
      { translateY: circleRadius + 6 - fill * (2 * circleRadius + 12) },
      { translateX: -phase.get() },
    ];
  });

  return (
    <Group transform={transform}>
      <Circle
        cx={0}
        cy={0}
        r={pulseRadius}
        color={color}
        opacity={pulseOpacity}
        style="stroke"
        strokeWidth={1.5}
      />
      <Group clip={clip}>
        <Circle cx={0} cy={0} r={circleRadius} color={surface} />
        <Group transform={liquidTransform}>
          <Path path={wave} color={color} />
        </Group>
      </Group>
      <Circle cx={0} cy={0} r={circleRadius} style="stroke" strokeWidth={2.5} color={strokeColor} />
    </Group>
  );
}

export interface RecipeStepperProps {
  current: number;
  isCurrentValid?: boolean;
  animate?: boolean;
  colorScheme?: 'light' | 'dark';
}

/** Compose inside an Expo UI Host. Progress follows the recipe form's validation. */
export const RecipeStepper = memo(function RecipeStepper({
  current,
  isCurrentValid = false,
  animate = true,
  colorScheme,
}: RecipeStepperProps) {
  const { t } = useTranslation();
  const scheme = useHostColorScheme(colorScheme);
  const direction = useHostLayoutDirection();
  const colors = useThemeColors(scheme);
  const currentIndex = Math.max(0, Math.min(steps.length - 1, Math.trunc(current) || 0));
  const enabled = useMotionEnabled(animate);
  const width = useSharedValue(0);
  const phase = useSharedValue(0);
  const progress = useSharedValue(currentIndex);
  useEffect(() => {
    cancelAnimation(progress);
    progress.set(enabled ? withSpring(currentIndex, settle) : currentIndex);
    return () => cancelAnimation(progress);
  }, [currentIndex, enabled, progress]);
  useEffect(() => {
    cancelAnimation(phase);
    phase.set(0);
    if (enabled) {
      phase.set(
        withRepeat(withTiming(waveLength, { duration: 2000, easing: Easing.linear }), -1, false),
      );
    }
    return () => cancelAnimation(phase);
  }, [enabled, phase]);

  const track = useDerivedValue(() => {
    const builder = Skia.PathBuilder.Make();
    builder.moveTo(width.get() / (steps.length * 2), centerY);
    builder.lineTo(width.get() * (1 - 1 / (steps.length * 2)), centerY);
    return builder.build();
  });
  const lineEnd = useDerivedValue(() => progress.get() / (steps.length - 1));
  const gradientStart = useDerivedValue(() => vec(phase.get(), centerY));
  const gradientEnd = useDerivedValue(() => vec(phase.get() + waveLength, centerY));

  return (
    <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
      <RecipeStepperLayout
        indicatorHeight={indicatorHeight}
        renderArtwork={(canvasWidth) => (
          <View
            collapsable={false}
            style={{
              width: canvasWidth,
              height: indicatorHeight,
              transform: [{ scaleX: direction === 'rightToLeft' ? -1 : 1 }],
            }}
            onLayout={({ nativeEvent: { layout } }) => {
              width.set(layout.width);
            }}
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <Canvas style={{ width: canvasWidth, height: indicatorHeight }}>
              <Path path={track} color={colors.border} strokeWidth={2} style="stroke" />
              <Path path={track} end={lineEnd} strokeWidth={4} strokeCap="round" style="stroke">
                <LinearGradient
                  start={gradientStart}
                  end={gradientEnd}
                  colors={[colors.tabBarActive, colors.tabIconSelected, colors.tabBarActive]}
                  mode="repeat"
                />
              </Path>
              {steps.map((_, index) => (
                <StepCircle
                  key={index}
                  index={index}
                  current={currentIndex}
                  isCurrentValid={isCurrentValid}
                  width={width}
                  phase={phase}
                  enabled={enabled}
                  color={colors.tabBarActive}
                  surface={colors.surface}
                  border={colors.border}
                />
              ))}
            </Canvas>
          </View>
        )}
        steps={steps.map((key, index) => {
          const label = t(key);
          const active = index === currentIndex;
          const completed = index < currentIndex;
          const pendingNumberColor = active ? colors.tabBarActive : colors.muted;
          const numberColor =
            completed || (active && isCurrentValid) ? colors.surface : pendingNumberColor;
          const pendingState = active ? 'recipeForm.current' : 'recipeForm.upcoming';
          const state = t(completed ? 'recipeForm.completed' : pendingState);
          const inactiveLabelColor = completed ? colors.text : colors.muted;
          const labelColor = active ? colors.tabBarActive : inactiveLabelColor;
          return {
            id: `recipe-step-${index}`,
            accessibilityLabel: t('recipeForm.stepAccessibility', {
              index: index + 1,
              label,
              state,
              ready: active && isCurrentValid ? t('recipeForm.ready') : '',
            }),
            number: (
              <Text
                colorScheme={scheme}
                fontSize={active ? 20 : 16}
                fontWeight={active ? '800' : '700'}
                textStyle={{ color: numberColor }}
              >
                {String(index + 1)}
              </Text>
            ),
            label: (
              <Text
                colorScheme={scheme}
                fontSize={12}
                fontWeight={active ? '600' : '500'}
                textStyle={{
                  color: labelColor,
                  textAlign: 'center',
                }}
              >
                {label}
              </Text>
            ),
          };
        })}
      />
      <Text variant="caption" colorScheme={scheme} testID="recipe-step-label">
        {t('recipeForm.stepProgress', {
          index: currentIndex + 1,
          count: steps.length,
          label: t(steps[currentIndex]),
        })}
      </Text>
    </Column>
  );
});
