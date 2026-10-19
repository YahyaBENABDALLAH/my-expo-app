import { createContext } from 'react';
import type { usePageWaveMotion } from './use-page-wave-motion';

export const PageWaveContext = createContext<ReturnType<typeof usePageWaveMotion> | null>(null);
