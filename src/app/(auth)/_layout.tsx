import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { AuthFlowProvider } from '@/features/auth/auth-flow.context';

export const unstable_settings = { initialRouteName: 'login' };

export default function AuthLayout() {
  return (
    <AuthFlowProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          freezeOnBlur: Platform.OS === 'android',
          contentStyle: { backgroundColor: 'transparent' },
        }}
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
