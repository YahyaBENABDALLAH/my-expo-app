import { Host } from '@expo/ui';
import { createContext, useContext, type ComponentProps, type Ref } from 'react';
import type { ColorSchemeName, View } from 'react-native';

import { useLayoutDirection } from '@/context/layout-direction.context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColors } from '@/hooks/use-theme';
import type { UniversalButtonPalette } from '../button/universal-button.types';

const HostColorSchemeContext = createContext<'light' | 'dark' | undefined>(undefined);
const HostButtonPaletteContext = createContext<UniversalButtonPalette | undefined>(undefined);
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

export function useHostButtonPalette(
  palette?: UniversalButtonPalette,
  colorScheme?: ColorSchemeName,
) {
  const inherited = useContext(HostButtonPaletteContext);
  const colors = useThemeColors(useHostColorScheme(colorScheme));
  return palette ?? inherited ?? colors;
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
  buttonPalette?: UniversalButtonPalette;
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
  buttonPalette,
  matchContents = defaultMatchContents(viewportHeight, inline),
  style,
  ...props
}: Props) {
  const scheme = useHostColorScheme(colorScheme);
  const colors = useThemeColors(scheme);
  const inheritedPalette = useContext(HostButtonPaletteContext);
  const palette = buttonPalette ?? inheritedPalette;
  const direction = useHostLayoutDirection(layoutDirection);

  return (
    <HostColorSchemeContext.Provider value={scheme}>
      <HostButtonPaletteContext.Provider value={palette}>
        <HostLayoutDirectionContext.Provider value={direction}>
          <Host
            {...props}
            collapsable={false}
            colorScheme={scheme}
            layoutDirection={direction}
            seedColor={seedColor ?? palette?.tint ?? colors.tint}
            matchContents={matchContents}
            style={[
              { direction: direction === 'rightToLeft' ? 'rtl' : 'ltr' },
              !inline && { width: '100%' },
              viewportHeight !== undefined && { height: viewportHeight },
              style,
            ]}
          />
        </HostLayoutDirectionContext.Provider>
      </HostButtonPaletteContext.Provider>
    </HostColorSchemeContext.Provider>
  );
}
