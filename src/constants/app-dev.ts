/** Preview builds opt in to the same screen tools as local development. */
export const appDevEnabled = __DEV__ || process.env.EXPO_PUBLIC_ENABLE_DEV_SCREENS === 'true';
