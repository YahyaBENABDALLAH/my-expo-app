import { useState } from 'react';
import { Keyboard, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import {
  PageScreen,
  SearchField,
  UniversalButtonContent,
  UniversalTextContent as Text,
} from '@components/ui';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/use-theme';

const meta = {
  title: 'Pages/Search journey',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <SafeAreaInsetsContext.Provider value={{ top: 0, bottom: 0, left: 0, right: 0 }}>
        <Story />
      </SafeAreaInsetsContext.Provider>
    ),
  ],
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function SearchJourney({
  colorScheme = 'light',
  animate = true,
  narrow = false,
}: {
  colorScheme?: 'light' | 'dark';
  animate?: boolean;
  narrow?: boolean;
}) {
  const [searching, setSearching] = useState(false);
  const [text, setText] = useState('');
  const [request, setRequest] = useState(0);
  const colors = useThemeColors(colorScheme);
  return (
    <View
      style={{ flex: 1, backgroundColor: colors.background, ...(narrow ? { width: 280 } : {}) }}
    >
      <PageScreen
        title={searching ? 'Search' : 'Home'}
        description={
          searching ? 'Find something you will love cooking.' : 'Fresh ideas for your next meal.'
        }
        colorScheme={colorScheme}
        tab
        headerAction={
          searching
            ? {
                label: 'Cancel',
                testID: 'search-cancel',
                onPress: () => {
                  Keyboard.dismiss();
                  setSearching(false);
                },
              }
            : undefined
        }
        headerAccessory={
          searching ? (
            <SearchField
              mode="edit"
              placeholder="Search recipes"
              testID="recipe-search-input"
              colorScheme={colorScheme}
              animate={animate}
              value={text}
              onChange={setText}
              onSubmit={(value) => {
                setText(value);
                Keyboard.dismiss();
              }}
              clearLabel="Clear search"
              focusRequest={String(request)}
            />
          ) : (
            <SearchField
              mode="navigate"
              placeholder="Search recipes"
              testID="home-search"
              colorScheme={colorScheme}
              animate={animate}
              onPress={() => {
                setRequest((value) => value + 1);
                setSearching(true);
              }}
            />
          )
        }
      >
        <Text testID="search-journey-draft">{`Draft: ${text || 'empty'}`}</Text>
        <UniversalButtonContent
          variant="secondary"
          label="Reset draft"
          testID="search-journey-reset"
          onPress={() => setText('')}
        />
        {Array.from({ length: 24 }, (_, index) => (
          <Text
            key={index}
            testID={`search-journey-row-${index}`}
          >{`Recipe idea ${index + 1}`}</Text>
        ))}
      </PageScreen>
    </View>
  );
}

export const Light: Story = { render: () => <SearchJourney /> };
export const Dark: Story = { render: () => <SearchJourney colorScheme="dark" /> };
export const Static: Story = { render: () => <SearchJourney animate={false} /> };
export const NarrowPhone: Story = { render: () => <SearchJourney narrow /> };
