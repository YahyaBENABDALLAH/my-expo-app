import { Host } from '@expo/ui';
import type { ComponentProps } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = ComponentProps<typeof Host> & {
  inline?: boolean;
  viewportHeight?: number;
};

/** Common theme, native selector, and sizing defaults for hosted UI controls. */
export function UniversalHost({
  colorScheme,
  inline = false,
  viewportHeight,
  matchContents = viewportHeight !== undefined ? false : inline ? true : { vertical: true },
  style,
  ...props
}: Props) {
  const scheme = useColorScheme(colorScheme);

  return (
    <Host
      {...props}
      collapsable={false}
      colorScheme={scheme}
      matchContents={matchContents}
      style={[
        !inline && { width: '100%' },
        viewportHeight !== undefined && { height: viewportHeight },
        style,
      ]}
    />
  );
}
