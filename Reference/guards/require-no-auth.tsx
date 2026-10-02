import { AUTH_STATUS } from "@/constants/auth.constant";
import { useAuthContext } from "@/context/auth.context";
import { Redirect } from "expo-router";
import { PropsWithChildren } from "react";

export function RequireNoAuth({ children }: PropsWithChildren) {
  const { status } = useAuthContext();

  if (status === AUTH_STATUS.UNKNOWN) {
    return null;
  }

  if (status === AUTH_STATUS.AUTHENTICATED) {
    return <Redirect href="/(tabs)" />;
  }

  return <>{children}</>;
}
