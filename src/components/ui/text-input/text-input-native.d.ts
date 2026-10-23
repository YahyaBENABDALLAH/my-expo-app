import type { RowProps, TextInputProps } from '@expo/ui';
import type { ReactElement, ReactNode } from 'react';

// Metro selects the native implementation; this file supplies the shared types.
export declare const inputRowFlex: NonNullable<TextInputProps['modifiers']>;
export declare function inputAccessibilityModifiers(
  label?: string,
): NonNullable<TextInputProps['modifiers']>;
export declare function inputFieldAppearance(
  style: NonNullable<RowProps['style']>,
): Pick<RowProps, 'style' | 'modifiers'>;

/** Only the props implemented by both native icon buttons. */
export interface TextInputIconButtonProps {
  children: ReactNode;
  disabled?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  testID?: string;
}

export declare function TextInputIconButton(props: TextInputIconButtonProps): ReactElement;
