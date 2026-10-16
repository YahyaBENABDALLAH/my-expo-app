import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { Script } from 'node:vm';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { getRoutes } = require('expo-router/build/getRoutes');
const { StackRouter } = require('expo-router/build/react-navigation/routers/StackRouter');
const { getReactNavigationConfig } = require('expo-router/build/getReactNavigationConfig');

// Use the installed Expo URL parser, substituting only its native barrel import
// with the same pure validator export so Node need not load React Native views.
const parserPath = require.resolve('expo-router/build/fork/getStateFromPath');
const parserRequire = createRequire(parserPath);
const parserModule = { exports: {} };
new Script(`(function(require, module, exports) {${readFileSync(parserPath, 'utf8')}\n})`, {
  filename: parserPath,
}).runInThisContext()(
  (name) =>
    name === '../react-navigation/native'
      ? { validatePathConfig: parserRequire('./validatePathConfig').default }
      : parserRequire(name),
  parserModule,
  parserModule.exports,
);
const { getStateFromPath } = parserModule.exports;

function focusedRoute(state) {
  let route = state.routes[state.index ?? state.routes.length - 1];
  while (route.state)
    route = route.state.routes[route.state.index ?? route.state.routes.length - 1];
  return route;
}

function discoverRoutes(platform) {
  const files = readdirSync(new URL('../../src/app/', import.meta.url), { recursive: true })
    .filter((name) => name.endsWith('.tsx'))
    .map((name) => `./${name.replaceAll('\\', '/')}`);
  const context = (key) => ({
    default: () => null,
    ...(key === './(auth)/_layout.tsx' ? { unstable_settings: { initialRouteName: 'login' } } : {}),
    ...(key === './(onboarding)/_layout.tsx'
      ? { unstable_settings: { initialRouteName: 'discover' } }
      : {}),
  });
  context.keys = () => files;
  return getRoutes(context, { platform, skipGenerated: true });
}

for (const platform of ['android', 'ios']) {
  test(`${platform}: all auth routes share one layout and verification is reachable`, () => {
    const root = discoverRoutes(platform);
    const auth = root.children.find(({ route }) => route === '(auth)');
    assert.equal(auth.type, 'layout');
    assert.equal(auth.initialRouteName, 'login');
    for (const name of ['login', 'register', 'forgot-password', 'reset-password', 'verify-email'])
      assert.equal(auth.children.find(({ route }) => route === name)?.type, 'route');
    assert.equal(root.children.find(({ route }) => route === '(tabs)')?.type, 'layout');
  });
  test(`${platform}: the first-launch introduction stays on one discovery route`, () => {
    const introduction = discoverRoutes(platform).children.find(
      ({ route }) => route === '(onboarding)',
    );
    assert.equal(introduction.type, 'layout');
    assert.equal(introduction.initialRouteName, 'discover');
    assert.deepEqual(
      introduction.children.map(({ route }) => route),
      ['discover'],
    );
  });
}

for (const platform of ['android', 'ios']) {
  test(`${platform}: every inventory destination is discoverable with dynamic detail IDs`, () => {
    const root = discoverRoutes(platform);
    const tabs = root.children.find(({ route }) => route === '(tabs)');
    for (const route of ['index', 'search', 'create-recipe', 'recipes', 'more'])
      assert.equal(tabs.children.find((child) => child.route === route)?.type, 'route', route);
    for (const route of [
      'recipe/[uuid]',
      'category/[uuid]',
      'my-recipes/liked-favorites',
      'my-recipes/history',
      'my-recipes/creations',
      'ingredients',
      'become-chef',
      'device-info',
      'health-check',
      'settings',
      'ui',
      'main',
      'sign-up',
    ])
      assert.equal(root.children.find((child) => child.route === route)?.type, 'route', route);
    for (const route of ['recipe/[uuid]', 'category/[uuid]']) {
      const detail = root.children.find((child) => child.route === route);
      assert.ok(detail.dynamic.some((parameter) => parameter.name === 'uuid'));
    }
  });
}

