import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/use-theme';
import { Button, HStack, Text } from '@expo/ui/swift-ui';
import {
  accessibilityLabel,
  background,
  buttonStyle,
  fixedSize,
  foregroundStyle,
  frame,
  padding,
  shapes,
} from '@expo/ui/swift-ui/modifiers';
import { useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { UniversalHost } from '../host/universal-host';
import type { ErrorToastProps } from './error-toast.types';

export function ErrorToast({ message, onDismiss, colorScheme }: ErrorToastProps) {
  const { t } = useTranslation();
  const scheme = useColorScheme(colorScheme);
  const colors = useThemeColors(scheme);
  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const update = (screenReader: boolean) => {
      clearTimeout(timer);
      if (!active) return;
      if (screenReader) AccessibilityInfo.announceForAccessibility(message);
      else timer = setTimeout(onDismiss, 6000);
    };
    const subscription = AccessibilityInfo.addEventListener('screenReaderChanged', update);
    void AccessibilityInfo.isScreenReaderEnabled().then(update, () => update(false));
    return () => {
      active = false;
      clearTimeout(timer);
      subscription.remove();
    };
  }, [message, onDismiss]);
  return (
    <UniversalHost colorScheme={scheme} ignoreSafeArea="all">
      <HStack
        alignment="top"
        spacing={12}
        modifiers={[
          padding({ all: 12 }),
          frame({ maxWidth: Infinity, alignment: 'leading' }),
          background(colors.surface, shapes.roundedRectangle({ cornerRadius: 12 })),
        ]}
      >
        <Text
          testID="error-toast-message"
          modifiers={[
            foregroundStyle(colors.error),
            fixedSize({ horizontal: false, vertical: true }),
            frame({ maxWidth: Infinity, alignment: 'leading' }),
          ]}
        >
          {message}
        </Text>
        <Button
          label={t('common.dismiss')}
          testID="error-toast-dismiss"
          onPress={onDismiss}
          modifiers={[
            buttonStyle('borderless'),
            foregroundStyle(colors.text),
            accessibilityLabel(t('common.dismissError')),
          ]}
        />
      </HStack>
    </UniversalHost>
  );
}
