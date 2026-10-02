import { router, useLocalSearchParams } from 'expo-router';
import { Keyboard } from 'react-native';

/** Preserve the Account tab when a form was opened from its embedded login. */
export function useAuthReturn() {
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();

  return () => {
    Keyboard.dismiss();
    router.dismissTo(returnTo === 'account' ? '/account' : '/login');
  };
}
