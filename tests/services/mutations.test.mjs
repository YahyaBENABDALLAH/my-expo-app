import assert from 'node:assert/strict';
import test from 'node:test';
import { QueryObserver, onlineManager } from '@tanstack/react-query';
import { createApiHarness, deferred, page } from '../helpers/api-harness.mjs';
import { recipeFixture, chefFixture, likeFixture } from '../helpers/api-fixtures.mjs';

const like = likeFixture({ recipeUuid: 'r-1', userUuid: 'alice', likedAt: '2026-10-03' });
const chef = chefFixture({
  uuid: '11111111-1111-4111-8111-111111111111',
  userUuid: 'alice',
  displayName: 'Chef',
});
const seed = (s, key, data = {}) => s.client.setQueryData(key, data);
const invalid = (s, key) => s.client.getQueryState(key)?.isInvalidated;

test('like creation refreshes only matching user/recipe lists and the affected recipe detail', async () => {
  const s = createApiHarness(() => like);
  const { recipeKeys, recipeLikeKeys, dailyRecipeStatKeys } = s.load('lib/api-query-keys.ts');
  const hit = [
    recipeLikeKeys.list({ userUuid: 'alice' }),
    recipeLikeKeys.infiniteList({ userUuid: 'alice', recipeUuid: 'r-1' }),
    recipeLikeKeys.list({ recipeUuid: 'r-1' }),
    recipeLikeKeys.list({}),
    recipeKeys.list({ page: 1 }),
    recipeKeys.infiniteList({}),
    recipeKeys.detail('r-1'),
    dailyRecipeStatKeys.today,
  ];
  const miss = [
    recipeLikeKeys.list({ userUuid: 'bob' }),
    recipeLikeKeys.list({ userUuid: 'alice', recipeUuid: 'r-2' }),
    recipeKeys.detail('r-2'),
  ];
  for (const key of [...hit, ...miss]) seed(s, key);
  const options = s
    .load('services/recipe-like/recipe-like.mutations.ts')
    .createRecipeLikeMutationOptions(s.client);
  await s.execute(options, { recipeUuid: ' r-1 ', userUuid: ' alice ' });
  for (const key of hit) assert.equal(invalid(s, key), true, JSON.stringify(key));
  for (const key of miss) assert.equal(invalid(s, key), false, JSON.stringify(key));
  assert.deepEqual(s.client.getQueryData(recipeLikeKeys.detail('r-1', 'alice')), like);
  s.client.clear();
});

test('like deletion aborts an existing detail read, removes it, and invalidates lists', async () => {
  const started = deferred();
  const read = deferred();
  const s = createApiHarness((request) =>
    request.method === 'GET' ? (started.resolve(request), read.promise) : undefined,
  );
  const { recipeLikeKeys } = s.load('lib/api-query-keys.ts');
  const options = s
    .load('services/recipe-like/recipe-like.queries.ts')
    .recipeLikeDetailOptions('r-1', 'alice');
  const pending = s.client.fetchQuery(options);
  const rejected = assert.rejects(pending);
  const request = await started.promise;
  const list = recipeLikeKeys.list({ userUuid: 'alice' });
  seed(s, list);
  const mutation = s
    .load('services/recipe-like/recipe-like.mutations.ts')
    .deleteRecipeLikeMutationOptions(s.client);
  await s.execute(mutation, like);
  read.resolve(like);
  await rejected;
  assert.equal(request.signal.aborted, true);
  assert.equal(s.client.getQueryState(options.queryKey), undefined);
  assert.equal(invalid(s, list), true);
  s.client.clear();
});

test('failed writes preserve cached data and do not invalidate or retry', async () => {
  const s = createApiHarness(() => {
    throw new Error('Write failed');
  });
  const { recipeKeys } = s.load('lib/api-query-keys.ts');
  const key = recipeKeys.detail('r-1');
  seed(s, key, { uuid: 'r-1', likesCount: 0 });
  const options = s
    .load('services/recipe-like/recipe-like.mutations.ts')
    .createRecipeLikeMutationOptions(s.client);
  await assert.rejects(s.execute(options, like), /Write failed/);
  assert.equal(s.requests.length, 1);
  assert.equal(invalid(s, key), false);
  assert.equal(s.client.getQueryData(key).likesCount, 0);
  s.client.clear();
});

test('recipe creation seeds its detail and refreshes finite/infinite lists and statistics', async () => {
  const recipe = recipeFixture({ uuid: 'new-recipe', title: 'Tagine' });
  const s = createApiHarness(() => recipe);
  const { recipeKeys, dailyRecipeStatKeys, cuisineKeys } = s.load('lib/api-query-keys.ts');
  const affected = [recipeKeys.list({}), recipeKeys.infiniteList({}), dailyRecipeStatKeys.last];
  const unaffected = [recipeKeys.detail('old'), cuisineKeys.list({})];
  for (const key of [...affected, ...unaffected]) seed(s, key);
  const options = s
    .load('services/recipe/recipe.mutations.ts')
    .createRecipeMutationOptions(s.client);
  await s.execute(options, { chefUuid: 'chef', body: { title: 'Tagine', difficultyUuid: 'easy' } });
  assert.deepEqual(s.client.getQueryData(recipeKeys.detail('new-recipe')), recipe);
  for (const key of affected) assert.equal(invalid(s, key), true);
  for (const key of unaffected) assert.equal(invalid(s, key), false);
  s.client.clear();
});

