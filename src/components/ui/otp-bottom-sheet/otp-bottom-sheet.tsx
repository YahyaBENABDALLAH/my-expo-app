import { spacing, radii } from '@/constants/layout';
import {
  Column,
  Icon,
  RNHostView,
  Row,
  ScrollView,
  Spacer,
  useNativeState,
  type TextInputRef,
} from '@expo/ui';
import { useEffect, useLayoutEffect, useRef, useState, type ComponentProps } from 'react';
import Animated, { cubicBezier } from 'react-native-reanimated';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { AccessibilityInfo, Platform, useWindowDimensions } from 'react-native';
import { onSizeChanged } from '@expo/ui/jetpack-compose/modifiers';
import { onGeometryChange } from '@expo/ui/swift-ui/modifiers';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/use-theme';
import { useMeasuredWidth } from '@/hooks/use-measured-width';
import { BottomSheet } from '../bottom-sheet/bottom-sheet';
import { UniversalButtonContent } from '../button/universal-button';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { LoadingContent } from '../loading/loading-state';
import { nativeFillWidth } from '../native/native-fill-width';
import { UniversalTextContent } from '../text/universal-text';
import { OtpInputLayout } from './otp-input-layout';

const OTP_LENGTH = 6;

/** Accept pasted separators and the numeric scripts used by our supported locales. */
function normalizeOtpCode(value: string) {
  return value
    .replace(/[\u0660-\u0669\u06f0-\u06f9\uff10-\uff19]/g, (digit) => {
      const point = digit.charCodeAt(0);
      const zero = point >= 0xff10 ? 0xff10 : point >= 0x06f0 ? 0x06f0 : 0x0660;
      return String(point - zero);
    })
    .replace(/[^0-9]/g, '')
    .slice(0, OTP_LENGTH);
}

export interface OtpBottomSheetProps {
  isPresented: boolean;
  onDismiss: () => void;
  recipient: string;
  /** Return false for a rejected code; throw for a request failure. */
  onVerify: (code: string) => boolean | Promise<boolean>;
  /** Omit when resending is unavailable. Cooldown begins after a successful resend. */
  onResend?: () => void | Promise<void>;
  resendCooldownSeconds?: number;
  hint?: string;
  colorScheme?: 'light' | 'dark';
  testID?: string;
}

export function OtpBottomSheet({
  colorScheme,
  testID = 'otp-sheet',
  ...props
}: OtpBottomSheetProps) {
  return (
    <UniversalHost colorScheme={colorScheme}>
      <BottomSheet isPresented={props.isPresented} onDismiss={props.onDismiss} testID={testID}>
        <OtpForm {...props} testID={testID} />
      </BottomSheet>
    </UniversalHost>
  );
}

