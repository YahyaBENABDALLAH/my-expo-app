import { Button } from '@expo/ui';
import type { ButtonProps } from '@expo/ui';
import type { ColorSchemeName } from 'react-native';
import { buttonSeedColors } from '@/constants/colors';
import { UniversalHost } from './universal-host';

export type ButtonSemanticVariant = 'primary' | 'success' | 'warning' | 'destructive';
export type ButtonSize = 'compact' | 'regular' | 'large';
export type UniversalButtonVariant =
  'primary' | 'secondary' | 'link' | NonNullable<ButtonProps['variant']>;

export interface UniversalButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: UniversalButtonVariant;
  semanticVariant?: ButtonSemanticVariant;
  size?: ButtonSize;
  rounded?: boolean;
  colorScheme?: ColorSchemeName;
}

const nativeVariants: Record<UniversalButtonVariant, NonNullable<ButtonProps['variant']>> = {
  primary: 'filled',
  secondary: 'outlined',
  link: 'text',
  filled: 'filled',
  outlined: 'outlined',
  text: 'text',
};

const sizes: Record<ButtonSize, { height: number; paddingHorizontal: number }> = {
  compact: { height: 44, paddingHorizontal: 12 },
  regular: { height: 50, paddingHorizontal: 18 },
  large: { height: 58, paddingHorizontal: 24 },
};

export function UniversalButton({
  variant = 'primary',
  semanticVariant = 'primary',
  size = 'regular',
  rounded = false,
  colorScheme,
  style,
  ...buttonProps
}: UniversalButtonProps) {
  const dimensions = sizes[size];

  return (
    <UniversalHost
      testID={buttonProps.testID ? `${buttonProps.testID}-container` : undefined}
      inline
      seedColor={buttonSeedColors[semanticVariant]}
      colorScheme={colorScheme}
    >
      <Button
        {...buttonProps}
        variant={nativeVariants[variant]}
        style={{
          height: dimensions.height,
          paddingHorizontal: dimensions.paddingHorizontal,
          ...(rounded ? { borderRadius: dimensions.height / 2 } : {}),
          ...style,
        }}
      />
    </UniversalHost>
  );
}
