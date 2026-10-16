import { Stack } from 'expo-router';
import { useThemeColors } from '@/hooks/use-theme';

export const unstable_settings = { initialRouteName: 'discover' };

export default function OnboardingLayout() {
  const colors = useThemeColors();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="discover" />
    </Stack>
  );
}
