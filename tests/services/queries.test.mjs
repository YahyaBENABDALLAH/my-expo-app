import { entityFixture, recipeFixture } from '../helpers/api-fixtures.mjs';
import assert from 'node:assert/strict';
import test from 'node:test';
import { InfiniteQueryObserver, QueryObserver, skipToken } from '@tanstack/react-query';
import { createApiHarness, deferred, page } from '../helpers/api-harness.mjs';

test('normalized keys deduplicate reads and snapshot parameters before caller mutation', async () => {
  const s = createApiHarness();
  const { recipeListOptions } = s.load('services/recipe/recipe.queries.ts');
  const input = { search: '  tagine  ', page: undefined };
  const first = recipeListOptions(input);
  input.search = 'couscous';
  const second = recipeListOptions({ page: 1, pageSize: 12, search: 'tagine' });
  assert.deepEqual(first.queryKey, second.queryKey);
  await Promise.all([s.client.fetchQuery(first), s.client.fetchQuery(second)]);
  assert.equal(s.requests.length, 1);
  assert.deepEqual(s.requests[0].params, { page: 1, pageSize: 12, search: 'tagine' });
  assert.deepEqual(s.client.getQueryData(first.queryKey), page());
  s.client.clear();
});

test('finite and infinite data cannot share cache entries; infinite reads follow server metadata', async () => {
  const s = createApiHarness(({ params }) =>
    page([{ uuid: `r-${params.page}` }].map(recipeFixture), params.page, params.page < 2),
  );
  const { recipeListOptions, recipeInfiniteOptions } = s.load('services/recipe/recipe.queries.ts');
  const finite = recipeListOptions();
  const infinite = recipeInfiniteOptions();
  await s.client.fetchQuery(finite);
  const observer = new InfiniteQueryObserver(s.client, { ...infinite, enabled: false });
  const unsubscribe = observer.subscribe(() => {});
  await observer.refetch();
  const result = await observer.fetchNextPage();
  assert.deepEqual(result.data.pageParams, [1, 2]);
  assert.equal(result.hasNextPage, false);
  await observer.fetchNextPage();
  assert.deepEqual(
    s.requests.map((r) => r.params.page),
    [1, 1, 2],
  );
  assert.deepEqual(
    s.client.getQueryData(finite.queryKey),
    page([{ uuid: 'r-1' }].map(recipeFixture), 1, true),
  );
  assert.equal(s.client.getQueryData(infinite.queryKey).pages.length, 2);
  unsubscribe();
  s.client.clear();
});

test('infinite reads stop if the server repeats a page or returns an empty next page', async () => {
  for (const empty of [false, true]) {
    const s = createApiHarness((_request, count) =>
      count === 1
        ? page([recipeFixture({ uuid: 'r' })], 1, true)
        : page(empty ? [] : [recipeFixture({ uuid: 'r' })], 1, true),
    );
    const options = s.load('services/recipe/recipe.queries.ts').recipeInfiniteOptions();
    const observer = new InfiniteQueryObserver(s.client, { ...options, enabled: false });
    const unsubscribe = observer.subscribe(() => {});
    await observer.refetch();
    assert.equal((await observer.fetchNextPage()).hasNextPage, false);
    await observer.fetchNextPage();
    assert.equal(s.requests.length, 2);
    unsubscribe();
    s.client.clear();
  }
});

test('missing detail identifiers disable automatic and manual fetch functions', async () => {
  const s = createApiHarness();
  const options = s
    .load('services/recipe-like/recipe-like.queries.ts')
    .recipeLikeDetailOptions('recipe', ' ');
  assert.equal(options.enabled, false);
  assert.equal(options.queryFn, skipToken);
  const observer = new QueryObserver(s.client, options);
  const unsubscribe = observer.subscribe(() => {});
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(s.requests.length, 0);
  unsubscribe();
  s.client.clear();
});

test('query cancellation aborts Axios and a late response never enters the cache', async () => {
  const started = deferred();
  const response = deferred();
  const s = createApiHarness((request) => {
    started.resolve(request);
    return response.promise;
  });
  const options = s.load('services/recipe/recipe.queries.ts').recipeDetailOptions('r-1');
  const pending = s.client.fetchQuery(options);
  const rejected = assert.rejects(pending);
  const request = await started.promise;
  await s.client.cancelQueries({ queryKey: options.queryKey });
  assert.equal(request.signal.aborted, true);
  response.resolve({ uuid: 'r-1' });
  await rejected;
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(s.client.getQueryData(options.queryKey), undefined);
  s.client.clear();
});

test('list invalidation covers every finite/infinite filter without affecting details or other entities', async () => {
  const s = createApiHarness();
  const { recipeKeys, cuisineKeys } = s.load('lib/api-query-keys.ts');
  const { invalidateEntityLists, invalidateEntityDetail } = s.load(
    'services/query-invalidation.ts',
  );
  const finite = recipeKeys.list({ page: 3, search: 'tagine' });
  const infinite = recipeKeys.infiniteList({ page: 1 });
  const detail = recipeKeys.detail('r-1');
  const otherDetail = recipeKeys.detail('r-2');
  const otherEntity = cuisineKeys.list({});
  for (const key of [finite, infinite, detail, otherDetail, otherEntity])
    s.client.setQueryData(key, {});
  await invalidateEntityLists(s.client, recipeKeys, { refetchType: 'none' });
  for (const key of [finite, infinite])
    assert.equal(s.client.getQueryState(key).isInvalidated, true);
  for (const key of [detail, otherDetail, otherEntity])
    assert.equal(s.client.getQueryState(key).isInvalidated, false);
  await invalidateEntityDetail(s.client, recipeKeys, [' r-1 ']);
  assert.equal(s.client.getQueryState(detail).isInvalidated, true);
  assert.equal(s.client.getQueryState(otherDetail).isInvalidated, false);
  s.client.clear();
});

test('recipe lookup adapters preserve entity keys, catalog filters, freshness and cancellation', async () => {
  const catalogs = [
    ['FoodCategory', 'food-category', 'foodCategory'],
    ['Cuisine', 'cuisine', 'cuisine'],
    ['Difficulty', 'difficulty', 'difficulty'],
    ['Ingredient', 'ingredient', 'ingredient'],
    ['Unit', 'unit', 'unit'],
  ];
  const s = createApiHarness(({ path, params }) =>
    page([entityFixture(catalogs.find(([kind]) => path === `/api/${kind}`)[1])], params.page),
  );
  const feature = s.load('features/recipes/queries.ts');
  for (const [kind, slug, name] of catalogs) {
    const options = feature.lookupOptions(kind, 2, '  moroccan  ');
    const entity = s.load(`services/${slug}/${slug}.queries.ts`);
    const params = { page: 2, pageSize: 20, isActive: true, search: 'moroccan' };
    assert.deepEqual(options.queryKey, entity[`${name}ListOptions`](params).queryKey);
    assert.equal(options.staleTime, 300_000);
    const signal = new AbortController().signal;
    const data = await options.queryFn({ signal });
    const request = s.requests.at(-1);
    assert.equal(request.path, `/api/${kind}`);
    assert.deepEqual(request.params, params);
    assert.equal(request.signal, signal);
    assert.equal(data.data[0].uuid, entityFixture(slug).uuid);
  }
  assert.deepEqual(
    feature.likedOptions('alice').queryKey,
    s.load('lib/api-query-keys.ts').recipeKeys.likes('alice'),
  );
  s.client.clear();
});
