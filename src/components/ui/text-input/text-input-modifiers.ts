import type { RowProps, TextInputProps } from '@expo/ui';

// Metro selects the native implementation; this file supplies the shared types.
export declare const inputRowFlex: NonNullable<TextInputProps['modifiers']>;
export declare function rightIconLabel(label: string): NonNullable<TextInputProps['modifiers']>;
export declare function inputFieldAppearance(
  style: NonNullable<RowProps['style']>,
): Pick<RowProps, 'style' | 'modifiers'>;
