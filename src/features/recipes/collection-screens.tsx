import { useTranslation } from 'react-i18next';
import {
  Column,
  UniversalButtonContent,
  PageScreen,
  SegmentedControl,
  UniversalTextContent as Text,
  QueryContent,
  RecipeCard,
} from '@components/ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';

import { useScreenRefresh } from '@/hooks/use-screen-refresh';
import { useThemeColors } from '@/hooks/use-theme';

import { useAuthContext } from '@/context/auth.context';
import { collectionOptions } from './collections';
import { collectionMutationOptions } from './mutations';

import { chefProfileOptions, recipeListOptions, likedOptions } from './queries';
import { openRecipe } from './recipe-navigation';

export function MyRecipesScreen() {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const userUuid = user?.uuid ?? '';
  const favoriteOptions = collectionOptions(userUuid, 'favorites');
  const historyOptions = collectionOptions(userUuid, 'history');
  const likeOptions = likedOptions(userUuid);
  const favorites = useQuery(favoriteOptions);
  const history = useQuery(historyOptions);
  const likes = useQuery(likeOptions);
  const onRefresh = useScreenRefresh([
    favoriteOptions.queryKey,
    historyOptions.queryKey,
    likeOptions.queryKey,
  ]);
  return (
    <PageScreen
      title={t('common.myRecipes')}
      description={t('recipes.collectionsDescription')}
      onRefresh={userUuid ? onRefresh : undefined}
      tab
      actions={[
        {
          label: t('recipes.likedFavorites'),
          testID: 'page-action-liked-and-favorite-recipes',
          href: '/my-recipes/liked-favorites',
        },
        {
          label: t('common.recipeHistory'),
          testID: 'page-action-history',
          href: '/my-recipes/history',
        },
        {
          label: t('common.creations'),
          testID: 'page-action-creations',
          href: '/my-recipes/creations',
        },
      ]}
    >
      {userUuid ? (
        <Text>
          {t('recipes.collectionCounts', {
            favorites: favorites.data?.length ?? '…',
            history: history.data?.length ?? '…',
          })}
        </Text>
      ) : null}
      <QueryContent query={likes} disabledMessage={t('recipes.loginSaved')}>
        <Text>{t('recipes.likedCount', { count: likes.data?.meta.itemCount ?? 0 })}</Text>
      </QueryContent>
    </PageScreen>
  );
}

export function SavedRecipesScreen() {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const favorite = tab === 'favorite';
  const favoriteOptions = collectionOptions(user?.uuid ?? '', 'favorites');
  const likeOptions = likedOptions(user?.uuid ?? '');
  const favorites = useQuery(favoriteOptions);
  const likes = useQuery(likeOptions);
  const onRefresh = useScreenRefresh([favorite ? favoriteOptions.queryKey : likeOptions.queryKey]);
  return (
    <PageScreen
      title={favorite ? t('common.favoritesOnly') : t('common.likedRecipes')}
      description={t('recipes.savedDescription')}
      onRefresh={user?.uuid ? onRefresh : undefined}
    >
      <SegmentedControl
        label={t('common.savedRecipes')}
        selectedValue={favorite ? 'favorite' : 'liked'}
        options={[
          { value: 'liked', label: t('common.likedRecipes'), testID: 'page-action-liked-recipes' },
          { value: 'favorite', label: t('common.favoritesOnly'), testID: 'page-action-favorites' },
        ]}
        onValueChange={(tab) => router.setParams({ tab })}
      />
      {favorite ? (
        <QueryContent
          query={favorites}
          empty={favorites.data?.length === 0}
          disabledMessage={t('recipes.loginFavorites')}
        >
          {favorites.data?.map((recipe) => (
            <RecipeCard key={recipe.uuid} recipe={recipe} onPress={openRecipe} />
          ))}
        </QueryContent>
      ) : (
        <QueryContent
          query={likes}
          empty={likes.data?.data.length === 0}
          disabledMessage={t('recipes.loginLiked')}
        >
          {likes.data?.data.map((item) => (
            <UniversalButtonContent
              variant="secondary"
              key={item.recipeUuid}
              label={item.recipeTitle ?? t('recipes.openRecipe')}
              onPress={() =>
                router.push({ pathname: '/recipe/[uuid]', params: { uuid: item.recipeUuid } })
              }
            />
          ))}
        </QueryContent>
      )}
    </PageScreen>
  );
}

export function HistoryScreen() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { user } = useAuthContext();
  const userUuid = user?.uuid ?? '';
  const client = useQueryClient();
  const options = collectionOptions(userUuid, 'history');
  const query = useQuery(options);
  const onRefresh = useScreenRefresh([options.queryKey]);
  const clear = useMutation(collectionMutationOptions(client, userUuid, 'history'));
  return (
    <PageScreen
      title={t('common.recipeHistory')}
      description={t('recipes.historyDescription')}
      onRefresh={userUuid ? onRefresh : undefined}
    >
      <QueryContent
        query={query}
        empty={query.data?.length === 0}
        disabledMessage={t('recipes.loginHistory')}
      >
        {query.data?.map((recipe) => (
          <RecipeCard key={recipe.uuid} recipe={recipe} onPress={openRecipe} />
        ))}
      </QueryContent>
      <UniversalButtonContent
        variant="destructive"
        color={colors.error}
        contentColor={colors.onError}
        label={clear.isPending ? t('recipes.clearingHistory') : t('recipes.clearHistory')}
        disabled={!userUuid || clear.isPending}
        onPress={() => clear.mutate({})}
      />
      {clear.error ? <Text>{t('recipes.clearHistoryFailed')}</Text> : null}
    </PageScreen>
  );
}

export function CreationsScreen() {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const chefOptions = chefProfileOptions(user?.uuid ?? '');
  const chef = useQuery({
    ...chefOptions,
    enabled: Boolean(user?.isChef && !user.chefProfileUuid),
  });
  const chefUuid = user?.chefProfileUuid ?? chef.data?.uuid;
  const options = recipeListOptions({ pageSize: 100 });
  const query = useQuery({
    ...options,
    enabled: Boolean(chefUuid),
  });
  const recipes = query.data?.data.filter((recipe) => recipe.chefUuid === chefUuid) ?? [];
  const onRefresh = useScreenRefresh([
    ...(user?.isChef && !user.chefProfileUuid ? [chefOptions.queryKey] : []),
    ...(chefUuid ? [options.queryKey] : []),
  ]);
  let content = (
    <Text>{user?.uuid ? t('recipes.createChefToPublish') : t('recipes.loginCreations')}</Text>
  );
  if (chefUuid) {
    content = (
      <QueryContent query={query} empty={recipes.length === 0}>
        <Column spacing={12}>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.uuid} recipe={recipe} onPress={openRecipe} />
          ))}
        </Column>
        <Text variant="caption">{t('recipes.creationsLimit')}</Text>
      </QueryContent>
    );
  } else if (user?.isChef) {
    content = (
      <QueryContent query={chef}>
        {!chef.error && !chef.isFetching && chef.fetchStatus !== 'paused' ? (
          <Text>{t('recipes.createChefToPublish')}</Text>
        ) : null}
      </QueryContent>
    );
  }
  return (
    <PageScreen
      title={t('common.creations')}
      description={t('recipes.creationsDescription')}
      onRefresh={user?.isChef || chefUuid ? onRefresh : undefined}
      actions={[
        {
          label: t('common.createRecipe'),
          testID: 'page-action-create-a-recipe',
          href: '/create-recipe',
        },
      ]}
    >
      {content}
    </PageScreen>
  );
}
