import Constants from 'expo-constants';
import { z } from 'zod';

const publicBrandSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  variant: z.enum(['development', 'preview', 'production']),
});

/** Only the selected public metadata reaches native consumers, never Node config. */
export function getAppBrand() {
  const result = publicBrandSchema.safeParse(Constants.expoConfig?.extra?.brand);
  if (!result.success) {
    throw new Error('Missing or invalid brand metadata. Restart Expo with the intended APP_BRAND.');
  }
  return result.data;
}
