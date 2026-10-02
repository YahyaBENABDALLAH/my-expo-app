import { useTheme } from "@/context/theme.context";
import { ThemeToggleButton } from "@/features/auth/theme-toggle-button";
import { AuthFlowProvider } from "@/features/auth/auth-flow.context";
import { RequireNoAuth } from "@/guards/require-no-auth";
import { Stack } from "expo-router/stack";

export default function AuthLayout() {
  const { colors } = useTheme();

  return (
    <RequireNoAuth>
      <AuthFlowProvider>
        <ThemeToggleButton />
        <Stack
          screenOptions={{
            headerShown: false,
            presentation: "transparentModal",
            animation: "slide_from_bottom",
            contentStyle: {
              backgroundColor: colors.background,
            },
          }}
        />
      </AuthFlowProvider>
    </RequireNoAuth>
  );
}
