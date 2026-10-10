import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
import * as zod from 'zod';
import { queryOptions } from '@tanstack/react-query';
import { recipeKeys } from '../../src/lib/api-query-keys.ts';

const source = ts.transpileModule(
  readFileSync(new URL('../../src/features/recipes/collections.ts', import.meta.url), 'utf8'),
  {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  },
).outputText;
function setup() {
  const saved = new Map();
  let fail = false;
  const storage = {
    getItem: async (key) => saved.get(key) ?? null,
    setItem: async (key, value) => {
      if (fail) throw new Error('Storage locked');
      saved.set(key, value);
    },
  };
  const exports = {};
  new Function('require', 'exports', source)((name) => {
    if (name === '@react-native-async-storage/async-storage')
      return { __esModule: true, default: storage };
    if (name === '@tanstack/react-query') return { queryOptions };
    if (name === 'zod') return zod;
    if (name === './query-keys') return { recipeKeys };
    throw new Error(name);
  }, exports);
  return {
    ...exports,
    saved,
    failWrites: (next) => {
      fail = next;
    },
  };
}
const recipe = (uuid) => ({
  uuid,
  title: `Recipe ${uuid}`,
  coverImageUrl: null,
  totalTimeMinutes: 20,
  difficultyName: null,
  likesCount: 0,
  chefDisplayName: null,
});
const read = (api, user, kind) => api.collectionOptions(user, kind).queryFn();

test('concurrent favorites do not lose either recipe and remain private to each account', async () => {
  const api = setup();
  await Promise.all([
    api.updateCollection('alice', 'favorites', recipe('a')),
    api.updateCollection('alice', 'favorites', recipe('b')),
  ]);
  assert.deepEqual(
    (await read(api, 'alice', 'favorites')).map((item) => item.uuid),
    ['b', 'a'],
  );
  assert.deepEqual(await read(api, 'bob', 'favorites'), []);
  assert.notDeepEqual(
    api.collectionOptions('alice', 'favorites').queryKey,
    api.collectionOptions('bob', 'favorites').queryKey,
  );
});

test('history revisits move to the front without duplicates and retention is bounded', async () => {
  const api = setup();
  for (let i = 0; i < 52; i++) await api.updateCollection('alice', 'history', recipe(String(i)));
  await api.updateCollection('alice', 'history', recipe('10'));
  const history = await read(api, 'alice', 'history');
  assert.equal(history.length, 50);
  assert.equal(history[0].uuid, '10');
  assert.equal(history.filter((item) => item.uuid === '10').length, 1);
  assert.equal(
    history.some((item) => item.uuid === '0'),
    false,
  );
});

test('failed writes retain the old collection and a later retry succeeds', async () => {
  const api = setup();
  await api.updateCollection('alice', 'favorites', recipe('a'));
  api.failWrites(true);
  await assert.rejects(api.updateCollection('alice', 'favorites', recipe('b')), /Storage locked/);
  assert.deepEqual(
    (await read(api, 'alice', 'favorites')).map((item) => item.uuid),
    ['a'],
  );
  api.failWrites(false);
  await api.updateCollection('alice', 'favorites', recipe('b'));
  assert.equal((await read(api, 'alice', 'favorites')).length, 2);
});

test('removing a favorite and clearing history do not touch the other account or collection', async () => {
  const api = setup();
  await api.updateCollection('alice', 'favorites', recipe('a'));
  await api.updateCollection('alice', 'history', recipe('a'));
  await api.updateCollection('bob', 'favorites', recipe('b'));
  await api.updateCollection('alice', 'favorites', recipe('a'), true);
  await api.updateCollection('alice', 'history');
  assert.deepEqual(await read(api, 'alice', 'favorites'), []);
  assert.deepEqual(await read(api, 'alice', 'history'), []);
  assert.equal((await read(api, 'bob', 'favorites'))[0].uuid, 'b');
});
