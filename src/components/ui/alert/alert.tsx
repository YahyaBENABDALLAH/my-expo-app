import { useCallback, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { dismissAlert, getAlert, subscribeAlerts, type AlertOptions } from '@/lib/alerts';
import { UniversalHost } from '../host/universal-host';
import { NativeAlert } from './native-alert';

export type { AlertVariant } from '@/lib/alerts';

export interface AlertProps extends AlertOptions {
  onDismiss: () => void;
  colorScheme?: 'light' | 'dark';
}

const titleKeys = {
  error: 'common.errorNotificationTitle',
  success: 'common.successNotificationTitle',
  warning: 'common.warningNotificationTitle',
  info: 'common.infoNotificationTitle',
} as const;

/** Mount while visible; Expo UI owns the native modal and its accessibility. */
export function Alert({ variant, title, message, onDismiss, colorScheme }: AlertProps) {
  const { t } = useTranslation();
  return (
    <UniversalHost
      colorScheme={colorScheme}
      matchContents={false}
      ignoreSafeArea="all"
      pointerEvents="box-none"
      style={{ position: 'absolute', width: 1, height: 1 }}
    >
      <NativeAlert
        title={title ?? t(titleKeys[variant])}
        message={message}
        confirmLabel={t('common.ok')}
        onDismiss={onDismiss}
      />
    </UniversalHost>
  );
}

/** One root presenter keeps queued feedback available across navigation. */
export function AlertHost() {
  const alert = useSyncExternalStore(subscribeAlerts, getAlert);
  const id = alert?.id;
  const dismiss = useCallback(() => {
    if (id !== undefined) dismissAlert(id);
  }, [id]);
  return alert ? <Alert key={alert.id} {...alert} onDismiss={dismiss} /> : null;
}
