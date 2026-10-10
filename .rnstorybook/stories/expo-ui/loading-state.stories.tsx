import {
  AuroraBackground,
  Column,
  ScrollView,
  UniversalHost,
  UniversalTextContent as Text,
  UniversalButtonContent,
  LoadingScreen,
  QueryContent,
  type ContentQuery,
  nativeFillWidth,
} from '@components/ui';
import { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

type State =
  'loading' | 'offline' | 'disabled' | 'error' | 'empty' | 'ready' | 'refreshing' | 'refresh-error';
type Props = { state: State; colorScheme: 'light' | 'dark' };

function LoadingDemo({ state: initial, colorScheme }: Props) {
  const [state, setState] = useState(initial);
  const cached = ['empty', 'ready', 'refreshing', 'refresh-error'].includes(state);
  const fetching = state === 'loading' || state === 'refreshing';
  const query: ContentQuery<string[]> = {
    data: cached ? (state === 'empty' ? [] : ['Saved recipe']) : undefined,
    error:
      state === 'error' || state === 'refresh-error' ? new globalThis.Error('Fixture error') : null,
    fetchStatus: fetching ? 'fetching' : state === 'offline' ? 'paused' : 'idle',
    isFetching: fetching,
    isEnabled: state !== 'disabled',
    refetch: () => setState('ready'),
  };
  return (
    <UniversalHost colorScheme={colorScheme} matchContents={false} style={{ flex: 1 }}>
      <ScrollView>
        <Column spacing={16} modifiers={nativeFillWidth} style={{ padding: 24 }}>
          <Text variant="title" testID="loading-demo-title">
            Loading states
          </Text>
          <QueryContent
            query={query}
            empty={query.data?.length === 0}
            disabledMessage="Sign in to view your recipes."
          >
            <Text testID="loading-demo-content">Saved recipe</Text>
          </QueryContent>
          <UniversalButtonContent
            variant="secondary"
            label="Start loading"
            onPress={() => setState('loading')}
          />
          <UniversalButtonContent
            variant="primary"
            label="Complete loading"
            testID="loading-demo-complete"
            onPress={() => setState('ready')}
          />
          <UniversalButtonContent
            variant="secondary"
            label="Go offline"
            onPress={() => setState('offline')}
          />
        </Column>
      </ScrollView>
    </UniversalHost>
  );
}

const meta = {
  title: 'Expo UI/Loading State',
  component: LoadingDemo,
  args: { state: 'loading', colorScheme: 'dark' },
  argTypes: {
    state: {
      control: 'select',
      options: [
        'loading',
        'offline',
        'disabled',
        'error',
        'empty',
        'ready',
        'refreshing',
        'refresh-error',
      ],
    },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
  },
  render: (args) => <LoadingDemo key={args.state} {...args} />,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, { args }) => (
      <View style={{ flex: 1 }}>
        <AuroraBackground
          colorScheme={args.colorScheme}
          animate={false}
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
        />
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof LoadingDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Loading: Story = {};
export const Offline: Story = { args: { state: 'offline' } };
export const Disabled: Story = { args: { state: 'disabled' } };
export const Error: Story = { args: { state: 'error' } };
export const Empty: Story = { args: { state: 'empty' } };
export const Refreshing: Story = { args: { state: 'refreshing' } };
export const RefreshError: Story = { args: { state: 'refresh-error' } };
export const LightTheme: Story = { args: { colorScheme: 'light' } };
export const Fullscreen: Story = {
  render: (args) => <LoadingScreen colorScheme={args.colorScheme} label="Loading map…" />,
};
