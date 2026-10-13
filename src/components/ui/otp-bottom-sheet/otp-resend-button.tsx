import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UniversalButtonContent } from '../button/universal-button-content';

/** Only the resend label updates each second; the native form and input stay untouched. */
export function OtpResendButton({
  deadline,
  isPresented,
  busy,
  onPress,
  testID,
}: {
  deadline: number;
  isPresented: boolean;
  busy: boolean;
  onPress: () => void;
  testID: string;
}) {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(() => ({
    deadline,
    remaining: Math.max(0, Math.ceil((deadline - Date.now()) / 1000)),
  }));
  if (countdown.deadline !== deadline) {
    setCountdown(() => ({
      deadline,
      remaining: Math.max(0, Math.ceil((deadline - Date.now()) / 1000)),
    }));
  }
  const { remaining } = countdown;
  useEffect(() => {
    const secondsLeft = () => Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    if (!isPresented || secondsLeft() === 0) return;
    const timer = setInterval(() => {
      const next = secondsLeft();
      setCountdown((previous) =>
        previous.remaining === next ? previous : { deadline, remaining: next },
      );
      if (next === 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline, isPresented]);

  return (
    <UniversalButtonContent
      variant="link"
      testID={testID}
      label={remaining > 0 ? t('otp.resendIn', { seconds: remaining }) : t('otp.resend')}
      disabled={!isPresented || remaining > 0 || busy}
      onPress={onPress}
    />
  );
}
