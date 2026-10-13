import type { HomeCatalogItem } from '@components/ui';
import type { TFunction } from 'i18next';
import { homeRecipeExamples } from './home-card-examples.data';

/** One random photo per item, shared by its artwork and thumbnails. */
export function homeCatalogItems(
  t: TFunction,
  imageSeed: string,
  images?: readonly HomeCatalogItem['image'][],
): HomeCatalogItem[] {
  const examples = homeRecipeExamples(t);
  return Array.from({ length: 8 }, (_, index) => {
    const sample = examples[index % 3];
    return {
      id: `sample-${index + 1}`,
      image: images?.length
        ? images[index % images.length]
        : { uri: `https://picsum.photos/seed/${imageSeed}-${index + 1}/800/450` },
      title:
        index < 3
          ? sample.title
          : t('home.cards.numberedTitle', { title: sample.title, index: index + 1 }),
      duration: sample.duration,
      category: sample.category,
      description: sample.description,
      chef: sample.chef,
    };
  });
}
