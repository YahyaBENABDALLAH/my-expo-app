import { type FloatingActionKind } from '@components/ui';
import { createContext, useContext, useState, type PropsWithChildren } from 'react';

type TabAction = {
  kind: FloatingActionKind;
  label: string;
  onPress: () => void;
  disabled?: boolean;
};
const TabActionContext = createContext<{
  actions: Record<string, TabAction | undefined>;
  setAction: (route: string, action: TabAction | undefined) => void;
} | null>(null);

export function TabActionsProvider({ children }: PropsWithChildren) {
  const [actions, setActions] = useState<Record<string, TabAction | undefined>>({});
  const [setAction] = useState(() => (route: string, action: TabAction | undefined) => {
    setActions((current) => ({ ...current, [route]: action }));
  });
  return (
    <TabActionContext.Provider value={{ actions, setAction }}>{children}</TabActionContext.Provider>
  );
}

export function useTabActions() {
  const value = useContext(TabActionContext);
  if (!value) throw new Error('Tab actions require TabActionsProvider.');
  return value;
}
