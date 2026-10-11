import { Row, TextInput } from '@expo/ui';
import { Box } from '@expo/ui/jetpack-compose';
import { fillMaxWidth, height, semantics } from '@expo/ui/jetpack-compose/modifiers';
import type { OtpInputLayoutProps } from './otp-input-layout.types';

/** The topmost BasicTextField handles native typing, paste, selection and backspace. */
export function OtpInputLayout({ slots, input, accessibilityLabel }: OtpInputLayoutProps) {
  return (
    <Box contentAlignment="center" modifiers={[fillMaxWidth(), height(64)]}>
      <Row spacing={8} modifiers={[fillMaxWidth()]}>
        {slots}
      </Row>
      <TextInput
        {...input}
        modifiers={[fillMaxWidth(), semantics({ contentDescription: accessibilityLabel })]}
        style={{ height: 64, backgroundColor: 'transparent' }}
        textStyle={{ fontSize: 28, color: 'transparent' }}
      />
    </Box>
  );
}
