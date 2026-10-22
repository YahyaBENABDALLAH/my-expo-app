export interface NativeAlertProps {
  title: string;
  message: string;
  confirmLabel: string;
  onDismiss: () => void;
}

export declare function NativeAlert(props: NativeAlertProps): import('react').ReactElement;
