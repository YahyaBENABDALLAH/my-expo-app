import { spacing } from '@/constants/layout';
import { Row, TextInput } from '@expo/ui';
import { Box } from '@expo/ui/jetpack-compose';
import {
  fillMaxWidth,
  height as nativeHeight,
  semantics,
} from '@expo/ui/jetpack-compose/modifiers';
import type { OtpInputLayoutProps } from './otp-input-layout';

/** The topmost BasicTextField handles native typing, paste, selection and backspace. */
export function OtpInputLayout({ slots, input, accessibilityLabel, height }: OtpInputLayoutProps) {
  return (
    <Box contentAlignment="center" modifiers={[fillMaxWidth(), nativeHeight(height)]}>
      <Row spacing={spacing.sm} modifiers={[fillMaxWidth()]}>
        {slots}
      </Row>
      <TextInput
        {...input}
        modifiers={[fillMaxWidth(), semantics({ contentDescription: accessibilityLabel })]}
        style={{ height, backgroundColor: 'transparent' }}
        textStyle={{ fontSize: 28, color: 'transparent' }}
      />
    </Box>
  );
}
