import { createContext } from 'react';

/** The initial page frame reports native layout before startup selectors appear. */
export const StartupLayoutContext = createContext<(() => void) | undefined>(undefined);
