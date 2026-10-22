import {
  PageScreen,
  PageSection,
  UniversalButtonContent,
  UniversalTextContent,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';

function PageDemo({ showBack = false }: { showBack?: boolean }) {
  const [actions, setActions] = useState(0);
  const [backs, setBacks] = useState(0);
  return (
    <PageScreen
      title="Home"
      description="Standalone starter page."
      showBack={showBack}
      onBack={() => setBacks((value) => value + 1)}
    >
      <PageSection>
        <UniversalButtonContent
          variant="primary"
          label="Count action"
          testID="page-demo-action"
          onPress={() => setActions((value) => value + 1)}
        />
        <UniversalTextContent testID="page-demo-count">{`Actions: ${actions}; Back: ${backs}`}</UniversalTextContent>
      </PageSection>
    </PageScreen>
  );
}

const meta = {
  title: 'Components/Page Screen',
  component: PageDemo,
  args: { showBack: false },
} satisfies Meta<typeof PageDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const StandaloneHome: Story = {};
export const BackAction: Story = { args: { showBack: true } };
