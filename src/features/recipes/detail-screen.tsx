import { spacing } from '@/constants/layout';
import { useTranslation } from 'react-i18next';
import {
  Column,
  UniversalButtonContent,
  PageScreen,
  PageSection,
  UniversalTextContent as Text,
  QueryContent,
} from '@components/ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { useScreenRefresh } from '@/hooks/use-screen-refresh';
import { isValidRouteIdentifier } from '@/lib/route-identifier';

import { useAuthContext } from '@/context/auth.context';
import { collectionMutationOptions, likeRecipeOptions } from './mutations';
import { collectionOptions } from './collections';
import { recipeDetailOptions } from './queries';

function favoriteActionLabel(pending: boolean, favorite: boolean) {
  if (pending) return 'recipes.saving';
  return favorite ? 'recipes.removeFavorite' : 'recipes.saveFavorite';
}

function likeActionLabel(pending: boolean, liked: boolean) {
  if (pending) return 'recipes.liking';
  return liked ? 'common.likedOnly' : 'recipes.like';
}

export default function DetailScreen() {
  const { t } = useTranslation();
  const { uuid } = useLocalSearchParams<{ uuid?: string | string[] }>();
  const valid = isValidRouteIdentifier(uuid);
  const { user } = useAuthContext();
  const userUuid = user?.uuid ?? '';
  const client = useQueryClient();
  const recipeOptions = recipeDetailOptions(valid ? uuid : '');
  const favoriteOptions = collectionOptions(userUuid, 'favorites');
  const recipe = useQuery({ ...recipeOptions, enabled: valid });
  const favorites = useQuery(favoriteOptions);
  const onRefresh = useScreenRefresh([recipeOptions.queryKey, favoriteOptions.queryKey]);
  const favorite = favorites.data?.some((item) => item.uuid === uuid) ?? false;
  const save = useMutation(collectionMutationOptions(client, userUuid, 'favorites'));
  const { mutate: recordView } = useMutation(
    collectionMutationOptions(client, userUuid, 'history'),
  );
  useEffect(() => {
    if (recipe.data && userUuid) recordView({ recipe: recipe.data });
  }, [recipe.data, userUuid, recordView]);
  const like = useMutation(likeRecipeOptions(client, userUuid, valid ? uuid : ''));
  if (!valid) {
    return (
      <PageScreen
        title={t('recipes.invalidLink')}
        description={t('recipes.invalidLinkDescription')}
      />
    );
  }
  return (
    <PageScreen
      title={t('common.recipeLabel')}
      onRefresh={onRefresh}
      description={recipe.data?.summary ?? t('recipes.details')}
    >
      <PageSection>
        <QueryContent query={recipe}>
          <Text variant="title">{recipe.data?.title ?? ''}</Text>
          <Text>
            {t('recipes.facts', {
              minutes: recipe.data?.totalTimeMinutes ?? 0,
              servings: recipe.data?.servings ?? 0,
            })}
          </Text>
          {!userUuid ? <Text>{t('recipes.loginLike')}</Text> : null}
          <UniversalButtonContent
            variant={favorite ? 'destructive' : 'secondary'}
            label={t(favoriteActionLabel(save.isPending, favorite))}
            testID="recipe-favorite"
            disabled={!userUuid || !favorites.data || save.isPending}
            onPress={() => save.mutate({ recipe: recipe.data, remove: favorite })}
          />
          {save.error ? <Text>{t('recipes.favoriteFailed')}</Text> : null}
          <UniversalButtonContent
            variant="secondary"
            label={t(likeActionLabel(like.isPending, like.isSuccess))}
            disabled={like.isPending || like.isSuccess || !userUuid}
            onPress={() => like.mutate()}
          />
          {like.error ? <Text>{t('recipes.likeFailed')}</Text> : null}
          <Text variant="title">{t('common.ingredients')}</Text>
          {recipe.data?.ingredients?.map((item) => (
            <Text
              key={`${item.sortOrder}:${item.ingredientName}:${item.unitLabel ?? ''}`}
            >{`${item.quantity ?? ''} ${item.unitLabel ?? ''} ${item.ingredientName}${item.isOptional ? t('recipes.optional') : ''}`}</Text>
          ))}
          <Text variant="title">{t('recipes.instructions')}</Text>
          {recipe.data?.steps?.map((item) => (
            <Column key={item.stepNumber} spacing={spacing.sm}>
              <Text fontWeight="600">{`${item.stepNumber}. ${item.title}`}</Text>
              <Text>{item.instruction}</Text>
            </Column>
          ))}
        </QueryContent>
      </PageSection>
    </PageScreen>
  );
}
