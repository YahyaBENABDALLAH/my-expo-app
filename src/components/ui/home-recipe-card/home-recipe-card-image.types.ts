import type { ImageSource } from 'expo-image';
import type { ReactNode } from 'react';

export type HomeRecipeCardImageProps = {
  source: ImageSource | number;
  width: number;
  height: number;
  top?: ReactNode;
  bottom?: ReactNode;
};
