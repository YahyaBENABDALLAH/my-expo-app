import {
  NativeField,
  PageScreen,
  UniversalButtonContent,
  UniversalTextContent as Text,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import { useEffect, useRef, useState } from 'react';

const meta = {
  title: 'Pages/Navigation shell',
  component: PageScreen,
  args: {
    title: 'My recipes',
    description: 'Your saved recipes, viewing history, and creations.',
    tab: true,
    actions: [],
    colorScheme: 'light',
  },
  parameters: { layout: 'fullscreen' },
  argTypes: { colorScheme: { control: 'select', options: ['light', 'dark'] } },
} satisfies Meta<typeof PageScreen>;
export default meta;
type Story = StoryObj<typeof meta>;
// StorybookScreen already protects the actual device edges around its canvas.
const canvasInsets: Story['decorators'] = [
  (Story) => (
    <SafeAreaInsetsContext.Provider value={{ top: 0, bottom: 0, left: 0, right: 0 }}>
      <Story />
    </SafeAreaInsetsContext.Provider>
  ),
];
export const Default: Story = { decorators: canvasInsets };
export const Dark: Story = { decorators: canvasInsets, args: { colorScheme: 'dark' } };
const notchedInsets: Story['decorators'] = [
  (Story) => (
    <SafeAreaInsetsContext.Provider value={{ top: 59, bottom: 34, left: 0, right: 0 }}>
      <Story />
    </SafeAreaInsetsContext.Provider>
  ),
];
export const NotchedPhone: Story = { decorators: notchedInsets };
export const LandscapeCutout: Story = {
  decorators: [
    (Story) => (
      <SafeAreaInsetsContext.Provider value={{ top: 0, bottom: 21, left: 59, right: 0 }}>
        <Story />
      </SafeAreaInsetsContext.Provider>
    ),
  ],
};
function BackExample(props: Parameters<typeof PageScreen>[0]) {
  const [presses, setPresses] = useState(0);
  return (
    <PageScreen {...props} onBack={() => setPresses((count) => count + 1)}>
      <Text testID="page-back-presses">{`Back presses: ${presses}`}</Text>
    </PageScreen>
  );
}

export const HeaderWithBackArrow: Story = {
  args: {
    tab: false,
    title: 'Saved recipes',
    description: 'Home’s title style with a native back arrow. The page owns its safe areas.',
  },
  render: (args) => <BackExample {...args} />,
  decorators: notchedInsets,
};
export const DarkHeaderWithBackArrow: Story = {
  ...HeaderWithBackArrow,
  args: { ...HeaderWithBackArrow.args, colorScheme: 'dark' },
};
export const LongContent: Story = {
  decorators: canvasInsets,
  args: {
    description: Array.from({ length: 30 }, (_, i) => `Section ${i + 1}: recipe information.`).join(
      '\n\n',
    ),
  },
};

function RefreshExample({
  long = false,
  colorScheme = 'light',
}: {
  long?: boolean;
  colorScheme?: 'light' | 'dark';
}) {
  const [requests, setRequests] = useState(0);
  const [revision, setRevision] = useState(1);
  const [status, setStatus] = useState('Ready');
  const pending = useRef<{ resolve: () => void; reject: (error: Error) => void } | null>(null);
  useEffect(() => () => pending.current?.resolve(), []);
  const finish = (failed: boolean) => {
    const request = pending.current;
    if (!request) return;
    pending.current = null;
    if (failed) {
      setStatus('Refresh failed; saved content kept');
      request.reject(new Error('Fixture refresh failed'));
    } else {
      setRevision((value) => value + 1);
      setStatus('Ready');
      request.resolve();
    }
  };
  return (
    <PageScreen
      colorScheme={colorScheme}
      title="Pull to refresh"
      description="Drag down, then complete or fail the request to inspect the native indicator."
      tab
      onRefresh={() => {
        setRequests((value) => value + 1);
        setStatus('Refreshing');
        return new Promise<void>((resolve, reject) => {
          pending.current = { resolve, reject };
        });
      }}
    >
      <Text testID="page-refresh-content">{`Content revision: ${revision}`}</Text>
      <Text testID="page-refresh-requests">{`Refresh requests: ${requests}`}</Text>
      <Text testID="page-refresh-status">{status}</Text>
      <UniversalButtonContent
        variant="secondary"
        label="Complete refresh"
        testID="page-refresh-complete"
        disabled={status !== 'Refreshing'}
        onPress={() => finish(false)}
      />
      <UniversalButtonContent
        variant="secondary"
        label="Fail refresh"
        testID="page-refresh-fail"
        disabled={status !== 'Refreshing'}
        onPress={() => finish(true)}
      />
      {long &&
        Array.from({ length: 30 }, (_, index) => <Text key={index}>{`Recipe ${index + 1}`}</Text>)}
    </PageScreen>
  );
}

export const PullToRefresh: Story = {
  decorators: canvasInsets,
  render: () => <RefreshExample />,
};
export const PullToRefreshDark: Story = {
  decorators: canvasInsets,
  render: () => <RefreshExample colorScheme="dark" />,
};
export const PullToRefreshLongContent: Story = {
  decorators: canvasInsets,
  render: () => <RefreshExample long />,
};

function KeyboardExample() {
  const [draft, setDraft] = useState('');
  const [saved, setSaved] = useState('');
  const [saves, setSaves] = useState(0);
  return (
    <PageScreen
      title="Keyboard access"
      description="Type in the last field, then scroll to Save while the keyboard is open."
      tab
    >
      {Array.from({ length: 12 }, (_, index) => (
        <Text key={index}>{`Recipe note ${index + 1}`}</Text>
      ))}
      <NativeField
        label="Recipe note"
        testID="page-keyboard-input"
        value={draft}
        onChange={setDraft}
        multiline
      />
      <UniversalButtonContent
        variant="primary"
        testID="page-keyboard-save"
        label="Save note"
        disabled={!draft.trim()}
        onPress={() => {
          setSaved(draft);
          setSaves((count) => count + 1);
        }}
      />
      <Text testID="page-keyboard-result">{`Saved ${saves}: ${saved}`}</Text>
    </PageScreen>
  );
}

export const KeyboardAccess: Story = {
  decorators: canvasInsets,
  render: () => <KeyboardExample />,
};
