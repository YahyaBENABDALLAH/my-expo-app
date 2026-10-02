export interface PopularRecipe {
  uuid: string;
  title: string;
  imageUri: string;
  duration: string;
  subtitle: string;
  popularityLabel: string;
  isFavorite?: boolean;
  chefName?: string | null;
  chefAvatarUrl?: string | null;
}

export const SECONDARY_META_KIND = {
  FLAME: "flame",
  STAR: "star",
} as const;
export type SecondaryMetaKind = typeof SECONDARY_META_KIND[keyof typeof SECONDARY_META_KIND];

export interface EditorsChoiceRecipe {
  uuid: string;
  label: string;
  title: string;
  description: string;
  imageUri: string;
  duration: string;
  secondaryMeta: string;
  secondaryMetaKind: SecondaryMetaKind;
  chefName?: string | null;
  chefAvatarUrl?: string | null;
}
