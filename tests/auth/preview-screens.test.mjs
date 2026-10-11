import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import { createElement } from 'react';
import ts from 'typescript';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

const profiles = JSON.parse(readFileSync(new URL('../../eas.json', import.meta.url), 'utf8')).build;
const appDevSource = ts.transpileModule(
  readFileSync(new URL('../../src/constants/app-dev.ts', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText;
const metroSource = readFileSync(new URL('../../metro.config.js', import.meta.url), 'utf8');

function buildSettings(env, development = false) {
  const runtime = { exports: {}, __DEV__: development, process: { env } };
  runInNewContext(appDevSource, runtime);
  let storybookEnabled;
  runInNewContext(metroSource, {
    __dirname: '.',
    module: {},
    process: { env: { NODE_ENV: development ? 'development' : 'production', ...env } },
    require(name) {
      if (name === 'expo/metro-config')
        return { getDefaultConfig: () => ({ resolver: { assetExts: [] } }) };
      if (name === '@storybook/react-native/metro/withStorybook')
        return {
          withStorybook(config, options) {
            storybookEnabled = options.enabled;
            return config;
          },
        };
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  return { appDevEnabled: runtime.exports.appDevEnabled, storybookEnabled };
}

test('preview is a standalone internal build with developer screens and Storybook enabled', () => {
  assert.equal(profiles.preview.distribution, 'internal');
  assert.notEqual(profiles.preview.developmentClient, true);
  assert.deepEqual(buildSettings(profiles.preview.env), {
    appDevEnabled: true,
    storybookEnabled: true,
  });
});

test('production and release exports without the preview flag disable developer access', () => {
  for (const env of [profiles.production.env, {}, { EXPO_PUBLIC_ENABLE_DEV_SCREENS: 'false' }])
    assert.deepEqual(buildSettings(env), { appDevEnabled: false, storybookEnabled: false });
});

test('local development keeps developer screens even with the example flag set to false', () => {
  assert.deepEqual(buildSettings({ EXPO_PUBLIC_ENABLE_DEV_SCREENS: 'false' }, true), {
    appDevEnabled: true,
    storybookEnabled: true,
  });
});

for (const [name, env, development, allowed] of [
  ['preview release', profiles.preview.env, false, true],
  ['production release', profiles.production.env, false, false],
  ['local development', {}, true, true],
]) {
  test(`${name}: login entry, page links, guards and guest exit use the build setting`, async () => {
    const { appDevEnabled } = buildSettings(env, development);
    const native = (type) =>
      function NativeFixture(props) {
        return createElement(type, props, props.children);
      };
    let finishRestore;
    let sessionListener;
    const navigations = [];
    const load = createSourceLoader({
      '@/constants/app-dev': { appDevEnabled },
      '@/services/auth/auth.lifecycle': {
        restoreSession: () => new Promise((resolve) => (finishRestore = resolve)),
        signOut: async () => sessionListener({ session: null }),
      },
      '@/services/auth/auth.session': {
        getSessionVersion: () => 0,
        subscribeAuthSession(listener) {
          sessionListener = listener;
          return () => {};
        },
      },
      '@components/ui': {
        PageScreen: native('PageScreen'),
        UniversalButtonContent: native('Button'),
        AuthScreenFrame: native('AuthScreenFrame'),
        LoginPreferences: native('LoginPreferences'),
        Column: native('Column'),
        FormSubmit: native('FormSubmit'),
        FormTextInput: native('FormTextInput'),
        authInputIcons: {},
        nativeFillWidth: [],
        nativeFillWidthEnd: [],
      },
      'expo-router': { router: { replace: (href) => navigations.push(href) } },
      '@tanstack/react-query': { useQuery: () => ({}) },
      '@/features/recipes/queries': {
        recipeListOptions: () => ({ queryKey: ['recipes'] }),
        lookupOptions: () => ({ queryKey: ['categories'] }),
      },
      '@/hooks/use-screen-refresh': { useScreenRefresh: () => () => {} },
      '@/features/auth/hooks/use-auth-form': {
        useAuthForm: () => ({ form: { control: {} }, submit() {}, pending: false }),
      },
      '@/features/auth/auth-flow.context': { useAuthFlow: () => ({ signIn() {} }) },
      '@/validation/resolvers/auth': { loginResolver: {} },
    });
    const { AuthProvider, useAuthContext } = load('context/auth.context.tsx');
    const { useAuthGuards } = load('guards/auth-guards.ts');
    const { LoginScreen } = load('features/auth/screens/login-screen.tsx');
    const { DevelopmentPagesScreen, UiShowcaseScreen } = load('features/pages/screens.tsx');
    let auth;
    let access;
    function Probe() {
      auth = useAuthContext();
      access = useAuthGuards();
      return null;
    }
    const view = renderFixture(
      createElement(
        AuthProvider,
        null,
        createElement(Probe),
        createElement(LoginScreen),
        createElement(DevelopmentPagesScreen),
        createElement(UiShowcaseScreen),
      ),
    );
    try {
      view.flush(() => auth.enterDevelopmentGuest());
      assert.equal(auth.developmentGuest, false, 'Guest entry waits for restoration');
      assert.equal(access.restoring, true);
      finishRestore(null);
      await new Promise(setImmediate);
      view.flush(() => {});
      const guestButton = view
        .findAll('Button')
        .find((item) => item.props.testID === 'auth-development-guest');
      assert.equal(Boolean(guestButton), allowed);
      view.flush(() => (guestButton ? guestButton.props.onPress() : auth.enterDevelopmentGuest()));
      view.flush(() => {});
      assert.equal(auth.developmentGuest, allowed);
      assert.equal(auth.user, null, 'Browsing creates no identity');
      assert.equal(access.requireAuth, allowed);
      assert.equal(access.requireNoAuth, true);
      assert.deepEqual(navigations, allowed ? ['/development-pages'] : []);
      const directory = view.findAll('PageScreen').find((item) => item.props.title === 'All pages');
      const destinations = directory.props.actions.map((action) => action.href);
      for (const href of ['/ui', '/storybook', '/skia', '/maps'])
        assert.equal(destinations.includes(href), allowed, href);
      const showcase = view
        .findAll('PageScreen')
        .find((item) => item.props.title === 'UI showcase');
      assert.equal(
        showcase.props.actions.some((action) => action.href === '/storybook'),
        allowed,
      );
      assert.ok(
        showcase.props.actions.some((action) => action.href.pathname === '/ui-component/[name]'),
      );
      view.flush(() => auth.exitDevelopmentGuest());
      assert.equal(auth.developmentGuest, false);
      assert.equal(access.requireAuth, false, 'Exiting guest mode restores signed-out protection');
      view.flush(() => sessionListener({ session: { user: { uuid: 'real-user' } } }));
      assert.equal(access.requireAuth, true);
      assert.equal(access.requireNoAuth, false);
      assert.equal(auth.developmentGuest, false);
      let signingOut;
      view.flush(() => {
        signingOut = auth.signOut();
      });
      await signingOut;
      assert.equal(access.requireAuth, false);
      assert.equal(auth.developmentGuest, false);
    } finally {
      view.unmount();
    }
  });
}
