import { spacing, radii } from '@/constants/layout';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';
import { useThemeColors } from '@/hooks/use-theme';
import { Column, RNHostView } from '@expo/ui';
import { UniversalButtonContent } from '../button/universal-button-content';
import { Image } from 'expo-image';
import { UniversalTextContent as Text } from '../text/universal-text';
import { useHostColorScheme } from '../host/universal-host';
import type { RecipeCardData } from '@/types/recipe.types';
import { nativeFillWidth } from '../native/native-fill-width';

export type RecipeCardProps = {
  recipe: RecipeCardData;
  onPress: (recipeUuid: string) => void;
};

export const RecipeCard = memo(function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  return (
    <UniversalButtonContent
      variant="link"
      fullWidth
      contentPadding={spacing.none}
      borderRadius={radii.card}
      testID={`recipe-card-${recipe.uuid}`}
      onPress={() => onPress(recipe.uuid)}
    >
      <Column
        spacing={spacing.sm}
        modifiers={nativeFillWidth}
        style={{ backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radii.card }}
      >
        {recipe.coverImageUrl ? (
          <RNHostView matchContents>
            <Image
              source={{ uri: recipe.coverImageUrl }}
              style={{ width: 260, height: 160, borderRadius: radii.control }}
              contentFit="cover"
              accessibilityLabel={recipe.title}
            />
          </RNHostView>
        ) : null}
        <Text fontWeight="600">{recipe.title}</Text>
        <Text variant="caption">
          {t('recipes.cardFacts', {
            minutes: recipe.totalTimeMinutes,
            difficulty: recipe.difficultyName ?? t('common.recipeLabel'),
            likes: recipe.likesCount,
          })}
        </Text>
        <Text variant="caption">{recipe.chefDisplayName ?? ''}</Text>
      </Column>
    </UniversalButtonContent>
  );
});