function OtpForm({
  isPresented,
  onDismiss,
  recipient,
  onVerify,
  onResend,
  resendCooldownSeconds = 30,
  hint,
  testID = 'otp-sheet',
}: OtpBottomSheetProps) {
  const { t } = useTranslation();
  const scheme = useHostColorScheme();
  const colors = useThemeColors(scheme);
  const { height, fontScale } = useWindowDimensions();
  const cooldown = Number.isFinite(resendCooldownSeconds) ? Math.max(0, resendCooldownSeconds) : 30;
  const value = useNativeState('');
  const [width, setWidth] = useMeasuredWidth();
  const measureWidth = ({ width: nextWidth }: { width: number }) => {
    if (nextWidth > 0) setWidth(nextWidth);
  };
  const inputSizing =
    Platform.OS === 'ios' ? onGeometryChange(measureWidth) : onSizeChanged(measureWidth);
  // Intrinsic sheet Hosts measure with an unbounded height. Compose scrolling needs a limit.
  const viewportHeight = Math.min(620, height * 0.7);
  const inputHeight = Math.max(64, Math.ceil(35 * fontScale + 24));
  const slotWidth = Math.max(5, (width - 8 * (OTP_LENGTH - 1)) / OTP_LENGTH);
  const inputRef = useRef<TextInputRef>(null);
  const session = useRef(0);
  const pending = useRef(false);
  const presented = useRef(false);
  const [deadline, setDeadline] = useState(() => (isPresented ? Date.now() + cooldown * 1000 : 0));
  const [code, setCode] = useState('');
  const [focused, setFocused] = useState(false);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'resending' | 'error' | 'success'>(
    'idle',
  );
  const [error, setError] = useState<'invalid' | 'verifyFailed' | 'resendFailed' | null>(null);
  const [resent, setResent] = useState(false);
  const [presentation, setPresentation] = useState({ isPresented, cooldown });
  if (presentation.isPresented !== isPresented || presentation.cooldown !== cooldown) {
    setPresentation({ isPresented, cooldown });
    if (isPresented) {
      setDeadline(() => Date.now() + cooldown * 1000);
      if (!presentation.isPresented) {
        // Adjust local state before committing the new presentation, retaining the native field.
        setCode('');
        setFocused(false);
        setStatus('idle');
        setError(null);
        setResent(false);
      }
    }
  }
  useLayoutEffect(() => {
    const opening = isPresented && !presented.current;
    presented.current = isPresented;
    session.current += 1;
    pending.current = false;
    if (!isPresented) {
      inputRef.current?.blur();
      return;
    }
    if (opening) {
      // Native state is synchronized separately from React's presentation reset.
      value.set('');
    }
    return () => {
      session.current += 1;
      pending.current = false;
    };
  }, [isPresented, cooldown, value]);

  const busy = status === 'verifying' || status === 'resending';
  const complete = code.length === OTP_LENGTH;
  const success = status === 'success';
  function changeCode(text: string) {
    if (pending.current || success) return;
    const next = normalizeOtpCode(text);
    if (next !== text) value.set(next);
    setCode(next);
    setStatus('idle');
    setError(null);
    setResent(false);
  }
  function dismiss() {
    session.current += 1;
    pending.current = false;
    inputRef.current?.blur();
    onDismiss();
  }
  async function verify() {
    if (!isPresented || !complete || pending.current || success) return;
    const currentSession = session.current;
    pending.current = true;
    setStatus('verifying');
    setError(null);
    inputRef.current?.blur();
    try {
      const accepted = await onVerify(code);
      if (session.current !== currentSession) return;
      setStatus(accepted ? 'success' : 'error');
      setError(accepted ? null : 'invalid');
      AccessibilityInfo.announceForAccessibility(t(accepted ? 'otp.successTitle' : 'otp.invalid'));
    } catch {
      if (session.current !== currentSession) return;
      setStatus('error');
      setError('verifyFailed');
      AccessibilityInfo.announceForAccessibility(t('otp.verifyFailed'));
    } finally {
      if (session.current === currentSession) pending.current = false;
    }
  }
  async function resend() {
    if (!isPresented || !onResend || pending.current || success || Date.now() < deadline) return;
    const currentSession = session.current;
    pending.current = true;
    setStatus('resending');
    setError(null);
    try {
      await onResend();
      if (session.current !== currentSession) return;
      setDeadline(Date.now() + cooldown * 1000);
      value.set('');
      setCode('');
      setResent(true);
      setStatus('idle');
      inputRef.current?.focus();
      AccessibilityInfo.announceForAccessibility(t('otp.resent'));
    } catch {
      if (session.current !== currentSession) return;
      setStatus('error');
      setError('resendFailed');
      AccessibilityInfo.announceForAccessibility(t('otp.resendFailed'));
    } finally {
      if (session.current === currentSession) pending.current = false;
    }
  }
  return (
    <ScrollView style={{ height: viewportHeight }}>
      <Column
        alignment="center"
        spacing={spacing.xl}
        modifiers={nativeFillWidth}
        style={{ padding: spacing.lg }}
      >
        <Row modifiers={nativeFillWidth} alignment="center">
          <Spacer flexible />
          <UniversalButtonContent
            variant="link"
            label={t('common.close')}
            onPress={dismiss}
            testID={`${testID}-close`}
          />
        </Row>
        <OtpFeedback status={status} visible={isPresented && success} />
        <Column
          alignment={success ? 'center' : 'start'}
          spacing={spacing.xl}
          modifiers={nativeFillWidth}
        >
          <UniversalTextContent
            testID={`${testID}-title`}
            fontSize={30}
            fontWeight="700"
            textStyle={{ textAlign: success ? 'center' : undefined }}
          >
            {t(success ? 'otp.successTitle' : 'otp.title')}
          </UniversalTextContent>
          <Column
            alignment={success ? 'center' : 'start'}
            spacing={spacing.sm}
            modifiers={nativeFillWidth}
          >
            <UniversalTextContent
              fontSize={18}
              textStyle={{ textAlign: success ? 'center' : undefined, color: colors.muted }}
            >
              {t(success ? 'otp.successDescription' : 'otp.description')}
            </UniversalTextContent>
            {!success && (
              <UniversalTextContent fontSize={18} fontWeight="700">
                {recipient}
              </UniversalTextContent>
            )}
          </Column>
        </Column>
        {!success && (
          <Column spacing={spacing.md} modifiers={[...nativeFillWidth, inputSizing]}>
            {/* An explicit-width direction bridge keeps OTP digits LTR inside Arabic sheets. */}
            {width > 0 && (
              <RNHostView matchContents>
                <UniversalHost
                  colorScheme={scheme}
                  layoutDirection="leftToRight"
                  ignoreSafeArea="all"
                  style={{ width }}
                >
                  <OtpInputLayout
                    accessibilityLabel={t('otp.codeLabel')}
                    height={inputHeight}
                    input={{
                      ref: inputRef,
                      value,
                      onChangeText: changeCode,
                      onFocus: () => setFocused(true),
                      onBlur: () => setFocused(false),
                      keyboardType: 'number-pad',
                      autoComplete: 'one-time-code',
                      autoCorrect: false,
                      autoCapitalize: 'none',
                      caretHidden: true,
                      maxLength: 32,
                      editable: !busy && isPresented,
                      onSubmitEditing: () => void verify(),
                      testID: `${testID}-input`,
                    }}
                    slots={Array.from({ length: OTP_LENGTH }, (_, index) => {
                      const active = focused && index === Math.min(code.length, OTP_LENGTH - 1);
                      const filled = index < code.length;
                      const borderWidth = active ? 3 : error ? 2 : 1;
                      const borderColor = error
                        ? colors.error
                        : active
                          ? colors.text
                          : colors.border;
                      const backgroundColor = error ? colors.errorContainer : colors.surfaceVariant;
                      return (
                        <Column
                          key={index}
                          testID={`${testID}-slot-${index}`}
                          alignment="center"
                          spacing={spacing.none}
                          style={{
                            width: slotWidth,
                            height: inputHeight,
                            padding: borderWidth,
                            borderRadius: radii.control,
                            backgroundColor: borderColor,
                          }}
                        >
                          {/* Inset fills preserve rounded borders on SwiftUI as well as Compose. */}
                          <Column
                            alignment="center"
                            spacing={spacing.none}
                            style={{
                              width: slotWidth - borderWidth * 2,
                              height: inputHeight - borderWidth * 2,
                              borderRadius: radii.control - borderWidth,
                              backgroundColor,
                            }}
                          >
                            <Spacer flexible size={0} />
                            <UniversalTextContent
                              fontSize={28}
                              fontWeight="400"
                              textStyle={{
                                textAlign: 'center',
                                color: filled ? colors.text : colors.muted,
                              }}
                            >
                              {code[index] ?? ''}
                            </UniversalTextContent>
                            <Spacer flexible size={0} />
                          </Column>
                        </Column>
                      );
                    })}
                  />
                </UniversalHost>
              </RNHostView>
            )}
            {(error || resent || hint) && (
              <UniversalTextContent
                testID={`${testID}-status`}
                variant="caption"
                textStyle={{
                  color: error ? colors.error : resent ? colors.success : colors.muted,
                  textAlign: 'center',
                }}
              >
                {error ? t(`otp.${error}`) : resent ? t('otp.resent') : hint}
              </UniversalTextContent>
            )}
          </Column>
        )}
        <UniversalButtonContent
          variant={success ? 'success' : 'primary'}
          color={success ? colors.success : undefined}
          contentColor={success ? colors.onSuccess : undefined}
          fullWidth
          contentPadding={spacing.md}
          borderRadius={radii.control}
          testID={`${testID}-verify`}
          label={t(success ? 'otp.done' : 'otp.verify')}
          disabled={!success && (!complete || busy)}
          onPress={success ? dismiss : () => void verify()}
        >
          {busy ? (
            <LoadingContent label={t(status === 'resending' ? 'otp.resending' : 'otp.verifying')} />
          ) : undefined}
        </UniversalButtonContent>
        {!success && onResend && (
          <Column alignment="center" spacing={spacing.none} modifiers={nativeFillWidth}>
            <OtpResendButton
              testID={`${testID}-resend`}
              deadline={deadline}
              isPresented={isPresented}
              busy={busy}
              onPress={() => void resend()}
            />
          </Column>
        )}
      </Column>
    </ScrollView>
  );
}

