import { OnboardingPage } from '@components/ui';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useOnboarding } from '@/context/onboarding.context';

const pages = [
  {
    name: 'discover',
    image: require('@assets/images/recipe-examples/salad.jpg'),
    next: '/(onboarding)/cook',
  },
  {
    name: 'cook',
    image: require('@assets/images/recipe-examples/pasta.jpg'),
    next: '/(onboarding)/save',
  },
  { name: 'save', image: require('@assets/images/recipe-examples/breakfast.jpg'), next: null },
] as const;

export function OnboardingScreen({ step }: { step: 0 | 1 | 2 }) {
  const { t } = useTranslation();
  const { complete, saving, saveError } = useOnboarding();
  const page = pages[step];
  const finish = () => void complete();
  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace(step === 2 ? '/(onboarding)/cook' : '/(onboarding)/discover');
  };

  return (
    <OnboardingPage
      image={page.image}
      title={t(`onboarding.${page.name}.title`)}
      description={t(`onboarding.${page.name}.subtitle`)}
      category={t(`onboarding.${page.name}.category`)}
      step={step}
      saving={saving}
      saveError={saveError}
      onNext={page.next ? () => router.navigate(page.next) : finish}
      onBack={step > 0 ? goBack : undefined}
      onSkip={finish}
    />
  );
}
