import { Stack } from 'expo-router';
import { useReducedMotion } from 'react-native-reanimated';
import { useOnboarding } from '@/context/onboarding.context';

export const unstable_settings = { initialRouteName: 'discover' };

export default function OnboardingLayout() {
  const reducedMotion = useReducedMotion();
  const { saving } = useOnboarding();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
        animation: reducedMotion ? 'fade' : 'default',
        gestureEnabled: !saving,
      }}
    >
      <Stack.Screen name="discover" />
      <Stack.Screen name="cook" />
      <Stack.Screen name="save" />
    </Stack>
  );
}
