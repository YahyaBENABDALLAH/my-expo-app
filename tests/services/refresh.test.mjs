import assert from 'node:assert/strict';
import test from 'node:test';
import { onlineManager, QueryObserver } from '@tanstack/react-query';
import { createApiHarness, deferred, page } from '../helpers/api-harness.mjs';
import { entityFixture, recipeFixture } from '../helpers/api-fixtures.mjs';

function observe(t, client, options) {
  const observer = new QueryObserver(client, { ...options, staleTime: Infinity });
  const unsubscribe = observer.subscribe(() => {});
  t.after(() => {
    unsubscribe();
    client.clear();
  });
  return observer;
}

test('screen refresh keeps filters/page and leaves other active pages/entities untouched', async (t) => {
  const s = createApiHarness(({ path }) =>
    page([entityFixture(path === '/api/Cuisine' ? 'cuisine' : 'recipe')]),
  );
  const { recipeListOptions } = s.load('services/recipe/recipe.queries.ts');
  const { cuisineListOptions } = s.load('services/cuisine/cuisine.queries.ts');
  const { refetchScreenQueries } = s.load('services/query-refresh.ts');
  const selected = recipeListOptions({ page: 3, search: 'tagine', categoryUuid: 'c-1' });
  const otherPage = recipeListOptions({ page: 2, search: 'tagine', categoryUuid: 'c-1' });
  const otherFilter = recipeListOptions({ page: 3, search: 'soup' });
  const catalog = cuisineListOptions();
  for (const options of [selected, otherPage, otherFilter, catalog]) {
    await s.client.fetchQuery(options);
    observe(t, s.client, options);
  }
  const before = s.requests.length;
  await refetchScreenQueries(s.client, [selected.queryKey]);
  assert.equal(s.requests.length, before + 1);
  assert.deepEqual(s.requests.at(-1).params, {
    page: 3,
    pageSize: 12,
    search: 'tagine',
    categoryUuid: 'c-1',
  });
  for (const options of [otherPage, otherFilter, catalog]) {
    assert.equal(s.client.getQueryState(options.queryKey).isInvalidated, false);
  }
});

test('refresh skips disabled, inactive, and missing-identifier queries', async (t) => {
  const s = createApiHarness();
  const { recipeListOptions, recipeDetailOptions } = s.load('services/recipe/recipe.queries.ts');
  const { refetchScreenQueries } = s.load('services/query-refresh.ts');
  const disabled = { ...recipeListOptions({ search: 'disabled' }), enabled: false };
  const missing = recipeDetailOptions(' ');
  const inactive = recipeListOptions({ search: 'inactive' });
  observe(t, s.client, disabled);
  observe(t, s.client, missing);
  await s.client.fetchQuery(inactive);
  const before = s.requests.length;
  await refetchScreenQueries(s.client, [disabled.queryKey, missing.queryKey, inactive.queryKey]);
  assert.equal(s.requests.length, before);
});

test('refresh waits for every request and reuses in-flight reads without aborting them', async (t) => {
  const recipeStarted = deferred();
  const catalogStarted = deferred();
  const recipeResponse = deferred();
  const catalogResponse = deferred();
  let refreshing = false;
  const s = createApiHarness((request) => {
    if (!refreshing)
      return page([entityFixture(request.path === '/api/Cuisine' ? 'cuisine' : 'recipe')]);
    if (request.path === '/api/Recipe') {
      recipeStarted.resolve(request);
      return recipeResponse.promise;
    }
    catalogStarted.resolve(request);
    return catalogResponse.promise;
  });
  const recipe = s.load('services/recipe/recipe.queries.ts').recipeListOptions();
  const catalog = s.load('services/cuisine/cuisine.queries.ts').cuisineListOptions();
  const { refetchScreenQueries } = s.load('services/query-refresh.ts');
  for (const options of [recipe, catalog]) {
    await s.client.fetchQuery(options);
    observe(t, s.client, options);
  }
  refreshing = true;
  let complete = false;
  const first = refetchScreenQueries(s.client, [recipe.queryKey, catalog.queryKey]).then(() => {
    complete = true;
  });
  const requests = await Promise.all([recipeStarted.promise, catalogStarted.promise]);
  const duplicate = refetchScreenQueries(s.client, [recipe.queryKey, catalog.queryKey]);
  recipeResponse.resolve(page([recipeFixture({ uuid: 'new-recipe' })]));
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(complete, false);
  assert.equal(s.requests.length, 4);
  assert.equal(
    requests.every((request) => !request.signal.aborted),
    true,
  );
  catalogResponse.resolve(page([entityFixture('cuisine', { uuid: 'new-cuisine' })]));
  await Promise.all([first, duplicate]);
  assert.equal(complete, true);
  assert.equal(s.client.getQueryData(recipe.queryKey).data[0].uuid, 'new-recipe');
  assert.equal(s.client.getQueryData(catalog.queryKey).data[0].uuid, 'new-cuisine');
});

