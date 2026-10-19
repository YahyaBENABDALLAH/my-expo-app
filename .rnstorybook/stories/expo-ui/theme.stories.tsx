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
import { themes } from '@/constants/themes/index';
import type { ColorTokens } from '@/constants/themes/tokens';
import { useAppTheme } from '@/hooks/use-theme';
import { NativeStoryFrame } from '../../components/native-story-frame';
import { semanticButtonColors } from '../../components/semantic-button-colors';
import type { StoryThemeProps } from '../../components/story-theme';

// Show the roles people style with, rather than every derived compatibility alias.
const previewRoles = [
  'background',
  'surface',
  'surfaceRaised',
  'text',
  'muted',
  'border',
  'primary',
  'secondary',
  'tint',
  'error',
  'success',
  'warning',
  'info',
] as const satisfies readonly (keyof ColorTokens)[];

function ThemeDemo() {
  const [enabled, setEnabled] = useState(false);
  const [amount, setAmount] = useState(50);
  const [selection, setSelection] = useState('recipes');
  const [expanded, setExpanded] = useState(false);
  const { colors, themeId, scheme: colorScheme } = useAppTheme();
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
              <UniversalButtonContent
                key={variant}
                variant={variant}
                label={variant}
                {...(themeId === 'ux' ? {} : semanticButtonColors(variant, colors))}
                fullWidth
              />
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
          {previewRoles.map((role) => (
            <Row key={role} spacing={12} alignment="center" modifiers={nativeFillWidth}>
              <Column
                style={{
                  width: 28,
                  height: 28,
                  backgroundColor: colors[role],
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 6,
                }}
              />
              <Column spacing={2}>
                <UniversalTextContent>{role}</UniversalTextContent>
                <UniversalTextContent variant="caption">{colors[role]}</UniversalTextContent>
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
  args: { colorScheme: 'light', themeId: 'ux' },
} satisfies Meta<StoryThemeProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
