import {
  Column,
  ScrollView,
  UniversalHost,
  UniversalTextContent as Text,
  UniversalButtonContent,
  QueryContent,
  type ContentQuery,
  nativeFillWidth,
} from '@components/ui';
import { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import LoadingScreen from '@/features/ui-showcase/loading-screen';

type State =
  'loading' | 'offline' | 'disabled' | 'error' | 'empty' | 'ready' | 'refreshing' | 'refresh-error';

type Props = { state: State; colorScheme: 'light' | 'dark' };

function LoadingDemo({ state: initial, colorScheme }: Props) {
  const [state, setState] = useState(initial);
  const cached = ['empty', 'ready', 'refreshing', 'refresh-error'].includes(state);
  const fetching = state === 'loading' || state === 'refreshing';
  const cachedData = state === 'empty' ? [] : ['Saved recipe'];
  const settledFetchStatus = state === 'offline' ? 'paused' : 'idle';
  const query: ContentQuery<string[]> = {
    data: cached ? cachedData : undefined,
    error:
      state === 'error' || state === 'refresh-error' ? new globalThis.Error('Fixture error') : null,
    fetchStatus: fetching ? 'fetching' : settledFetchStatus,
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
            testID="loading-demo-start"
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
            testID="loading-demo-offline"
            onPress={() => setState('offline')}
          />
        </Column>
      </ScrollView>
    </UniversalHost>
  );
}

const meta = {
  title: 'Components/Loading State',
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
  },
  render: (args) => <LoadingDemo key={args.state} {...args} />,
  decorators: [
    (Story) => (
      <View style={{ flex: 1 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof LoadingDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {};

export const ErrorState: Story = { name: 'Error', args: { state: 'error' } };

export const Refreshing: Story = { args: { state: 'refreshing' } };

export const RepeatedQueries: Story = { render: () => <LoadingScreen /> };