test('chef writes preserve auth metadata and refresh the profile lookup and recipe display data', async () => {
  const s = createApiHarness(() => chef);
  const { chefProfileKeys, recipeKeys } = s.load('lib/api-query-keys.ts');
  const affected = [
    chefProfileKeys.list({}),
    chefProfileKeys.infiniteList({}),
    chefProfileKeys.forUser('alice'),
    recipeKeys.detail('r-1'),
  ];
  for (const key of affected) seed(s, key);
  const mutations = s.load('services/chef-profile/chef-profile.mutations.ts');
  await s.execute(mutations.createChefProfileMutationOptions(s.client), { displayName: 'Chef' });
  assert.deepEqual(s.authUpdates, [{ isChef: true, chefProfileUuid: chef.uuid }]);
  assert.deepEqual(s.client.getQueryData(chefProfileKeys.detail(chef.uuid)), chef);
  for (const key of affected) assert.equal(invalid(s, key), true);
  await s.execute(mutations.updateChefProfileMutationOptions(s.client), {
    uuid: chef.uuid,
    body: { bio: 'Updated' },
  });
  await s.execute(mutations.toggleChefProfileVerifiedMutationOptions(s.client), chef.uuid);
  assert.equal(s.authUpdates.length, 1);
  s.client.clear();
});

test('consumer callbacks run after mandatory invalidation and awaited active refetch', async () => {
  const refreshStarted = deferred();
  const refresh = deferred();
  let gets = 0;
  const s = createApiHarness((request) => {
    if (request.method === 'POST') return like;
    if (++gets === 1) return page();
    refreshStarted.resolve();
    return refresh.promise;
  });
  const readOptions = s.load('services/recipe/recipe.queries.ts').recipeListOptions();
  await s.client.fetchQuery(readOptions);
  const observer = new QueryObserver(s.client, readOptions);
  const unsubscribe = observer.subscribe(() => {});
  const { withMutationCallbacks } = s.load('services/query-utils.ts');
  const base = s
    .load('services/recipe-like/recipe-like.mutations.ts')
    .createRecipeLikeMutationOptions(s.client);
  const calls = [];
  const mutation = withMutationCallbacks(base, {
    onSuccess: () => {
      calls.push('success');
      assert.equal(s.client.getQueryData(readOptions.queryKey).data[0].uuid, 'fresh');
    },
    onSettled: () => calls.push('settled'),
  });
  const pending = s.execute(mutation, like);
  await refreshStarted.promise;
  assert.deepEqual(calls, []);
  assert.equal(s.client.getMutationCache().getAll().at(-1).state.status, 'pending');
  refresh.resolve(page([recipeFixture({ uuid: 'fresh' })]));
  await pending;
  assert.deepEqual(calls, ['success', 'settled']);
  unsubscribe();
  s.client.clear();
});

test('session changes before execution prevent writes; late responses cannot affect the new account', async () => {
  const s = createApiHarness(() => like);
  const factory = s.load(
    'services/recipe-like/recipe-like.mutations.ts',
  ).createRecipeLikeMutationOptions;
  const old = factory(s.client);
  s.changeSession();
  await assert.rejects(s.execute(old, like), /Session changed/);
  assert.equal(s.requests.length, 0);
  s.client.clear();

  const started = deferred();
  const response = deferred();
  const late = createApiHarness(() => {
    started.resolve();
    return response.promise;
  });
  const options = late
    .load('services/recipe-like/recipe-like.mutations.ts')
    .createRecipeLikeMutationOptions(late.client);
  const pending = late.execute(options, like);
  const rejection = assert.rejects(pending, /Session changed/);
  await started.promise;
  late.changeSession();
  const key = late.load('lib/api-query-keys.ts').recipeKeys.detail('r-1');
  seed(late, key, { owner: 'new account' });
  response.resolve(like);
  await rejection;
  assert.deepEqual(late.client.getQueryData(key), { owner: 'new account' });
  assert.equal(invalid(late, key), false);
  late.client.clear();
});

test('session changes during cache cancellation cannot delete the new account cache', async () => {
  const canceled = deferred();
  const resume = deferred();
  const s = createApiHarness(() => undefined);
  const key = s.load('lib/api-query-keys.ts').recipeLikeKeys.detail('r-1', 'alice');
  s.client.cancelQueries = async () => {
    canceled.resolve();
    await resume.promise;
  };
  const options = s
    .load('services/recipe-like/recipe-like.mutations.ts')
    .deleteRecipeLikeMutationOptions(s.client);
  const pending = s.execute(options, like);
  const rejection = assert.rejects(pending, /Session changed/);
  await canceled.promise;
  s.changeSession();
  seed(s, key, { owner: 'new account' });
  resume.resolve();
  await rejection;
  assert.deepEqual(s.client.getQueryData(key), { owner: 'new account' });
  s.client.clear();
});

test('offline writes attempt once and fail without entering a replay queue', async () => {
  const s = createApiHarness(() => {
    throw new Error('Offline');
  });
  onlineManager.setOnline(false);
  try {
    const options = s
      .load('services/recipe-like/recipe-like.mutations.ts')
      .createRecipeLikeMutationOptions(s.client);
    await assert.rejects(s.execute(options, like), /Offline/);
    assert.equal(s.requests.length, 1);
    assert.equal(s.client.getMutationCache().getAll()[0].state.isPaused, false);
  } finally {
    onlineManager.setOnline(true);
    s.client.clear();
  }
});
