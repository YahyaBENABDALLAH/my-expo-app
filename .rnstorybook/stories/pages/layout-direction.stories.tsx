import {
  BottomSheet,
  Column,
  Icon,
  LayoutDirectionControl,
  RecipeStepper,
  Row,
  ScrollView,
  Spacer,
  UniversalButtonContent,
  UniversalHost,
  UniversalTextContent as Text,
  UniversalTextInputContent,
  nativeFillWidth,
  useNativeState,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { LayoutDirectionFrame } from '../../components/layout-direction-frame';
import { useState } from 'react';
import {
  LayoutDirectionProvider,
  useLayoutDirection,
  type LayoutDirection,
} from '@/context/layout-direction.context';
import Colors from '@/constants/colors';

const searchIcon = Icon.select({
  ios: 'magnifyingglass',
  android: require('@expo/material-symbols/search.xml'),
});
const clearIcon = Icon.select({
  ios: 'xmark.circle.fill',
  android: require('@expo/material-symbols/cancel.xml'),
});

function DirectionPreview({ colorScheme }: { colorScheme: 'light' | 'dark' }) {
  const direction = useLayoutDirection();
  const [draft, setDraft] = useState('');
  const nativeDraft = useNativeState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <UniversalHost
      colorScheme={colorScheme}
      matchContents={false}
      style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}
    >
      <ScrollView>
        <Column spacing={16} modifiers={nativeFillWidth} style={{ padding: 24 }}>
          <Text variant="title">Live layout direction</Text>
          <Text testID="layout-direction-status">{`Direction: ${direction.toUpperCase()}`}</Text>
          <Row modifiers={nativeFillWidth}>
            <Text>First / الأول</Text>
            <Spacer flexible />
            <Text>Last / الأخير</Text>
          </Row>
          <UniversalTextInputContent
            testID="layout-direction-draft"
            label="Draft / مسودة"
            placeholder="العربية · English · 123"
            value={nativeDraft}
            onChangeText={setDraft}
            leftIcon={searchIcon}
            rightIcon={clearIcon}
            rightIconAccessibilityLabel="Clear draft"
            onRightIconPress={() => {
              nativeDraft.set('');
              setDraft('');
            }}
          />
          <Text testID="layout-direction-draft-output">{`Draft: ${draft || '(empty)'}`}</Text>
          <RecipeStepper current={1} isCurrentValid animate={false} />
          <UniversalButtonContent
            variant="secondary"
            label="Open direction sheet"
            testID="layout-direction-open-sheet"
            onPress={() => setSheetOpen(true)}
          />
          <BottomSheet isPresented={sheetOpen} onDismiss={() => setSheetOpen(false)}>
            <Column spacing={16} modifiers={nativeFillWidth} style={{ padding: 16 }}>
              <Text variant="title" testID="layout-direction-sheet-title">
                Live direction sheet
              </Text>
              <LayoutDirectionControl testIDPrefix="sheet-layout-direction" />
              <Text testID="layout-direction-sheet-status">
                {`Sheet: ${direction.toUpperCase()}`}
              </Text>
              <Row modifiers={nativeFillWidth}>
                <Text>First / الأول</Text>
                <Spacer flexible />
                <Text>Last / الأخير</Text>
              </Row>
              <Text>{`Draft: ${draft || '(empty)'}`}</Text>
              <UniversalButtonContent
                variant="primary"
                label="Close sheet"
                testID="layout-direction-close-sheet"
                onPress={() => setSheetOpen(false)}
              />
            </Column>
          </BottomSheet>
        </Column>
      </ScrollView>
    </UniversalHost>
  );
}

function LayoutDirectionDemo({
  colorScheme = 'light',
  initialDirection = 'ltr',
}: {
  colorScheme?: 'light' | 'dark';
  initialDirection?: LayoutDirection;
}) {
  return (
    <LayoutDirectionProvider initialDirection={initialDirection}>
      <LayoutDirectionFrame colorScheme={colorScheme} testIDPrefix="layout-direction">
        <DirectionPreview colorScheme={colorScheme} />
      </LayoutDirectionFrame>
    </LayoutDirectionProvider>
  );
}

const meta = {
  title: 'Pages/Layout direction',
  component: LayoutDirectionDemo,
  args: { colorScheme: 'light', initialDirection: 'ltr' },
  argTypes: {
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    initialDirection: { control: false },
  },
} satisfies Meta<typeof LayoutDirectionDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const RtlLight: Story = { args: { initialDirection: 'rtl' } };
export const RtlDark: Story = { args: { colorScheme: 'dark', initialDirection: 'rtl' } };
