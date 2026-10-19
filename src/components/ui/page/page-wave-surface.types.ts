import type { RefObject } from 'react';
import type { View } from 'react-native';
import type { usePageWaveMotion } from './use-page-wave-motion';

export type PageWaveSurfaceProps = {
  wave: ReturnType<typeof usePageWaveMotion>;
  blurTarget: RefObject<View | null>;
  colorScheme: 'light' | 'dark';
  backgroundColor: string;
  reduceTransparency: boolean;
};
