import { OnboardingPage } from '@components/ui';
import { useTranslation } from 'react-i18next';
import { useOnboarding } from '@/context/onboarding.context';

const pages = [
  {
    name: 'discover',
    image: require('@assets/images/recipe-examples/salad.jpg'),
  },
  {
    name: 'cook',
    image: require('@assets/images/recipe-examples/pasta.jpg'),
  },
  { name: 'save', image: require('@assets/images/recipe-examples/breakfast.jpg') },
] as const;

export function OnboardingScreen() {
  const { t } = useTranslation();
  const { complete, saving, saveError } = useOnboarding();
  const finish = () => void complete();

  return (
    <OnboardingPage
      pages={pages.map((page) => ({
        id: page.name,
        image: page.image,
        title: t(`onboarding.${page.name}.title`),
        description: t(`onboarding.${page.name}.subtitle`),
        category: t(`onboarding.${page.name}.category`),
      }))}
      saving={saving}
      saveError={saveError}
      onComplete={finish}
      onSkip={finish}
    />
  );
}
