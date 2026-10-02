import { queryClient } from "@/lib/react-query";
import { QueryClientProvider, focusManager } from "@tanstack/react-query";
import { useEffect, type PropsWithChildren } from "react";
import { AppState, type AppStateStatus } from "react-native";

function onAppStateChange(status: AppStateStatus) {
  focusManager.setFocused(status === "active");
}

export function AppQueryProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
