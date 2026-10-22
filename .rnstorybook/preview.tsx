import type { Preview } from '@storybook/react-native';
import { themeIds } from '@/constants/themes/index';
import { StoryTheme } from './components/story-theme';

const preview: Preview = {
  args: { themeId: 'ux', colorScheme: 'light' },
  argTypes: {
    themeId: { control: 'select', options: themeIds },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
  },
  decorators: [
    (Story, { args: { themeId, ...args }, id }) => (
      <StoryTheme key={id} themeId={themeId} colorScheme={args.colorScheme}>
        {/* Theme selection belongs to the provider, not native component props. */}
        <Story args={args} />
      </StoryTheme>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    controls: {
      exclude: /^(testID|modifiers|children|ref|on[A-Z].*)$/,
      matchers: {
        color: /(background|color)$/i,
      },
    },
  },
};

export default preview;
