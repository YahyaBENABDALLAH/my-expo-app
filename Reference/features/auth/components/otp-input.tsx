import { RADIUS, space, TYPOGRAPHY } from "@/constants/theme.tokens";
import { useTheme } from "@/context/theme.context";
import { OTP_LENGTH, updateOtpDigits } from "@/features/auth/otp.utils";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, TextInput, View } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";

export function OtpInput({
  value,
  onChange,
  disabled,
  invalid,
}: {
  value: string[];
  onChange: (digits: string[]) => void;
  disabled: boolean;
  invalid: boolean;
}) {
  const inputs = useRef<(TextInput | null)[]>([]);
  const [focused, setFocused] = useState<number | null>(null);
  const { colors } = useTheme();
  const reducedMotion = useReducedMotion();
  const { t } = useTranslation();

  return (
    <View style={{ flexDirection: "row", direction: "ltr", gap: space(2) }}>
      {value.map((digit, index) => (
        <Animated.View
          key={index}
          style={{
            flex: 1,
            borderRadius: RADIUS.medium,
            borderWidth: 1,
            backgroundColor: colors.muted,
            borderColor: invalid
              ? colors.destructive
              : focused === index
                ? colors.primary
                : colors.border,
            transform: [{ scale: focused === index ? 1.03 : 1 }],
            transitionProperty: "transform",
            transitionDuration: reducedMotion ? 0 : 140,
          }}
        >
          {/* RN supplies empty-cell Backspace events missing from Expo's TextInput API. */}
          <TextInput
            ref={(input) => {
              inputs.current[index] = input;
            }}
            value={digit}
            accessibilityLabel={t("auth.otpDigit", {
              index: index + 1,
              count: OTP_LENGTH,
            })}
            accessibilityState={{ disabled }}
            keyboardType="number-pad"
            autoComplete={
              index === 0
                ? Platform.OS === "android"
                  ? "sms-otp"
                  : "one-time-code"
                : "off"
            }
            textContentType={index === 0 ? "oneTimeCode" : "none"}
            autoCorrect={false}
            autoFocus={index === 0}
            selectTextOnFocus
            editable={!disabled}
            maxLength={32}
            onFocus={() => setFocused(index)}
            onBlur={() => setFocused(null)}
            onChangeText={(text) => {
              const next = updateOtpDigits(value, index, text);
              onChange(next.digits);
              inputs.current[next.focus]?.focus();
            }}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Backspace" && !digit && index > 0) {
                const next = [...value];
                next[index - 1] = "";
                onChange(next);
                inputs.current[index - 1]?.focus();
              }
            }}
            selectionColor={colors.primary}
            style={{
              ...TYPOGRAPHY.text.h3,
              color: colors.foreground,
              minHeight: 60,
              padding: 0,
              textAlign: "center",
              writingDirection: "ltr",
            }}
          />
        </Animated.View>
      ))}
    </View>
  );
}
