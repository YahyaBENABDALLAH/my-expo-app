import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { getRoutes } = require('expo-router/build/getRoutes');
const { StackRouter } = require('expo-router/build/react-navigation/routers/StackRouter');

function discoverRoutes(platform) {
  const files = readdirSync(new URL('../../src/app/', import.meta.url), { recursive: true })
    .filter((name) => name.endsWith('.tsx'))
    .map((name) => `./${name.replaceAll('\\', '/')}`);
  // Exercise real file discovery without loading native screen implementations in Node.
  const context = (key) => ({
    default: () => null,
    ...(key === './_layout.tsx' ? { unstable_settings: { initialRouteName: '(tabs)' } } : {}),
  });
  context.keys = () => files;
  return getRoutes(context, { platform, skipGenerated: true });
}

for (const platform of ['android', 'ios']) {
  test(`${platform}: auth screens are direct root-stack routes, with tabs kept as a layout`, () => {
    const root = discoverRoutes(platform);
    for (const name of ['login', 'register', 'forgot-password']) {
      assert.equal(root.children.find(({ route }) => route === `(auth)/${name}`)?.type, 'route');
    }
    assert.equal(root.children.find(({ route }) => route === '(tabs)')?.type, 'layout');
    assert.equal(
      root.children.some(({ route }) => route === '(auth)'),
      false,
    );
  });
}

test('both auth destinations preload independently without changing the active screen', () => {
  const options = {
    routeNames: discoverRoutes('android').children.map(({ route }) => route),
    routeParamList: {},
    routeGetIdList: {},
  };
  const router = StackRouter({ initialRouteName: '(tabs)' });
  let state = router.getInitialState(options);
  const account = { key: 'account', name: 'account', params: { email: 'alex@example.com' } };
  state.routes[0].state = { type: 'tab', index: 0, routes: [account] };
  const tabsKey = state.routes[0].key;

  for (const name of ['(auth)/register', '(auth)/forgot-password']) {
    state = router.getStateForAction(
      state,
      { type: 'PRELOAD', payload: { name, params: { returnTo: 'account' } } },
      options,
    );
  }
  assert.equal(state.index, 0);
  assert.equal(state.routes.length, 1);
  assert.equal(state.preloadedRoutes.length, 2);

  for (const name of ['(auth)/register', '(auth)/forgot-password']) {
    const prepared = state.preloadedRoutes.find((route) => route.name === name);
    const opened = router.getStateForAction(
      state,
      { type: 'PUSH', payload: { name, params: { returnTo: 'account' } } },
      options,
    );
    assert.equal(opened.routes[opened.index].key, prepared.key);
    assert.equal(opened.routes[opened.index].params.returnTo, 'account');
    const returned = router.getStateForAction(
      opened,
      { type: 'POP', payload: { count: 1 } },
      options,
    );
    assert.equal(returned.routes[returned.index].key, tabsKey);
    assert.deepEqual(returned.routes[returned.index].state.routes[0], account);
  }
});
