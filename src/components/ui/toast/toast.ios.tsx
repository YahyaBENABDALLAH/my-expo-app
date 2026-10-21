import { spacing, radii } from '@/constants/layout';
import { Column, Icon, Row } from '@expo/ui';
import { Button } from '@expo/ui/swift-ui';
import {
  accessibilityHidden,
  accessibilityLabel,
  background,
  buttonStyle,
  contentShape,
  fixedSize,
  frame,
  padding,
  shadow,
  shapes,
} from '@expo/ui/swift-ui/modifiers';
import { useTranslation } from 'react-i18next';

import { useThemeColors } from '@/hooks/use-theme';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { UniversalTextContent } from '../text/universal-text';
import type { ToastProps } from './toast.types';
import { getToastPresentation } from './toast-presentation';
import { useToastLifetime } from './use-toast-lifetime';

const toastIcons = {
  error: 'exclamationmark.circle.fill',
  success: 'checkmark.circle.fill',
  warning: 'exclamationmark.triangle.fill',
  info: 'info.circle.fill',
} as const;

export function Toast({ variant, message, title, onDismiss, colorScheme }: ToastProps) {
  const { t } = useTranslation();
  const scheme = useHostColorScheme(colorScheme);
  const colors = useThemeColors(scheme);
  const presentation = getToastPresentation(variant, colors);
  const heading = title?.trim() || t(presentation.titleKey);
  useToastLifetime(heading + '. ' + message, onDismiss);

  return (
    <UniversalHost colorScheme={scheme} ignoreSafeArea="all">
      <Row
        alignment="start"
        spacing={spacing.md}
        modifiers={[
          padding({ all: spacing.lg }),
          frame({ maxWidth: Infinity, alignment: 'leading' }),
          background(colors.surfaceRaised, shapes.roundedRectangle({ cornerRadius: radii.card })),
          shadow({ radius: 12, y: 4, color: colors.shadow }),
        ]}
      >
        <Icon
          name={toastIcons[variant]}
          size={22}
          color={presentation.accent}
          modifiers={[
            frame({ width: 40, height: 40 }),
            background(
              presentation.container,
              shapes.roundedRectangle({ cornerRadius: radii.control }),
            ),
            accessibilityHidden(),
          ]}
        />
        <Column
          alignment="start"
          spacing={spacing.xs}
          modifiers={[frame({ maxWidth: Infinity, alignment: 'leading' })]}
        >
          <UniversalTextContent
            testID="toast-title"
            fontSize={15}
            fontWeight="600"
            modifiers={[fixedSize({ horizontal: false, vertical: true })]}
          >
            {heading}
          </UniversalTextContent>
          <UniversalTextContent
            testID="toast-message"
            fontSize={14}
            textStyle={{ color: colors.muted, lineHeight: 20 }}
            modifiers={[
              fixedSize({ horizontal: false, vertical: true }),
              frame({ maxWidth: Infinity, alignment: 'leading' }),
            ]}
          >
            {message}
          </UniversalTextContent>
        </Column>
        <Button
          testID="toast-dismiss"
          onPress={onDismiss}
          modifiers={[buttonStyle('plain'), accessibilityLabel(t('common.dismissNotification'))]}
        >
          <Icon
            name="xmark"
            size={16}
            color={colors.muted}
            modifiers={[frame({ width: 44, height: 44 }), contentShape(shapes.rectangle())]}
          />
        </Button>
      </Row>
    </UniversalHost>
  );
}
