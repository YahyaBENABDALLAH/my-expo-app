import { Host } from '@expo/ui';
import type { ReactNode } from 'react';
import { useAppTheme } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';
import { NativeButtonContent } from './universal-button-content';

export type UniversalButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'link'
  | 'success'
  | 'warning'
  | 'info'
  | 'destructive'
  /** Native glass on iOS 26+; native automatic on older iOS, outlined on Android. */
  | 'glass';

export type UniversalButtonContentProps = {
  variant: UniversalButtonVariant;
  label?: string;
  children?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
  fullWidth?: boolean;
  /** Corner radius in iOS points / Android dp. Omit for native defaults; 0 is square. */
  borderRadius?: number;
  /** Override label padding, for example 0 for a whole recipe card. */
  contentPadding?: number;
  /** Override the variant's accent color. */
  color?: string;
  /** Override the native label color. */
  contentColor?: string;
};

export type UniversalButtonProps = UniversalButtonContentProps & {
  colorScheme?: 'light' | 'dark';
  /** Physical corners of the standalone Host. Overrides borderRadius; omitted corners are square. */
  cornerRadii?: {
    topLeft?: number;
    topRight?: number;
    bottomLeft?: number;
    bottomRight?: number;
  };
};

/** Resolve shared semantic colors once; explicit caller colors keep native fallback behavior. */
function useButtonColors({ variant, color, contentColor, colorScheme }: UniversalButtonProps) {
  const { colors } = useAppTheme(useHostColorScheme(colorScheme));
  if (color !== undefined || contentColor !== undefined) return { color, contentColor };
  switch (variant) {
    case 'primary':
      return { color: colors.primary, contentColor: colors.onPrimary };
    case 'secondary':
      return { color: colors.secondary, contentColor: colors.secondary };
    case 'tertiary':
      return { color: colors.muted, contentColor: colors.muted };
    case 'link':
      return { color: colors.tint, contentColor: colors.tint };
    case 'success':
      return { color: colors.success, contentColor: colors.onSuccess };
    case 'warning':
      return { color: colors.warning, contentColor: colors.onWarning };
    case 'info':
      return { color: colors.info, contentColor: colors.onInfo };
    case 'destructive':
      return { color: colors.error, contentColor: colors.onError };
    case 'glass':
      return { color: colors.surfaceVariant, contentColor: colors.text };
  }
}

/** Native content. Compose inside an existing Host. */
export function UniversalButtonContent(props: UniversalButtonContentProps) {
  const colors = useButtonColors(props);
  return <NativeButtonContent {...props} {...colors} />;
}

/** Standalone control. Inside an existing Host, use UniversalButtonContent. */
export function UniversalButton({ colorScheme, cornerRadii, ...props }: UniversalButtonProps) {
  const colors = useButtonColors({ ...props, colorScheme });
  return (
    <Host
      testID={props.testID ? `${props.testID}-container` : undefined}
      matchContents={props.fullWidth ? { vertical: true } : true}
      style={[
        props.fullWidth ? { width: '100%' } : undefined,
        // SwiftUI's native button shape only supports a uniform radius. Clip the
        // existing RN boundary, without painting another surface or adding a Host.
        cornerRadii && {
          overflow: 'hidden',
          borderTopLeftRadius: cornerRadii.topLeft ?? 0,
          borderTopRightRadius: cornerRadii.topRight ?? 0,
          borderBottomLeftRadius: cornerRadii.bottomLeft ?? 0,
          borderBottomRightRadius: cornerRadii.bottomRight ?? 0,
        },
      ]}
      colorScheme={colorScheme}
    >
      <NativeButtonContent
        {...props}
        {...colors}
        borderRadius={cornerRadii ? 0 : props.borderRadius}
      />
    </Host>
  );
}