test('failed refresh retains cached content, exposes errors, and lets other reads finish', async (t) => {
  let refreshing = false;
  const s = createApiHarness(({ path }) => {
    if (refreshing && path === '/api/Recipe') throw new Error('Service unavailable');
    return page([
      entityFixture(path === '/api/Cuisine' ? 'cuisine' : 'recipe', {
        uuid: refreshing ? 'updated' : 'saved',
      }),
    ]);
  });
  const recipe = s.load('services/recipe/recipe.queries.ts').recipeListOptions();
  const catalog = s.load('services/cuisine/cuisine.queries.ts').cuisineListOptions();
  const { refetchScreenQueries } = s.load('services/query-refresh.ts');
  for (const options of [recipe, catalog]) {
    await s.client.fetchQuery(options);
    observe(t, s.client, options);
  }
  refreshing = true;
  await refetchScreenQueries(s.client, [recipe.queryKey, catalog.queryKey]);
  assert.equal(s.client.getQueryData(recipe.queryKey).data[0].uuid, 'saved');
  assert.ok(s.client.getQueryState(recipe.queryKey).error);
  assert.equal(s.client.getQueryData(catalog.queryKey).data[0].uuid, 'updated');
  assert.equal(s.client.getQueryState(recipe.queryKey).fetchStatus, 'idle');
  refreshing = false;
  await refetchScreenQueries(s.client, [recipe.queryKey]);
  assert.equal(s.client.getQueryState(recipe.queryKey).error, null);
});

test('offline network refresh completes instead of waiting on paused requests', async (t) => {
  const s = createApiHarness();
  const options = s.load('services/recipe/recipe.queries.ts').recipeListOptions();
  const { refetchScreenQueries } = s.load('services/query-refresh.ts');
  await s.client.fetchQuery(options);
  observe(t, s.client, options);
  const wasOnline = onlineManager.isOnline();
  t.after(() => {
    s.client.clear();
    onlineManager.setOnline(wasOnline);
  });
  onlineManager.setOnline(false);
  await refetchScreenQueries(s.client, [options.queryKey]);
  assert.equal(s.requests.length, 1);
  assert.equal(s.client.getQueryState(options.queryKey).fetchStatus, 'paused');
  assert.equal(s.client.getQueryData(options.queryKey).data[0].uuid, 'item-1');
});

test('offline refresh rereads local collections and keeps other accounts isolated', async (t) => {
  let reads = 0;
  let stored = [];
  const s = createApiHarness(undefined, {
    '@react-native-async-storage/async-storage': {
      __esModule: true,
      default: {
        getItem: async () => {
          reads++;
          return JSON.stringify(stored);
        },
      },
    },
  });
  const { collectionOptions } = s.load('features/recipes/collections.ts');
  const { refetchScreenQueries } = s.load('services/query-refresh.ts');
  const current = collectionOptions('alice', 'favorites');
  const other = collectionOptions('bob', 'favorites');
  for (const options of [current, other]) {
    await s.client.fetchQuery(options);
    observe(t, s.client, options);
  }
  const wasOnline = onlineManager.isOnline();
  t.after(() => {
    s.client.clear();
    onlineManager.setOnline(wasOnline);
  });
  onlineManager.setOnline(false);
  stored = [
    {
      uuid: 'r-1',
      title: 'Tagine',
      coverImageUrl: null,
      totalTimeMinutes: 45,
      difficultyName: null,
      likesCount: 0,
      chefDisplayName: null,
    },
  ];
  await refetchScreenQueries(s.client, [current.queryKey]);
  assert.equal(reads, 3);
  assert.deepEqual(s.client.getQueryData(current.queryKey), stored);
  assert.deepEqual(s.client.getQueryData(other.queryKey), []);
  assert.equal(s.requests.length, 0);
});
