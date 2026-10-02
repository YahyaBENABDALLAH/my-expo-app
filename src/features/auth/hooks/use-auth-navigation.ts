import { router, useIsFocused } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Keyboard } from 'react-native';

/** Prepare the native forms while Login is idle, rather than during a push. */
export function useAuthNavigation(tabbed: boolean) {
  const focused = useIsFocused();
  const destinations = useMemo(() => {
    const params = { returnTo: tabbed ? 'account' : 'login' };
    return {
      register: { pathname: '/register' as const, params },
      forgotPassword: { pathname: '/forgot-password' as const, params },
    };
  }, [tabbed]);

  useEffect(() => {
    if (!focused) return;

    // Spread preparation across idle callbacks instead of one large startup task.
    let pending = requestIdleCallback(() => {
      router.prefetch(destinations.register);
      pending = requestIdleCallback(() => router.prefetch(destinations.forgotPassword));
    });

    return () => cancelIdleCallback(pending);
  }, [destinations, focused]);

  const open = (destination: keyof typeof destinations) => {
    Keyboard.dismiss();
    router.push(destinations[destination]);
  };

  return {
    openRegister: () => open('register'),
    openForgotPassword: () => open('forgotPassword'),
  };
}
