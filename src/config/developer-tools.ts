// Expo inlines public flags. These are build/update choices, not saved preferences.
export const developerScreensEnabled = process.env.EXPO_PUBLIC_ENABLE_DEV_SCREENS === 'true';

export const storybookEnabled = __DEV__ && process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';
