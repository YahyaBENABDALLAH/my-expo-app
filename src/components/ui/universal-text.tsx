import { Text } from '@expo/ui';
import type { TextProps, UniversalFontWeight } from '@expo/ui';
import { useThemeColors } from '@/hooks/use-theme';
import { UniversalHost, useHostColorScheme } from './universal-host';

export type UniversalTextVariant = 'heading' | 'title' | 'body' | 'caption';
export type UniversalTextColorScheme = 'light' | 'dark';

export interface UniversalTextProps extends TextProps {
  variant?: UniversalTextVariant;
  fontWeight?: UniversalFontWeight;
  fontSize?: number;
  lightColor?: string;
  darkColor?: string;
  colorScheme?: UniversalTextColorScheme;
}

const variants: Record<
  UniversalTextVariant,
  { fontSize: number; fontWeight: UniversalFontWeight }
> = {
  heading: { fontSize: 36, fontWeight: '700' },
  title: { fontSize: 26, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 13, fontWeight: '400' },
};

export function UniversalText({ colorScheme, ...props }: UniversalTextProps) {
  return (
    <UniversalHost
      testID={props.testID ? `${props.testID}-container` : undefined}
      colorScheme={colorScheme}
    >
      <UniversalTextContent {...props} colorScheme={colorScheme} />
    </UniversalHost>
  );
}

/** Native text for composition inside an existing Host. */
export function UniversalTextContent({
  variant = 'body',
  fontWeight,
  fontSize,
  lightColor,
  darkColor,
  colorScheme,
  textStyle,
  ...textProps
}: UniversalTextProps) {
  const activeColorScheme = useHostColorScheme(colorScheme);
  const colors = useThemeColors(activeColorScheme);
  const preset = variants[variant];
  const resolvedFontSize = fontSize ?? preset.fontSize;

  return (
    <Text
      {...textProps}
      textStyle={{
        fontSize: resolvedFontSize,
        fontWeight: fontWeight ?? preset.fontWeight,
        lineHeight: Math.round(resolvedFontSize * 1.25),
        color: (activeColorScheme === 'dark' ? darkColor : lightColor) ?? colors.text,
        ...textStyle,
      }}
    />
  );
}
