import assert from 'node:assert/strict';
import test from 'node:test';
import { createContext, createElement, useState } from 'react';
import { useController } from 'react-hook-form';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

for (const development of [true, false]) {
  test(`${development ? 'development' : 'production'} login validates credentials and isolates the simulation`, async () => {
    const requests = [];
    const routes = [];
    let guest = false;
    let rejectLogin = true;
    let setTransitioning;
    const LoginTransitionContext = createContext(false);
    const native = (name) =>
      function NativeFixture(props) {
        return createElement(name, props, props.children);
      };
    const load = createSourceLoader({
      '@components/ui': {
        Column: native('Column'),
        AuthScreenFrame: native('Frame'),
        LoginPreferences: native('Preferences'),
        UniversalButtonContent: native('Button'),
        FormSubmit: native('Submit'),
        authInputIcons: {},
        FormTextInput(props) {
          const { field, fieldState } = useController({ control: props.control, name: props.name });
          return createElement('Input', { ...props, ...field, error: fieldState.error });
        },
      },
      'expo-router': { router: { replace: (route) => routes.push(route) } },
      'react-native': { Keyboard: { dismiss() {} } },
      '@tanstack/react-query': {
        useMutation: ({ mutationFn }) => ({ mutateAsync: mutationFn, isPending: false }),
      },
      '@/constants/app-dev': { appDevEnabled: development },
      '@/context/login-transition.context': { LoginTransitionContext },
      '@/context/auth.context': {
        useAuthContext() {
          const [developmentGuest, enterDevelopmentGuest] = useState(false);
          guest = developmentGuest;
          return {
            developmentGuest,
            enterDevelopmentGuest: () => {
              setTransitioning(true);
              enterDevelopmentGuest(true);
            },
          };
        },
      },
      '@/features/auth/auth-flow.context': {
        useAuthFlow: () => ({
          signIn: async (values) => {
            requests.push(values);
            if (rejectLogin) throw new Error('Invalid credentials');
          },
        }),
      },
    });
    const { LoginScreen } = load('features/auth/screens/login-screen.tsx');
    function Frame() {
      const [transitioning, updateTransitioning] = useState(false);
      setTransitioning = updateTransitioning;
      return createElement(
        LoginTransitionContext.Provider,
        { value: transitioning },
        createElement(LoginScreen),
      );
    }
    const view = renderFixture(createElement(Frame));
    const input = (name) => view.findAll('Input').find(({ props }) => props.name === name);
    const submit = async (login, password) => {
      view.flush(() => {
        input('login').props.onChange(login);
        input('password').props.onChange(password);
      });
      view.flush(() => view.findAll('Submit')[0].props.onPress());
      await new Promise(setImmediate);
      view.flush(() => {});
    };
    try {
      await submit('alex', 'wrong-password');
      assert.deepEqual(requests, [{ login: 'alex', password: 'wrong-password' }]);
      assert.equal(input('password').props.value, 'wrong-password');
      assert.equal(guest, false);
      assert.deepEqual(routes, []);

      rejectLogin = false;
      await submit('alex', 'real-password');
      assert.deepEqual(requests.at(-1), { login: 'alex', password: 'real-password' });
      assert.equal(guest, false);

      for (const [login, password] of [
        ['alex', 'admin'],
        ['Admin', 'admin'],
        ['admin', 'admin '],
      ]) {
        await submit(login, password);
        assert.equal(Boolean(input('password').props.error), true);
      }
      await submit(' admin ', 'admin');
      assert.equal(requests.length, 2);
      assert.equal(guest, development);
      assert.deepEqual(routes, [], 'Simulation stays on Login while its wave rises.');
      if (development) {
        assert.equal(view.findAll('Submit')[0].props.pending, true);
        view.flush(() => setTransitioning(false));
      }
      assert.deepEqual(routes, development ? ['/(tabs)'] : []);
      assert.equal(Boolean(input('password').props.error), !development);
    } finally {
      view.unmount();
    }
  });
}
