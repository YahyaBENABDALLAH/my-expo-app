import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/use-theme';
import { Column, RNHostView } from '@expo/ui';
import { UniversalButtonContent } from './universal-button-content';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { UniversalTextContent as Text } from './universal-text';
import { useHostColorScheme } from './universal-host';
import type { RecipeCardData } from '@/types/recipe.types';

export function RecipeCard({ recipe }: { recipe: RecipeCardData }) {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  return (
    <UniversalButtonContent
      variant="link"
      testID={`recipe-card-${recipe.uuid}`}
      onPress={() => router.push({ pathname: '/recipe/[uuid]', params: { uuid: recipe.uuid } })}
    >
      <Column
        spacing={8}
        style={{ backgroundColor: colors.surface, padding: 12, borderRadius: 16 }}
      >
        {recipe.coverImageUrl ? (
          <RNHostView matchContents>
            <Image
              source={{ uri: recipe.coverImageUrl }}
              style={{ width: 260, height: 160, borderRadius: 12 }}
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
}
