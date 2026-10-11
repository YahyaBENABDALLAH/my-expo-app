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
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import { onGeometryChange } from '@expo/ui/swift-ui/modifiers';
import { onSizeChanged } from '@expo/ui/jetpack-compose/modifiers';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/use-theme';
import { useMeasuredWidth } from '@/hooks/use-measured-width';
import { BottomSheet } from '../bottom-sheet/bottom-sheet';
import { UniversalButtonContent } from '../button/universal-button-content';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { LoadingContent } from '../loading/loading-state';
import { nativeFillWidth, nativeRowWeight } from '../native/native-fill-width';
import { UniversalTextContent } from '../text/universal-text';
import { normalizeOtpCode, OTP_LENGTH } from './otp-code';
import { OtpFeedback } from './otp-feedback';
import { OtpInputLayout } from './otp-input-layout';

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
  const scheme = useHostColorScheme(colorScheme);
  const colors = useThemeColors(scheme);
  const [presentation, setPresentation] = useState({ visible: props.isPresented, id: 0 });
  if (presentation.visible !== props.isPresented) {
    // A new native presentation owns fresh input state; retain old content during dismissal.
    setPresentation({
      visible: props.isPresented,
      id: presentation.id + (props.isPresented ? 1 : 0),
    });
  }
  return (
    <UniversalHost colorScheme={scheme}>
      <BottomSheet
        isPresented={props.isPresented}
        onDismiss={props.onDismiss}
        testID={testID}
        containerColor={colors.surfaceRaised}
        contentPadding={{ top: 12, bottom: 24, left: 24, right: 24 }}
      >
        <OtpForm key={presentation.id} {...props} testID={testID} />
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
  const cooldown = Number.isFinite(resendCooldownSeconds) ? Math.max(0, resendCooldownSeconds) : 30;
  const value = useNativeState('');
  const [width, setWidth] = useMeasuredWidth();
  const inputRef = useRef<TextInputRef>(null);
  const session = useRef(0);
  const pending = useRef(false);
  const deadline = useRef(0);
  const [code, setCode] = useState('');
  const [focused, setFocused] = useState(false);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'resending' | 'error' | 'success'>(
    'idle',
  );
  const [error, setError] = useState<'invalid' | 'verifyFailed' | 'resendFailed' | null>(null);
  const [remaining, setRemaining] = useState(Math.ceil(cooldown));
  const [resent, setResent] = useState(false);
  useEffect(() => {
    session.current += 1;
    pending.current = false;
    if (!isPresented) {
      inputRef.current?.blur();
      return;
    }
    deadline.current = Date.now() + cooldown * 1000;
    const tick = () => setRemaining(Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)));
    const timer = setInterval(tick, 1000);
    return () => {
      session.current += 1;
      pending.current = false;
      clearInterval(timer);
    };
  }, [isPresented, cooldown]);

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
    if (!isPresented || !onResend || pending.current || success || Date.now() < deadline.current)
      return;
    const currentSession = session.current;
    pending.current = true;
    setStatus('resending');
    setError(null);
    try {
      await onResend();
      if (session.current !== currentSession) return;
      deadline.current = Date.now() + cooldown * 1000;
      setRemaining(Math.ceil(cooldown));
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
    <ScrollView modifiers={nativeFillWidth}>
      <Column
        alignment="center"
        spacing={24}
        modifiers={[
          ...nativeFillWidth,
          Platform.OS === 'ios'
            ? onGeometryChange((size) => setWidth(size.width))
            : onSizeChanged((size) => setWidth(size.width)),
        ]}
      >
        <Row modifiers={nativeFillWidth} alignment="center">
          <UniversalTextContent
            variant="caption"
            fontWeight="700"
            textStyle={{ color: colors.tint }}
          >
            {t('otp.eyebrow')}
          </UniversalTextContent>
          <Spacer flexible />
          <UniversalButtonContent
            variant="link"
            label={t('common.close')}
            onPress={dismiss}
            testID={`${testID}-close`}
          />
        </Row>
        <OtpFeedback status={status} visible={isPresented} />
        <Column alignment="center" spacing={8} modifiers={nativeFillWidth}>
          <UniversalTextContent
            testID={`${testID}-title`}
            fontSize={30}
            fontWeight="700"
            textStyle={{ textAlign: 'center' }}
          >
            {t(success ? 'otp.successTitle' : 'otp.title')}
          </UniversalTextContent>
          <UniversalTextContent textStyle={{ textAlign: 'center', color: colors.muted }}>
            {t(success ? 'otp.successDescription' : 'otp.description')}
          </UniversalTextContent>
          {!success && (
            <UniversalTextContent fontWeight="600" textStyle={{ textAlign: 'center' }}>
              {recipient}
            </UniversalTextContent>
          )}
        </Column>
        {!success && (
          <Column spacing={12} modifiers={nativeFillWidth}>
            <Row alignment="center" modifiers={nativeFillWidth}>
              <UniversalTextContent variant="caption" fontWeight="600">
                {t('otp.codeLabel')}
              </UniversalTextContent>
              <Spacer flexible />
              <UniversalTextContent
                variant="caption"
                textStyle={{ color: colors.muted }}
              >{`${code.length} / ${OTP_LENGTH}`}</UniversalTextContent>
            </Row>
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
                      return (
                        <Column
                          key={index}
                          alignment="center"
                          modifiers={nativeRowWeight}
                          style={{
                            height: 64,
                            paddingVertical: 14,
                            borderRadius: 14,
                            borderWidth: active || error ? 2 : 1,
                            borderColor: error
                              ? colors.error
                              : active || filled
                                ? colors.tint
                                : colors.border,
                            backgroundColor: error
                              ? colors.errorContainer
                              : filled || active
                                ? colors.selection
                                : colors.surface,
                          }}
                        >
                          <UniversalTextContent
                            fontSize={28}
                            fontWeight="600"
                            textStyle={{
                              textAlign: 'center',
                              color: filled ? colors.text : colors.muted,
                            }}
                          >
                            {code[index] ?? '·'}
                          </UniversalTextContent>
                        </Column>
                      );
                    })}
                  />
                </UniversalHost>
              </RNHostView>
            )}
            <UniversalTextContent
              testID={`${testID}-status`}
              variant="caption"
              textStyle={{
                color: error ? colors.error : resent ? colors.success : colors.muted,
                textAlign: 'center',
              }}
            >
              {error ? t(`otp.${error}`) : resent ? t('otp.resent') : (hint ?? t('otp.inputHint'))}
            </UniversalTextContent>
          </Column>
        )}
        <UniversalButtonContent
          variant={success ? 'success' : 'primary'}
          fullWidth
          contentPadding={12}
          borderRadius={16}
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
          <Column alignment="center" spacing={0} modifiers={nativeFillWidth}>
            <UniversalTextContent variant="caption" textStyle={{ color: colors.muted }}>
              {t('otp.noCode')}
            </UniversalTextContent>
            <UniversalButtonContent
              variant="link"
              testID={`${testID}-resend`}
              label={remaining > 0 ? t('otp.resendIn', { seconds: remaining }) : t('otp.resend')}
              disabled={remaining > 0 || busy}
              onPress={() => void resend()}
            />
          </Column>
        )}
        <Row alignment="center" spacing={6}>
          <Icon
            name={Icon.select({
              ios: 'lock.fill',
              android: require('@expo/material-symbols/lock.xml'),
            })}
            size={12}
            color={colors.muted}
          />
          <UniversalTextContent variant="caption" textStyle={{ color: colors.muted }}>
            {t('otp.security')}
          </UniversalTextContent>
        </Row>
      </Column>
    </ScrollView>
  );
}
