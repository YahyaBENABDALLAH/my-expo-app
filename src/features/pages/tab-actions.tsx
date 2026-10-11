import { type FloatingActionKind } from '@components/ui';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

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
type SetTabAction = (route: string, action: TabAction | undefined) => void;
const TabActionSetterContext = createContext<SetTabAction | null>(null);

export function TabActionsProvider({ children }: PropsWithChildren) {
  const [actions, setActions] = useState<Record<string, TabAction | undefined>>({});
  const setAction = useCallback<SetTabAction>((route, action) => {
    setActions((current) => {
      const previous = current[route];
      if (
        previous === action ||
        (previous &&
          action &&
          previous.kind === action.kind &&
          previous.label === action.label &&
          previous.onPress === action.onPress &&
          previous.disabled === action.disabled)
      )
        return current;
      const next = { ...current };
      if (action) next[route] = action;
      else delete next[route];
      return next;
    });
  }, []);
  const value = useMemo(() => ({ actions, setAction }), [actions, setAction]);
  return (
    <TabActionSetterContext.Provider value={setAction}>
      <TabActionContext.Provider value={value}>{children}</TabActionContext.Provider>
    </TabActionSetterContext.Provider>
  );
}

export function useTabActions() {
  const value = useContext(TabActionContext);
  if (!value) throw new Error('Tab actions require TabActionsProvider.');
  return value;
}

/** Registering screens consume only the stable command, not every tab's state. */
export function useSetTabAction() {
  const setAction = useContext(TabActionSetterContext);
  if (!setAction) throw new Error('Tab actions require TabActionsProvider.');
  return setAction;
}

/** Keep the committed press handler fresh without publishing each draft edit. */
export function useRegisterTabAction(route: string, { kind, label, disabled, onPress }: TabAction) {
  const setAction = useSetTabAction();
  const latestPress = useRef(onPress);
  useLayoutEffect(() => {
    latestPress.current = onPress;
  }, [onPress]);
  const press = useCallback(() => latestPress.current(), []);
  useEffect(() => {
    setAction(route, { kind, label, disabled, onPress: press });
    return () => setAction(route, undefined);
  }, [route, kind, label, disabled, press, setAction]);
}
