import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { stackMotionOptions } from '@/constants/navigation-motion';
import { useOnboarding } from '@/context/onboarding.context';
import { useThemeColors } from '@/hooks/use-theme';

export const unstable_settings = { initialRouteName: 'discover' };

export default function OnboardingLayout() {
  const colors = useThemeColors();
  const reducedMotion = useReducedMotion();
  const { saving } = useOnboarding();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        ...stackMotionOptions(reducedMotion),
        freezeOnBlur: Platform.OS === 'android',
        gestureEnabled: !saving,
      }}
    >
      <Stack.Screen name="discover" />
      <Stack.Screen name="cook" />
      <Stack.Screen name="save" />
    </Stack>
  );
}
