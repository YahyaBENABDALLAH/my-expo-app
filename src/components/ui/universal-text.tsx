import { Text } from '@expo/ui';
import type { TextProps, UniversalFontWeight } from '@expo/ui';
import Colors from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { UniversalHost } from './universal-host';

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

export function UniversalText({
  variant = 'body',
  fontWeight,
  fontSize,
  lightColor = Colors.light.text,
  darkColor = Colors.dark.text,
  colorScheme,
  textStyle,
  ...textProps
}: UniversalTextProps) {
  const activeColorScheme = useColorScheme(colorScheme);
  const preset = variants[variant];
  const resolvedFontSize = fontSize ?? preset.fontSize;

  return (
    <UniversalHost
      testID={textProps.testID ? `${textProps.testID}-container` : undefined}
      colorScheme={activeColorScheme}
    >
      <Text
        {...textProps}
        textStyle={{
          fontSize: resolvedFontSize,
          fontWeight: fontWeight ?? preset.fontWeight,
          lineHeight: Math.round(resolvedFontSize * 1.25),
          color: activeColorScheme === 'dark' ? darkColor : lightColor,
          ...textStyle,
        }}
      />
    </UniversalHost>
  );
}
