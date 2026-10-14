import { Host } from '@expo/ui';
import { createContext, useContext, type ComponentProps, type Ref } from 'react';
import type { ColorSchemeName, View } from 'react-native';

import { useLayoutDirection } from '@/context/layout-direction.context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColors } from '@/hooks/use-theme';

const HostColorSchemeContext = createContext<'light' | 'dark' | undefined>(undefined);
type HostLayoutDirection = NonNullable<ComponentProps<typeof Host>['layoutDirection']>;
const HostLayoutDirectionContext = createContext<HostLayoutDirection | undefined>(undefined);

/** Nested native and RN boundaries retain explicit Storybook direction overrides. */
export function useHostLayoutDirection(preferredDirection?: HostLayoutDirection) {
  const inheritedDirection = useContext(HostLayoutDirectionContext);
  const appDirection = useLayoutDirection();
  return (
    preferredDirection ??
    inheritedDirection ??
    (appDirection === 'rtl' ? 'rightToLeft' : 'leftToRight')
  );
}

/** Project content follows its owning Host, including deterministic story themes. */
export function useHostColorScheme(preferredScheme?: ColorSchemeName) {
  const inheritedScheme = useContext(HostColorSchemeContext);
  return useColorScheme(preferredScheme ?? inheritedScheme);
}

type Props = ComponentProps<typeof Host> & {
  /** Forwarded to the native Host for RN animation and imperative view access. */
  ref?: Ref<View>;
  inline?: boolean;
  viewportHeight?: number;
};

function defaultMatchContents(viewportHeight: number | undefined, inline: boolean) {
  if (viewportHeight !== undefined) return false;
  if (inline) return true;
  return { vertical: true };
}

/** Common theme, native selector, and sizing defaults for hosted UI controls. */
export function UniversalHost({
  colorScheme,
  layoutDirection,
  seedColor,
  inline = false,
  viewportHeight,
  matchContents = defaultMatchContents(viewportHeight, inline),
  style,
  ...props
}: Props) {
  const scheme = useHostColorScheme(colorScheme);
  const colors = useThemeColors(scheme);
  const direction = useHostLayoutDirection(layoutDirection);

  return (
    <HostColorSchemeContext.Provider value={scheme}>
      <HostLayoutDirectionContext.Provider value={direction}>
        <Host
          {...props}
          collapsable={false}
          colorScheme={scheme}
          layoutDirection={direction}
          seedColor={seedColor ?? colors.tint}
          matchContents={matchContents}
          style={[
            { direction: direction === 'rightToLeft' ? 'rtl' : 'ltr' },
            !inline && { width: '100%' },
            viewportHeight !== undefined && { height: viewportHeight },
            style,
          ]}
        />
      </HostLayoutDirectionContext.Provider>
    </HostColorSchemeContext.Provider>
  );
}