/** Only the resend label updates each second; the native form and input stay untouched. */
function OtpResendButton({
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

const fadeIn = {
  animationName: {
    from: { opacity: 0.4, transform: [{ scale: 0.92 }] },
    to: { opacity: 1, transform: [{ scale: 1 }] },
  },
  animationDuration: 180,
  animationTimingFunction: cubicBezier(0.23, 1, 0.32, 1),
} satisfies ComponentProps<typeof Animated.View>['style'];

const shake = {
  animationName: {
    from: { transform: [{ translateX: 0 }] },
    '25%': { transform: [{ translateX: -6 }] },
    '50%': { transform: [{ translateX: 6 }] },
    '75%': { transform: [{ translateX: -3 }] },
    to: { transform: [{ translateX: 0 }] },
  },
  animationDuration: 200,
  animationTimingFunction: cubicBezier(0.77, 0, 0.175, 1),
} satisfies ComponentProps<typeof Animated.View>['style'];

function OtpFeedback({
  status,
  visible,
}: {
  status: 'idle' | 'verifying' | 'resending' | 'error' | 'success';
  visible: boolean;
}) {
  if (!visible) return null;
  return <AnimatedOtpFeedback status={status} />;
}

function AnimatedOtpFeedback({
  status,
}: {
  status: 'idle' | 'verifying' | 'resending' | 'error' | 'success';
}) {
  const scheme = useHostColorScheme();
  const colors = useThemeColors(scheme);
  const motion = useMotionEnabled(true);
  const success = status === 'success';
  const error = status === 'error';
  return (
    // A fixed-size RN boundary is needed only to animate the native status artwork.
    <RNHostView matchContents>
      <Animated.View
        key={status}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[
          {
            width: 80,
            height: 80,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: radii.pill,
            backgroundColor: error ? colors.errorContainer : colors.successContainer,
          },
          motion ? (error ? shake : fadeIn) : undefined,
        ]}
      >
        <UniversalHost inline colorScheme={scheme} ignoreSafeArea="all">
          <Icon
            name={Icon.select({
              ios: success
                ? 'checkmark.shield.fill'
                : error
                  ? 'exclamationmark.shield.fill'
                  : 'lock.shield.fill',
              android: success
                ? require('@expo/material-symbols/verified_user.xml')
                : error
                  ? require('@expo/material-symbols/gpp_maybe.xml')
                  : require('@expo/material-symbols/shield_lock.xml'),
            })}
            size={36}
            color={error ? colors.error : colors.success}
          />
        </UniversalHost>
      </Animated.View>
    </RNHostView>
  );
}
