import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

const STORAGE_KEY = 'onboardingCompleted';

const OnboardingContext = createContext<{
  ready: boolean;
  completed: boolean;
  saving: boolean;
  saveError: boolean;
  complete: () => Promise<void>;
} | null>(null);

/** Completion belongs to this installation and survives sign-out and app updates. */
export function OnboardingProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const pending = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    let active = true;
    mounted.current = true;
    void AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (active) setCompleted(value === 'true');
      })
      .catch(() => {
        // An unavailable preference must not leave the launch screen stuck.
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
      mounted.current = false;
    };
  }, []);

  const complete = useCallback(async () => {
    if (!ready || completed || pending.current || !mounted.current) return;
    pending.current = true;
    setSaving(true);
    setSaveError(false);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, 'true');
      if (mounted.current) setCompleted(true);
    } catch {
      if (mounted.current) setSaveError(true);
    } finally {
      pending.current = false;
      if (mounted.current) setSaving(false);
    }
  }, [ready, completed]);

  const value = useMemo(
    () => ({ ready, completed, saving, saveError, complete }),
    [ready, completed, saving, saveError, complete],
  );
  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error('useOnboarding requires OnboardingProvider.');
  return context;
}
