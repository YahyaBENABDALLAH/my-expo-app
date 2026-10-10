import { useAuthTheme } from '@components/ui';
import { Stack } from 'expo-router';
import { AuthFlowProvider } from '@/features/auth/auth-flow.context';

export const unstable_settings = { initialRouteName: 'login' };

export default function AuthLayout() {
  const { colors } = useAuthTheme();
  return (
    <AuthFlowProvider>
      <Stack
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="reset-password" />
        <Stack.Screen name="verify-email" />
      </Stack>
    </AuthFlowProvider>
  );
}
