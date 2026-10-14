import {
  Column,
  Row,
  Switch,
  Checkbox,
  Slider,
  Picker,
  SegmentedControl,
  Collapsible,
  ListItem,
  UniversalHost,
  UniversalTextContent,
  UniversalButtonContent,
  UniversalTextInputContent,
  nativeFillWidth,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import type { AppColorScheme } from '@/constants/colors';
import { themes, themeIds, type ThemeId } from '@/constants/themes/index';
import { ThemePreferencesProvider } from '@/context/theme.context';
import { useThemeColors } from '@/hooks/use-theme';
import { NativeStoryFrame } from '../../components/native-story-frame';

function ThemeDemo({ colorScheme, themeId }: { colorScheme: AppColorScheme; themeId: ThemeId }) {
  return (
    <ThemePreferencesProvider key={themeId} initialTheme={themeId} initialColorScheme={colorScheme}>
      <ThemePreview colorScheme={colorScheme} themeId={themeId} />
    </ThemePreferencesProvider>
  );
}

function ThemePreview({ colorScheme, themeId }: { colorScheme: AppColorScheme; themeId: ThemeId }) {
  const [enabled, setEnabled] = useState(false);
  const [amount, setAmount] = useState(50);
  const [selection, setSelection] = useState('recipes');
  const [expanded, setExpanded] = useState(false);
  const colors = useThemeColors(colorScheme);
  return (
    <NativeStoryFrame colorScheme={colorScheme}>
      <UniversalHost colorScheme={colorScheme}>
        <Column spacing={16} modifiers={nativeFillWidth}>
          <UniversalTextContent variant="heading">{`${themes[themeId].label} theme`}</UniversalTextContent>
          <UniversalTextContent>
            Shared theme tint and appearance for native controls.
          </UniversalTextContent>
          {(['primary', 'secondary', 'link', 'success', 'warning', 'destructive'] as const).map(
            (variant) => (
              <UniversalButtonContent key={variant} variant={variant} label={variant} fullWidth />
            ),
          )}
          <UniversalButtonContent variant="primary" label="Disabled action" disabled fullWidth />
          <Switch
            label="Theme switch"
            value={enabled}
            onValueChange={setEnabled}
            testID="theme-switch"
          />
          <Switch label="Disabled switch" value disabled onValueChange={setEnabled} />
          <Checkbox
            label="Theme checkbox"
            value={enabled}
            onValueChange={setEnabled}
            testID="theme-checkbox"
          />
          <Checkbox label="Disabled checkbox" value disabled onValueChange={setEnabled} />
          <Slider
            value={amount}
            min={0}
            max={100}
            step={10}
            onValueChange={setAmount}
            testID="theme-slider"
          />
          <UniversalTextContent>{`Amount: ${amount}`}</UniversalTextContent>
          <SegmentedControl
            selectedValue={selection}
            onValueChange={setSelection}
            options={[
              { value: 'recipes', label: 'Recipes', testID: 'theme-segment-recipes' },
              { value: 'favorites', label: 'Favorites', testID: 'theme-segment-favorites' },
            ]}
          />
          <Picker selectedValue={selection} onValueChange={setSelection} testID="theme-picker">
            <Picker.Item label="Recipes" value="recipes" />
            <Picker.Item label="Favorites" value="favorites" />
          </Picker>
          <Collapsible label="Theme details" isOpen={expanded} onOpenChange={setExpanded}>
            <UniversalTextContent>Native disclosure with themed text.</UniversalTextContent>
          </Collapsible>
          <ListItem supportingText="Native row appearance">Themed list row</ListItem>
          <UniversalTextInputContent
            label="Search"
            placeholder="Search recipes"
            testID="theme-input"
          />
          {Object.entries(colors).map(([role, color]) => (
            <Row key={role} spacing={12} alignment="center" modifiers={nativeFillWidth}>
              <Column
                style={{
                  width: 28,
                  height: 28,
                  backgroundColor: color,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 6,
                }}
              />
              <Column spacing={2}>
                <UniversalTextContent>{role}</UniversalTextContent>
                <UniversalTextContent variant="caption">{color}</UniversalTextContent>
              </Column>
            </Row>
          ))}
        </Column>
      </UniversalHost>
    </NativeStoryFrame>
  );
}

const meta = {
  title: 'Expo UI/Theme Tokens',
  component: ThemeDemo,
  args: { colorScheme: 'light', themeId: 'whatsapp' },
  argTypes: {
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    themeId: { control: 'select', options: themeIds },
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ThemeDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const FacebookLight: Story = { args: { themeId: 'facebook' } };
export const FacebookDark: Story = { args: { themeId: 'facebook', colorScheme: 'dark' } };
export const InstagramLight: Story = { args: { themeId: 'instagram' } };
export const InstagramDark: Story = { args: { themeId: 'instagram', colorScheme: 'dark' } };
export const TikTokLight: Story = { args: { themeId: 'tiktok' } };
export const TikTokDark: Story = { args: { themeId: 'tiktok', colorScheme: 'dark' } };
