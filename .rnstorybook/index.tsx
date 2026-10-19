import AsyncStorage from '@react-native-async-storage/async-storage';
import type { InitialSelection, Params } from '@storybook/react-native';
import { ThemeProvider } from '@storybook/react-native-theming';
import { useState } from 'react';
import { View } from 'react-native';

import { view } from './storybook.requires';

const storage = {
  getItem: AsyncStorage.getItem,
  setItem: AsyncStorage.setItem,
};

function isStoryId(value?: string): value is Extract<InitialSelection, string> {
  return typeof value === 'string' && /^[a-z0-9-]+--[a-z0-9-]+$/.test(value);
}

const StorybookCanvas: NonNullable<Params['CustomUIComponent']> = ({ children, theme }) => {
  return (
    <ThemeProvider theme={theme}>
      <View testID="storybook-canvas" style={{ flex: 1 }}>
        {children}
      </View>
    </ThemeProvider>
  );
};

export default function StorybookUI({
  canvasMode = false,
  initialStoryId,
}: {
  canvasMode?: boolean;
  initialStoryId?: string;
}) {
  // The Router may load this screen after the native URL event has already fired.
  // Seed each mode from its route, retaining the generated component for its lifetime.
  // Storybook's native listener handles later links within the same mode.
  const [StorybookRoot] = useState(() =>
    view.getStorybookUI({
      initialSelection: isStoryId(initialStoryId)
        ? initialStoryId
        : canvasMode
          ? 'components-button--primary'
          : undefined,
      // The built-in UI-less canvas groups iOS descendants into one accessible
      // element. A custom canvas retains each control's native test target.
      onDeviceUI: true,
      CustomUIComponent: canvasMode ? StorybookCanvas : undefined,
      hasStoryWrapper: !canvasMode,
      shouldPersistSelection: !canvasMode,
      storage,
    }),
  );

  return <StorybookRoot />;
}
