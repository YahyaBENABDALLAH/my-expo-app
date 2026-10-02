import { use } from 'react';
import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';

let skiaPromise: Promise<void> | null = null;

export function AsyncSkia() {
  skiaPromise ??= LoadSkiaWeb();
  use(skiaPromise);
  return null;
}
