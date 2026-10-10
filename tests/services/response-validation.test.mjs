import assert from 'node:assert/strict';
import test from 'node:test';
import { createApiHarness, page } from '../helpers/api-harness.mjs';
import { recipeFixture } from '../helpers/api-fixtures.mjs';
import { createSourceLoader } from '../helpers/load-source.mjs';

const entities = [
  'chef-profile',
  'cuisine',
  'daily-recipe-stat',
  'difficulty',
  'food-category',
  'ingredient',
  'ingredient-type',
  'moroccan-city',
  'moroccan-region',
  'recipe',
  'recipe-ingredient',
  'recipe-like',
  'recipe-nutrition',
  'recipe-share',
  'recipe-step',
  'unit',
];
const camel = (slug) => slug.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
const invalidResponse = (error) =>
  error.name === 'ApiResponseValidationError' && error.status === 200 && error.data === null;

for (const slug of entities) {
  test(`${slug}: malformed successful list responses cannot populate the cache`, async () => {
    const s = createApiHarness(() => page([{}]));
    const options = s.load(`services/${slug}/${slug}.queries.ts`)[`${camel(slug)}ListOptions`]();
    await assert.rejects(s.client.fetchQuery(options), invalidResponse);
    assert.equal(s.client.getQueryData(options.queryKey), undefined);
    assert.equal(s.requests.length, 1);
    s.client.clear();
  });
}

for (const [name, change] of [
  [
    'nonarray data',
    (result) => {
      result.data = {};
    },
  ],
  [
    'string page number',
    (result) => {
      result.meta.page = '1';
    },
  ],
  [
    'nonboolean next-page flag',
    (result) => {
      result.meta.hasNextPage = 'false';
    },
  ],
  [
    'negative item count',
    (result) => {
      result.meta.itemCount = -1;
    },
  ],
]) {
  test(`pagination rejects ${name} without coercing the backend response`, async () => {
    const value = page();
    change(value);
    const s = createApiHarness(() => value);
    const options = s.load('services/recipe/recipe.queries.ts').recipeListOptions();
    await assert.rejects(s.client.fetchQuery(options), invalidResponse);
    assert.equal(s.client.getQueryData(options.queryKey), undefined);
    s.client.clear();
  });
}

for (const details of [
  { steps: {} },
  {
    ingredients: [
      {
        ingredientName: 'Salt',
        quantity: 1,
        unitLabel: null,
        isOptional: 'false',
        notes: null,
        sortOrder: 1,
      },
    ],
  },
  {
    nutrition: { caloriesPerServing: '100', proteinGrams: null, carbsGrams: null, fatGrams: null },
  },
]) {
  test(`recipe detail rejects malformed ${Object.keys(details)[0]} before rendering`, async () => {
    const s = createApiHarness(() => recipeFixture(details));
    const options = s.load('services/recipe/recipe.queries.ts').recipeDetailOptions('recipe-1');
    await assert.rejects(s.client.fetchQuery(options), invalidResponse);
    assert.equal(s.client.getQueryData(options.queryKey), undefined);
    s.client.clear();
  });
}

test('valid nullability and additive server fields survive entity validation', async () => {
  const body = recipeFixture({ newServerField: 'future', ingredients: null, steps: null });
  const s = createApiHarness(() => body);
  const options = s.load('services/recipe/recipe.queries.ts').recipeDetailOptions('recipe-1');
  assert.deepEqual(await s.client.fetchQuery(options), body);
  assert.deepEqual(s.client.getQueryData(options.queryKey), body);
  s.client.clear();
});

test('a malformed POST response never seeds a detail or invalidates lists and is not repeated', async () => {
  const s = createApiHarness(() => ({ uuid: 'created', accessToken: 'must-not-leak' }));
  const keys = s.load('lib/api-query-keys.ts').recipeKeys;
  const list = keys.list({});
  s.client.setQueryData(list, page());
  const options = s
    .load('services/recipe/recipe.mutations.ts')
    .createRecipeMutationOptions(s.client);
  await assert.rejects(
    s.execute(options, { chefUuid: 'chef', body: { title: 'Tagine', difficultyUuid: 'easy' } }),
    (error) => {
      assert.equal(error.data, null);
      assert.equal(JSON.stringify(error).includes('must-not-leak'), false);
      return invalidResponse(error);
    },
  );
  assert.equal(s.requests.length, 1);
  assert.equal(s.client.getQueryData(keys.detail('created')), undefined);
  assert.equal(s.client.getQueryState(list).isInvalidated, false);
  s.client.clear();
});

const token = () => ({
  userId: 'alice',
  email: 'alice@example.com',
  firstName: 'Alice',
  lastName: 'Cook',
  roles: ['CHEF'],
  accessToken: 'secret-access',
  refreshToken: 'secret-refresh',
  tokenType: 'Bearer',
  accessTokenExpiresAtUtc: '2099-01-01T00:00:00Z',
  refreshTokenExpiresAtUtc: '2099-02-01T00:00:00Z',
  sessionId: 'session-alice',
  deviceId: 'device-alice',
});
const flow = () => ({
  isOtpValidated: true,
  challengeId: null,
  maskedEmail: null,
  otpExpiresAtUtc: null,
  otpResendAvailableAtUtc: null,
  loginResponse: token(),
});

test('login accepts the documented token result and pending challenge shapes', async () => {
  for (const value of [
    flow(),
    { ...flow(), isOtpValidated: false, challengeId: 'challenge', loginResponse: null },
  ]) {
    const s = createApiHarness(() => value);
    assert.deepEqual(
      await s.load('services/auth/auth.api.ts').login({ login: 'alice', password: 'password' }),
      value,
    );
    assert.equal(s.requests[0].headers.get('Authorization'), undefined);
    s.client.clear();
  }
});

for (const [name, change] of [
  [
    'nonboolean validation flag',
    (value) => {
      value.isOtpValidated = 'true';
    },
  ],
  [
    'missing success token',
    (value) => {
      value.loginResponse = null;
    },
  ],
  [
    'invalid token expiry',
    (value) => {
      value.loginResponse.accessTokenExpiresAtUtc = 'tomorrow';
    },
  ],
  [
    'nonstring role',
    (value) => {
      value.loginResponse.roles = [5];
    },
  ],
]) {
  test(`authentication rejects ${name} without exposing tokens`, async () => {
    const value = flow();
    change(value);
    const s = createApiHarness(() => value);
    await assert.rejects(
      s.load('services/auth/auth.api.ts').login({ login: 'alice', password: 'password' }),
      (error) => {
        assert.equal(JSON.stringify(error).includes('secret'), false);
        return invalidResponse(error);
      },
    );
    assert.equal(s.requests.length, 1);
    s.client.clear();
  });
}

test('the app query retry policy does not repeat deterministic response validation failures', async () => {
  const load = createSourceLoader();
  const { queryClient: client } = load('lib/react-query.ts');
  const { ApiResponseValidationError } = load('services/api.error.ts');
  let requests = 0;
  try {
    await assert.rejects(
      client.fetchQuery({
        queryKey: ['bad-response'],
        queryFn: () => {
          requests++;
          throw new ApiResponseValidationError(200);
        },
      }),
      invalidResponse,
    );
    assert.equal(requests, 1);
  } finally {
    client.clear();
  }
});
