import assert from 'node:assert/strict';
import test from 'node:test';
import { recipeKeys } from '../../src/lib/api-query-keys.ts';
import { createApiHarness } from '../helpers/api-harness.mjs';
import { recipeFixture, likeFixture } from '../helpers/api-fixtures.mjs';

function setup() {
  const writes = [];
  let failure = false;
  const write = async (...args) => {
    if (failure) throw new Error('Write failed');
    writes.push(args);
  };
  const harness = createApiHarness(
    async (request) => {
      if (request.path === '/api/RecipeLike') {
        await write(request.body.userUuid, request.body.recipeUuid);
        return likeFixture(request.body);
      }
      await write(request.body);
      return recipeFixture({ uuid: 'recipe-1' });
    },
    { 'features/recipes/collections.ts': { updateCollection: write } },
  );
  const { client } = harness;
  const exports = harness.load('features/recipes/mutations.ts');
  return {
    ...exports,
    client,
    writes,
    failWrites: () => {
      failure = true;
    },
    execute: (options, variables) =>
      client.getMutationCache().build(client, options).execute(variables),
    seed: (key) => client.setQueryData(key, ['cached data']),
    invalid: (key) => client.getQueryState(key)?.isInvalidated,
  };
}

test('liking invalidates recipe data and only the current user liked list', async () => {
  const s = setup();
  const detail = recipeKeys.detail('recipe-1');
  const list = recipeKeys.list({ page: 1 });
  const mine = recipeKeys.likes('alice');
  const other = recipeKeys.likes('bob');
  for (const key of [detail, list, mine, other]) s.seed(key);
  await s.execute(s.likeRecipeOptions(s.client, 'alice', 'recipe-1'));
  assert.deepEqual(s.writes, [['alice', 'recipe-1']]);
  assert.equal(s.invalid(detail), true);
  assert.equal(s.invalid(list), true);
  assert.equal(s.invalid(mine), true);
  assert.equal(s.invalid(other), false);
  s.client.clear();
});

test('failed likes preserve existing cache freshness', async () => {
  const s = setup();
  const key = recipeKeys.likes('alice');
  const detail = recipeKeys.detail('recipe-1');
  s.seed(key);
  s.seed(detail);
  s.failWrites();
  await assert.rejects(
    s.execute(s.likeRecipeOptions(s.client, 'alice', 'recipe-1')),
    /Write failed/,
  );
  assert.equal(s.invalid(key), false);
  assert.equal(s.invalid(detail), false);
  assert.deepEqual(s.writes, []);
  s.client.clear();
});

test('collection writes invalidate only their account and kind after successful storage', async () => {
  const s = setup();
  const key = recipeKeys.collection('alice', 'favorites');
  const history = recipeKeys.collection('alice', 'history');
  const other = recipeKeys.collection('bob', 'favorites');
  for (const k of [key, history, other]) s.seed(k);
  const recipe = { uuid: 'recipe-1' };
  await s.execute(s.collectionMutationOptions(s.client, 'alice', 'favorites'), {
    recipe,
    remove: true,
  });
  assert.deepEqual(s.writes, [['alice', 'favorites', recipe, true]]);
  assert.equal(s.invalid(key), true);
  assert.equal(s.invalid(history), false);
  assert.equal(s.invalid(other), false);
  s.seed(key);
  s.failWrites();
  await assert.rejects(
    s.execute(s.collectionMutationOptions(s.client, 'alice', 'favorites'), { recipe }),
    /Write failed/,
  );
  assert.equal(s.invalid(key), false);
  s.client.clear();
});