test('register and recovery return to the existing login route and retain its draft', () => {
  const options = {
    routeNames: ['login', 'register', 'forgot-password', 'reset-password', 'verify-email'],
    routeParamList: {},
    routeGetIdList: {},
  };
  const router = StackRouter({ initialRouteName: 'login' });
  const initial = router.getInitialState(options);
  initial.routes[0].params = { draft: 'alex@example.com' };
  for (const name of ['register', 'forgot-password', 'reset-password']) {
    const pushed = router.getStateForAction(initial, { type: 'PUSH', payload: { name } }, options);
    const returned = router.getStateForAction(
      pushed,
      { type: 'POP', payload: { count: 1 } },
      options,
    );
    assert.equal(returned.routes[0].key, initial.routes[0].key);
    assert.equal(returned.routes[0].params.draft, 'alex@example.com');
  }
});

for (const platform of ['android', 'ios']) {
  const config = getReactNavigationConfig(discoverRoutes(platform));
  for (const [path, name, params] of [
    ['/', 'index', {}],
    ['/discover', 'discover', {}],
    [
      '/recipe/00000000-0000-4000-8000-000000000001',
      'recipe/[uuid]',
      { uuid: '00000000-0000-4000-8000-000000000001' },
    ],
    ['/category/moroccan', 'category/[uuid]', { uuid: 'moroccan' }],
    ['/ui', 'ui', {}],
    ['/settings', 'settings', {}],
    ['/ui-component/switch', 'ui-component/[name]', { name: 'switch' }],
    ['/ui-component/buttons', 'ui-component/[name]', { name: 'buttons' }],
    ['/ui-component/tokens', 'ui-component/[name]', { name: 'tokens' }],
    [
      '/search?q=chicken%20tagine&categoryUuid=c1&cuisineUuid=c2&difficultyUuid=d1',
      'search',
      { q: 'chicken tagine', categoryUuid: 'c1', cuisineUuid: 'c2', difficultyUuid: 'd1' },
    ],
    ['/my-recipes/liked-favorites?tab=favorite', 'my-recipes/liked-favorites', { tab: 'favorite' }],
    [
      '/reset-password?challengeId=00000000-0000-4000-8000-000000000001',
      'reset-password',
      { challengeId: '00000000-0000-4000-8000-000000000001' },
    ],
    ['/page-that-does-not-exist', '+not-found', {}],
  ]) {
    test(`${platform}: direct path ${path} resolves its destination and parameters`, () => {
      const state = getStateFromPath(path, config);
      assert.ok(state, 'Expected a navigation state');
      const route = focusedRoute(state);
      assert.equal(route.name, name);
      for (const [key, value] of Object.entries(params)) assert.equal(route.params[key], value);
    });
  }
}

test('changing guarded route availability removes the previous group from history', () => {
  const router = StackRouter({ initialRouteName: '(auth)' });
  const options = (routeNames) => ({
    routeNames,
    routeParamList: {},
    routeGetIdList: {},
    routeKeyChanges: [],
  });
  const loggedOut = router.getInitialState(options(['(auth)']));
  const loggedIn = router.getStateForRouteNamesChange(loggedOut, options(['(tabs)']));
  assert.deepEqual(
    loggedIn.routes.map((route) => route.name),
    ['(tabs)'],
  );
  const signedOut = router.getStateForRouteNamesChange(loggedIn, options(['(auth)']));
  assert.deepEqual(
    signedOut.routes.map((route) => route.name),
    ['(auth)'],
  );
});

for (const destination of ['(auth)', '(tabs)']) {
  test(`finishing onboarding removes its history before entering ${destination}`, () => {
    const router = StackRouter({ initialRouteName: '(tabs)' });
    const options = (routeNames) => ({
      routeNames,
      routeParamList: {},
      routeGetIdList: {},
      routeKeyChanges: [],
    });
    const firstLaunch = router.getInitialState(options(['(onboarding)']));
    assert.equal(firstLaunch.routes[0].name, '(onboarding)');
    const completed = router.getStateForRouteNamesChange(firstLaunch, options([destination]));
    assert.deepEqual(
      completed.routes.map(({ name }) => name),
      [destination],
    );
    assert.equal(
      router.getStateForAction(
        completed,
        { type: 'POP', payload: { count: 1 } },
        options([destination]),
      ),
      null,
    );
  });
}
