import { Alert, Button, Spacer, Text } from '@expo/ui/swift-ui';
import { frame } from '@expo/ui/swift-ui/modifiers';
import type { NativeAlertProps } from './native-alert';

export function NativeAlert({ title, message, confirmLabel, onDismiss }: NativeAlertProps) {
  return (
    <Alert
      title={title}
      isPresented
      onIsPresentedChange={(presented) => {
        if (!presented) onDismiss();
      }}
    >
      <Alert.Trigger>
        {/* SwiftUI requires a mounted trigger even for programmatic presentation. */}
        <Spacer minLength={0} modifiers={[frame({ width: 1, height: 1 })]} />
      </Alert.Trigger>
      <Alert.Message>
        <Text testID="app-alert-message">{message}</Text>
      </Alert.Message>
      <Alert.Actions>
        <Button label={confirmLabel} role="cancel" testID="app-alert-dismiss" />
      </Alert.Actions>
    </Alert>
  );
}
