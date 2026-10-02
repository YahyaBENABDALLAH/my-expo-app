import { useCallback, useEffect, useRef, useState } from "react";

interface UseCountdownOptions {
  autoStart?: boolean;
  onComplete?: () => void;
}

function normalizeSeconds(seconds: number) {
  if (!Number.isFinite(seconds)) {
    return 0;
  }

  return Math.max(0, Math.floor(seconds));
}

export function useCountdown(
  initialSeconds: number,
  { autoStart = true, onComplete }: UseCountdownOptions = {},
) {
  const normalizedInitialSeconds = normalizeSeconds(initialSeconds);
  const [countdown, setCountdown] = useState(normalizedInitialSeconds);
  const [isRunning, setIsRunning] = useState(
    autoStart && normalizedInitialSeconds > 0,
  );
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isRunning || countdown <= 0) {
      return;
    }

    const timeout = setTimeout(() => {
      if (countdown <= 1) {
        setCountdown(0);
        setIsRunning(false);
        onCompleteRef.current?.();
        return;
      }

      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [countdown, isRunning]);

  const startCountdown = useCallback(() => {
    setIsRunning((current) => current || countdown > 0);
  }, [countdown]);

  const stopCountdown = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetCountdown = useCallback(() => {
    setIsRunning(false);
    setCountdown(normalizedInitialSeconds);
  }, [normalizedInitialSeconds]);

  const restartCountdown = useCallback(() => {
    setCountdown(normalizedInitialSeconds);
    setIsRunning(normalizedInitialSeconds > 0);
  }, [normalizedInitialSeconds]);

  return {
    countdown,
    isComplete: countdown === 0,
    isRunning,
    resetCountdown,
    restartCountdown,
    startCountdown,
    stopCountdown,
  };
}
