import { BottomSheet } from "@/components/Universal/bottom-sheet";
import { Button } from "@/components/Universal/button";
import { Host, RNHostView } from "@/components/Universal/layout";
import { Text } from "@/components/Universal/text";
import { space } from "@/constants/theme.tokens";
import { useTheme } from "@/context/theme.context";
import { OtpInput } from "@/features/auth/components/otp-input";
import { OTP_LENGTH } from "@/features/auth/otp.utils";
import { getAuthErrorMessage } from "@/services/auth/auth.service";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard, ScrollView, View, useWindowDimensions } from "react-native";
import Animated, {
  FadeInDown,
  useReducedMotion,
} from "react-native-reanimated";

export function OtpSheet({
  title,
  description,
  onDismiss,
  onSubmit,
  onSuccess,
  onResend,
  resendAvailable = false,
}: {
  title: string;
  description: string;
  onDismiss: () => void;
  onSubmit: (code: string) => Promise<void>;
  onSuccess?: () => void;
  onResend?: () => Promise<void>;
  resendAvailable?: boolean;
}) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const pending = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  function dismiss() {
    mounted.current = false;
    onDismiss();
  }
  const lastSubmitted = useRef("");
  const { colors } = useTheme();
  const { height } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const { t } = useTranslation();

  async function submit(code: string) {
    if (pending.current || code.length !== OTP_LENGTH) return;
    pending.current = true;
    lastSubmitted.current = code;
    setBusy(true);
    setError("");
    try {
      await onSubmit(code);
      if (!mounted.current) return;
      Keyboard.dismiss();
      onSuccess?.();
    } catch (failure) {
      if (!mounted.current) return;
      const message = getAuthErrorMessage(failure);
      setError(Array.isArray(message) ? message.join("\n") : message);
    } finally {
      pending.current = false;
      if (mounted.current) setBusy(false);
    }
  }

  async function resend() {
    if (pending.current || !onResend || !resendAvailable) return;
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      await onResend();
      if (!mounted.current) return;
      setDigits(Array(OTP_LENGTH).fill(""));
      lastSubmitted.current = "";
      setNotice(t("auth.codeResent"));
    } catch (failure) {
      if (!mounted.current) return;
      const message = getAuthErrorMessage(failure);
      setError(Array.isArray(message) ? message.join("\n") : message);
    } finally {
      pending.current = false;
      if (mounted.current) setBusy(false);
    }
  }

  return (
    <Host>
      <BottomSheet
        isPresented
        onDismiss={dismiss}
        contentPadding={0}
        testID="auth-otp-sheet"
      >
        <RNHostView matchContents>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={{ maxHeight: height * 0.85 }}
            contentContainerStyle={{
              padding: space(6),
              paddingBottom: space(10),
              backgroundColor: colors.background,
            }}
          >
            <View
              style={{
                gap: space(5),
                maxWidth: 480,
                width: "100%",
                alignSelf: "center",
              }}
            >
              <Text variant="caption" semantic="primary" weight="bold">
                {t("auth.secureStep")}
              </Text>
              <Text variant="h2">{title}</Text>
              <Text semantic="muted">{description}</Text>
              <Animated.View
                entering={reducedMotion ? undefined : FadeInDown.duration(200)}
              >
                <OtpInput
                  value={digits}
                  disabled={busy}
                  invalid={Boolean(error)}
                  onChange={(next) => {
                    setDigits(next);
                    setError("");
                    setNotice("");
                    const code = next.join("");
                    if (code.length !== OTP_LENGTH) lastSubmitted.current = "";
                    else if (code !== lastSubmitted.current) void submit(code);
                  }}
                />
              </Animated.View>
              <View accessibilityLiveRegion="polite">
                <Text
                  variant="small"
                  semantic={error ? "destructive" : "muted"}
                >
                  {error ||
                    notice ||
                    t(busy ? "auth.checkingCode" : "auth.otpAutoSubmit")}
                </Text>
              </View>
              <Button
                fullWidth
                size="lg"
                loading={busy}
                disabled={digits.some((digit) => !digit)}
                label={t("auth.verifyCode")}
                onPress={() => void submit(digits.join(""))}
              />
              {onResend ? (
                <Button
                  variant="text"
                  disabled={busy || !resendAvailable}
                  label={t("auth.resendCode")}
                  onPress={() => void resend()}
                />
              ) : null}
              <Button
                variant="text"
                semantic="secondary"
                label={t("auth.cancel")}
                disabled={busy}
                onPress={dismiss}
              />
            </View>
          </ScrollView>
        </RNHostView>
      </BottomSheet>
    </Host>
  );
}
