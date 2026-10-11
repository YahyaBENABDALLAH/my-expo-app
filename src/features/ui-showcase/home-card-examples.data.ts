import type { HomeRecipeCardData } from '@components/ui';
import type { TFunction } from 'i18next';

export type HomeRecipeExample = HomeRecipeCardData & { id: string };

/** Four local samples share three photos and never require a network request. */
export function homeRecipeExamples(t: TFunction): HomeRecipeExample[] {
  const samples: HomeRecipeExample[] = [
    {
      id: 'toast',
      image: require('@assets/images/recipe-examples/breakfast.jpg'),
      title: t('examples.toast'),
      description: t('home.cards.toastDescription'),
      duration: t('home.cards.minutes', { count: 10 }),
      category: t('home.cards.breakfast'),
      chef: t('home.cards.chefLina'),
      likes: '248',
      secondaryMeta: t('home.cards.easy'),
    },
    {
      id: 'salad',
      image: require('@assets/images/recipe-examples/salad.jpg'),
      title: t('examples.salad'),
      description: t('home.cards.saladDescription'),
      duration: t('home.cards.minutes', { count: 15 }),
      category: t('home.cards.fresh'),
      chef: t('home.cards.chefAdil'),
      likes: '186',
      secondaryMeta: t('home.cards.easy'),
    },
    {
      id: 'pasta',
      image: require('@assets/images/recipe-examples/pasta.jpg'),
      title: t('home.cards.pestoPasta'),
      description: t('home.cards.pastaDescription'),
      duration: t('home.cards.minutes', { count: 25 }),
      category: t('home.cards.chefsPick'),
      chef: t('home.cards.chefLina'),
      likes: '324',
      secondaryMeta: t('home.cards.vegetarian'),
    },
  ];
  return Array.from({ length: 4 }, (_, index) => {
    const sample = samples[index % samples.length];
    if (index < samples.length) return sample;
    return {
      ...sample,
      id: `${sample.id}-${index + 1}`,
      title: t('home.cards.numberedTitle', { title: sample.title, index: index + 1 }),
    };
  });
}
