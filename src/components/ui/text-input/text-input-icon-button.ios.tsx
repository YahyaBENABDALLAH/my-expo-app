import { Button } from '@expo/ui';
import type { TextInputIconButtonProps } from './text-input-icon-button.types';
import { rightIconLabel } from './text-input-modifiers';

export function TextInputIconButton({ accessibilityLabel, ...props }: TextInputIconButtonProps) {
  return (
    <Button
      {...props}
      variant="text"
      style={{ width: 48, height: 48 }}
      modifiers={accessibilityLabel ? rightIconLabel(accessibilityLabel) : undefined}
    />
  );
}
