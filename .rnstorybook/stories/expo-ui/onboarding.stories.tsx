import {
  Column,
  OnboardingPage,
  UniversalButtonContent,
  UniversalHost,
  UniversalTextContent,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const names = ['discover', 'cook', 'save'] as const;
const images = [
  require('@assets/images/recipe-examples/salad.jpg'),
  require('@assets/images/recipe-examples/pasta.jpg'),
  require('@assets/images/recipe-examples/breakfast.jpg'),
];

function OnboardingFixture({
  initialStep = 0,
  saving = false,
  saveError = false,
  colorScheme = 'light',
}: {
  initialStep?: 0 | 1 | 2;
  saving?: boolean;
  saveError?: boolean;
  colorScheme?: 'light' | 'dark';
}) {
  const { t } = useTranslation();
  const [step, setStep] = useState(initialStep);
  const [finished, setFinished] = useState(false);
  if (finished)
    return (
      <UniversalHost colorScheme={colorScheme}>
        <Column spacing={20} style={{ padding: 24 }}>
          <UniversalTextContent testID="onboarding-story-completed">
            Completed introduction
          </UniversalTextContent>
          <UniversalButtonContent
            variant="secondary"
            label="Replay introduction"
            testID="onboarding-story-reset"
            onPress={() => {
              setStep(0);
              setFinished(false);
            }}
          />
        </Column>
      </UniversalHost>
    );
  const name = names[step];
  return (
    <OnboardingPage
      image={images[step]}
      title={t(`onboarding.${name}.title`)}
      description={t(`onboarding.${name}.subtitle`)}
      category={t(`onboarding.${name}.category`)}
      step={step}
      saving={saving}
      saveError={saveError}
      colorScheme={colorScheme}
      onNext={() => (step === 2 ? setFinished(true) : setStep((step + 1) as 1 | 2))}
      onBack={step > 0 ? () => setStep((step - 1) as 0 | 1) : undefined}
      onSkip={() => setFinished(true)}
    />
  );
}

const meta = {
  title: 'Pages/Onboarding',
  component: OnboardingFixture,
  args: { initialStep: 0, saving: false, saveError: false, colorScheme: 'light' },
  argTypes: {
    initialStep: { control: 'select', options: [0, 1, 2] },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
  },
  parameters: { layout: 'fullscreen' },
  render: (args) => <OnboardingFixture key={args.initialStep} {...args} />,
} satisfies Meta<typeof OnboardingFixture>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Discover: Story = {};
export const Cook: Story = { args: { initialStep: 1 } };
export const Save: Story = { args: { initialStep: 2 } };
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const Saving: Story = { args: { initialStep: 2, saving: true } };
export const SaveFailed: Story = { args: { initialStep: 2, saveError: true } };
