import {
  Column,
  nativeFillWidth,
  PageSection,
  Row,
  ScrollView,
  TextInput,
  UniversalButtonContent,
  UniversalHost,
  UniversalTextContent as Text,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';

function SectionDemo({ colorScheme }: { colorScheme: 'light' | 'dark' }) {
  const colors = useThemeColors(colorScheme);
  const [value, setValue] = useState('Shared section');
  const [presses, setPresses] = useState(0);
  const open = () => setPresses((count) => count + 1);
  return (
    <UniversalHost
      colorScheme={colorScheme}
      matchContents={false}
      ignoreSafeArea="all"
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView>
        <Column spacing={0} modifiers={nativeFillWidth}>
          <PageSection testID="page-section-inset">
            <Text variant="title">Section spacing</Text>
            <TextInput label="Section title" value={value} onChangeText={setValue} />
            <Text testID="page-section-value">{value}</Text>
            <Text testID="page-section-presses">{`Actions: ${presses}`}</Text>
            <UniversalButtonContent variant="primary" label="Count action" onPress={open} />
          </PageSection>
          <PageSection inset={false} style={{ backgroundColor: colors.infoContainer }}>
            <Column modifiers={nativeFillWidth} style={{ paddingHorizontal: spacing.lg }}>
              <Text variant="title">Full-width section</Text>
            </Column>
            <ScrollView direction="horizontal" showsIndicators={false}>
              <Row style={{ paddingHorizontal: spacing.lg }} spacing={spacing.lg}>
                {[1, 2, 3].map((item) => (
                  <Column key={item} spacing={spacing.md} style={{ width: 260 }}>
                    <Text variant="title">{`Example ${item}`}</Text>
                    <UniversalButtonContent
                      variant="secondary"
                      label="Count action"
                      onPress={open}
                    />
                  </Column>
                ))}
              </Row>
            </ScrollView>
          </PageSection>
        </Column>
      </ScrollView>
    </UniversalHost>
  );
}

const meta = {
  title: 'Components/Page Section',
  component: SectionDemo,
  args: { colorScheme: 'light' },
  argTypes: {
    colorScheme: { control: 'radio', options: ['light', 'dark'] },
  },
  render: (args) => <SectionDemo {...args} />,
} satisfies Meta<typeof SectionDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Interaction: Story = {};
