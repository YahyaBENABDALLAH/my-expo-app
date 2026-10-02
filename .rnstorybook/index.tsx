import AsyncStorage from '@react-native-async-storage/async-storage';

import { view } from './storybook.requires';

const storage = {
  getItem: AsyncStorage.getItem,
  setItem: AsyncStorage.setItem,
};

// Storybook selects the story from the native link's STORYBOOK_STORY_ID parameter.
// Create stable component types outside render so their state is retained.
export const StorybookCanvas = view.getStorybookUI({
  initialSelection: 'expo-ui-universal-button--primary',
  onDeviceUI: false,
  shouldPersistSelection: false,
  storage,
});

const StorybookUI = view.getStorybookUI({ storage });

export default StorybookUI;
