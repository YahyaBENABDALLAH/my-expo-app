import type { Preview } from '@storybook/react-native';

const preview: Preview = {
  parameters: {
    controls: {
      exclude: /^(testID|modifiers|children|ref|on[A-Z].*)$/,
      matchers: {
        color: /(background|color)$/i,
      },
    },
  },
};

export default preview;
