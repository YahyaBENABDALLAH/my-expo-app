import { LocaleProvider } from 'expo-router';
import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import { I18nManager, View } from 'react-native';

export type LayoutDirection = 'ltr' | 'rtl';

type LayoutDirectionSettings = {
  direction: LayoutDirection;
  setDirection: (direction: LayoutDirection) => void;
};

const LayoutDirectionContext = createContext<LayoutDirectionSettings | undefined>(undefined);
const deviceDirection: LayoutDirection = I18nManager.isRTL ? 'rtl' : 'ltr';

/** Local direction updates preserve navigation, query cache and form state. */
export function LayoutDirectionProvider({
  children,
  initialDirection = deviceDirection,
}: PropsWithChildren<{ initialDirection?: LayoutDirection }>) {
  const [direction, setDirection] = useState(initialDirection);
  const value = useMemo(() => ({ direction, setDirection }), [direction]);

  return (
    <LayoutDirectionContext.Provider value={value}>
      <LocaleProvider direction={direction}>
        <View style={{ flex: 1, direction }}>{children}</View>
      </LocaleProvider>
    </LayoutDirectionContext.Provider>
  );
}

export function useLayoutDirection() {
  return useContext(LayoutDirectionContext)?.direction ?? deviceDirection;
}

export function useLayoutDirectionSettings() {
  const settings = useContext(LayoutDirectionContext);
  if (!settings) throw new Error('Layout direction settings require LayoutDirectionProvider.');
  return settings;
}
