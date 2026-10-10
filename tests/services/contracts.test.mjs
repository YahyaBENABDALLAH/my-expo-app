import assert from 'node:assert/strict';
import test from 'node:test';
import { createApiHarness, page } from '../helpers/api-harness.mjs';
import { entityFixture, chefFixture } from '../helpers/api-fixtures.mjs';

const entities = [
  ['chef-profile', 'chefProfile', 'ChefProfile'],
  ['cuisine', 'cuisine', 'Cuisine'],
  ['daily-recipe-stat', 'dailyRecipeStat', 'DailyRecipeStat'],
  ['difficulty', 'difficulty', 'Difficulty'],
  ['food-category', 'foodCategory', 'FoodCategory'],
  ['ingredient', 'ingredient', 'Ingredient'],
  ['ingredient-type', 'ingredientType', 'IngredientType'],
  ['moroccan-city', 'moroccanCity', 'MoroccanCity'],
  ['moroccan-region', 'moroccanRegion', 'MoroccanRegion'],
  ['recipe', 'recipe', 'Recipe'],
  ['recipe-ingredient', 'recipeIngredient', 'RecipeIngredient'],
  ['recipe-like', 'recipeLike', 'RecipeLike'],
  ['recipe-nutrition', 'recipeNutrition', 'RecipeNutrition'],
  ['recipe-share', 'recipeShare', 'RecipeShare'],
  ['recipe-step', 'recipeStep', 'RecipeStep'],
  ['unit', 'unit', 'Unit'],
];

for (const [slug, name, endpoint] of entities) {
  test(`${endpoint}: documented list/detail paths, normalized parameters, cancellation`, async () => {
    const s = createApiHarness(({ path }) =>
      path === `/api/${endpoint}` ? page([entityFixture(slug)]) : entityFixture(slug),
    );
    const service = s.load(`services/${slug}/${slug}.service.ts`)[`${name}Service`];
    const signal = new AbortController().signal;
    await service.list(
      { page: undefined, search: '  tagine  ', isActive: false },
      { signal, timeoutMs: 2500 },
    );
    await service.detail(
      '  id/one  ',
      ...(['recipe-like', 'recipe-ingredient'].includes(slug)
        ? ['  id/two  ', { signal }]
        : [{ signal }]),
    );
    assert.equal(s.requests[0].method, 'GET');
    assert.equal(s.requests[0].path, `/api/${endpoint}`);
    assert.equal(s.requests[0].params.search, 'tagine');
    assert.equal(s.requests[0].params.isActive, false);
    assert.equal(s.requests[0].params.page, 1);
    assert.equal(s.requests[0].signal, signal);
    assert.equal(s.requests[0].timeout, 2500);
    assert.equal(
      s.requests[1].path,
      `/api/${endpoint}/id%2Fone${['recipe-like', 'recipe-ingredient'].includes(slug) ? '/id%2Ftwo' : ''}`,
    );
    assert.equal(s.requests[1].signal, signal);
    assert.equal(s.requests[0].headers.get('Authorization'), 'Bearer test-token');
    s.client.clear();
  });
}

test('invalid pagination and empty identifiers fail before any request', async () => {
  const s = createApiHarness();
  const service = s.load('services/recipe/recipe.service.ts').recipeService;
  for (const query of [{ page: 0 }, { page: -1 }, { page: 1.5 }, { pageSize: Infinity }]) {
    assert.throws(() => service.list(query), /positive integer/);
  }
  assert.throws(() => service.detail('  '), /identifier/);
  assert.equal(s.requests.length, 0);
  s.client.clear();
});

test('writes use exactly the documented POST, PATCH and DELETE contracts', async () => {
  const s = createApiHarness(({ path }) =>
    entityFixture(
      entities.find(
        ([, , endpoint]) => path === `/api/${endpoint}` || path.startsWith(`/api/${endpoint}/`),
      )?.[0] ?? 'recipe',
    ),
  );
  const recipe = s.load('services/recipe/recipe.service.ts').recipeService;
  const likes = s.load('services/recipe-like/recipe-like.service.ts').recipeLikeService;
  const chef = s.load('services/chef-profile/chef-profile.service.ts').chefProfileService;
  const stats = s.load(
    'services/daily-recipe-stat/daily-recipe-stat.service.ts',
  ).dailyRecipeStatService;
  const recipeBody = { title: 'Tagine', difficultyUuid: 'easy' };
  await recipe.create(' chef/1 ', recipeBody);
  await likes.create({ recipeUuid: ' r/1 ', userUuid: ' u/1 ' });
  await likes.delete('r/1', 'u/1');
  await chef.createSelf({ displayName: 'Chef' });
  await chef.update('c/1', { bio: 'New bio' });
  await chef.toggleVerified('c/1');
  await stats.today();
  await stats.last();
  assert.deepEqual(
    s.requests.map(({ method, path, body }) => [method, path, body]),
    [
      ['POST', '/api/Recipe/chef%2F1', recipeBody],
      ['POST', '/api/RecipeLike', { recipeUuid: 'r/1', userUuid: 'u/1' }],
      ['DELETE', '/api/RecipeLike/r%2F1/u%2F1', undefined],
      ['POST', '/api/ChefProfile/me', { displayName: 'Chef' }],
      ['PATCH', '/api/ChefProfile/c%2F1', { bio: 'New bio' }],
      ['PATCH', '/api/ChefProfile/c%2F1/toggle-verified', undefined],
      ['GET', '/api/DailyRecipeStat/today', undefined],
      ['GET', '/api/DailyRecipeStat/last', undefined],
    ],
  );
  s.client.clear();
});

test('chef lookup scans the documented pages and stops on repeated or empty pages', async () => {
  const s = createApiHarness(({ params }) =>
    page(
      [chefFixture({ uuid: 'chef', userUuid: params.page === 2 ? 'alice' : 'bob' })],
      params.page,
      true,
    ),
  );
  const chef = s.load('services/chef-profile/chef-profile.service.ts').chefProfileService;
  assert.equal((await chef.forUser(' alice ')).userUuid, 'alice');
  assert.deepEqual(
    s.requests.map((r) => r.params),
    [
      { page: 1, pageSize: 100 },
      { page: 2, pageSize: 100 },
    ],
  );
  const repeated = createApiHarness(() => page([chefFixture({ userUuid: 'bob' })], 1, true));
  assert.equal(
    await repeated
      .load('services/chef-profile/chef-profile.service.ts')
      .chefProfileService.forUser('alice'),
    null,
  );
  assert.equal(repeated.requests.length, 2);
  const empty = createApiHarness(() => page([], 1, true));
  assert.equal(
    await empty
      .load('services/chef-profile/chef-profile.service.ts')
      .chefProfileService.forUser('alice'),
    null,
  );
  assert.equal(empty.requests.length, 1);
  for (const harness of [s, repeated, empty]) harness.client.clear();
});
