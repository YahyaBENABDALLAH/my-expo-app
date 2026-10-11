import { Column, Icon, Row } from '@expo/ui';
import { IconButton, Shape, Surface } from '@expo/ui/jetpack-compose';
import { fillMaxWidth, semantics, size, testID, weight } from '@expo/ui/jetpack-compose/modifiers';
import { useTranslation } from 'react-i18next';

import { useThemeColors } from '@/hooks/use-theme';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { UniversalTextContent } from '../text/universal-text';
import type { ToastProps } from './toast.types';
import { getToastPresentation } from './toast-presentation';
import { useToastLifetime } from './use-toast-lifetime';

const toastIcons = {
  error: require('@expo/material-symbols/error.xml'),
  success: require('@expo/material-symbols/check_circle.xml'),
  warning: require('@expo/material-symbols/warning.xml'),
};

export function Toast({ variant, message, title, onDismiss, colorScheme }: ToastProps) {
  const { t } = useTranslation();
  const scheme = useHostColorScheme(colorScheme);
  const colors = useThemeColors(scheme);
  const presentation = getToastPresentation(variant, colors);
  const heading = title?.trim() || t(presentation.titleKey);
  useToastLifetime(heading + '. ' + message, onDismiss);

  return (
    <UniversalHost colorScheme={scheme} ignoreSafeArea="all">
      <Surface
        color={colors.surfaceRaised}
        shadowElevation={6}
        shape={Shape.RoundedCorner({
          cornerRadii: { topStart: 20, topEnd: 20, bottomStart: 20, bottomEnd: 20 },
        })}
        modifiers={[fillMaxWidth()]}
      >
        <Row
          alignment="start"
          spacing={12}
          style={{ paddingLeft: 16, paddingRight: 8, paddingVertical: 16 }}
          modifiers={[fillMaxWidth()]}
        >
          <Row
            alignment="center"
            style={{ padding: 9, borderRadius: 12, backgroundColor: presentation.container }}
          >
            <Icon name={toastIcons[variant]} size={22} color={presentation.accent} />
          </Row>
          <Column alignment="start" spacing={4} modifiers={[weight(1)]}>
            <UniversalTextContent testID="toast-title" fontSize={15} fontWeight="600">
              {heading}
            </UniversalTextContent>
            <UniversalTextContent
              testID="toast-message"
              fontSize={14}
              textStyle={{ color: colors.muted, lineHeight: 20 }}
            >
              {message}
            </UniversalTextContent>
          </Column>
          <IconButton
            onClick={onDismiss}
            colors={{ contentColor: colors.muted }}
            modifiers={[
              size(48, 48),
              semantics({ contentDescription: t('common.dismissNotification') }),
              testID('toast-dismiss'),
            ]}
          >
            <Icon
              name={require('@expo/material-symbols/close.xml')}
              size={18}
              color={colors.muted}
            />
          </IconButton>
        </Row>
      </Surface>
    </UniversalHost>
  );
}
