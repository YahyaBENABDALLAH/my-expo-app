import assert from 'node:assert/strict';
import test from 'node:test';
import { createContext, createElement as h, useContext, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

// Exercise the production dispatcher and action registration together. Only the
// native view, navigator and keyboard are mocked; these are JS delivery checks.
function setup(platform) {
  const Focus = createContext(true);
  const keyboard = new Map();
  const destinations = [];
  const delivered = [];
  const routes = ['index', 'search', 'more', 'recipes', 'create-recipe'];
  let update;
  const load = createSourceLoader({
    '@components/ui': { ReferenceNavigationBar: (props) => h('navigation-bar', props) },
    '@/hooks/use-color-scheme': { useColorScheme: () => 'light' },
    'expo-router': {
      useIsFocused: () => useContext(Focus),
      router: { navigate: (destination) => destinations.push(destination) },
    },
    'react-native': {
      Platform: { OS: platform },
      Keyboard: {
        isVisible: () => false,
        addListener: (name, callback) => {
          keyboard.set(name, callback);
          return { remove: () => keyboard.delete(name) };
        },
      },
    },
  });
  const { TabActionsProvider, useRegisterTabAction } = load('features/pages/tab-actions.tsx');
  const { ReferenceTabBar } = load('features/pages/reference-tab-bar.tsx');
  function RegisteredActions() {
    const [filters, setFilters] = useState(0);
    const [step, setStep] = useState(0);
    useRegisterTabAction('search', {
      kind: 'filters',
      label: 'Filters opened: ' + filters,
      onPress: () => {
        delivered.push('filters:' + filters);
        setFilters(filters + 1);
      },
    });
    useRegisterTabAction('more', {
      kind: 'profile',
      label: 'Open profile',
      onPress: () => delivered.push('profile'),
    });
    useRegisterTabAction('create-recipe', {
      kind: step < 2 ? 'continue' : 'submit',
      label: 'Step: ' + step,
      onPress: () => {
        delivered.push('step:' + step);
        setStep(step + 1);
      },
    });
    return null;
  }
  function App() {
    const [state, setState] = useState({ focused: true, route: 'index' });
    update = (changes) => setState((current) => ({ ...current, ...changes }));
    return h(
      TabActionsProvider,
      null,
      h(RegisteredActions),
      h(
        Focus.Provider,
        { value: state.focused },
        h(ReferenceTabBar, {
          state: {
            index: routes.indexOf(state.route),
            routes: routes.map((name) => ({ name, key: name })),
          },
          navigation: {},
          insets: { left: 0, right: 0, bottom: 24 },
        }),
      ),
    );
  }
  const view = renderFixture(h(App));
  const flush = (action) => {
    view.flush(action);
    view.flush(() => {}); // Commit actions published by registration effects.
  };
  flush(() => {});
  const bar = () => view.findAll('navigation-bar')[0]?.props;
  return {
    bar,
    keyboard,
    destinations,
    delivered,
    update: (changes) => flush(() => update(changes)),
    press: () => flush(() => bar().action.onPress()),
    settle: async () => {
      await new Promise(setImmediate);
      flush(() => {});
    },
    keyboardEvent: (name) => flush(() => keyboard.get(name)()),
    unmount: view.unmount,
  };
}

for (const platform of ['android', 'ios']) {
  test(
    platform +
      ': floating-action motion follows navigator focus and the keyboard hides its touch target',
    (t) => {
      const s = setup(platform);
      t.after(s.unmount);
      assert.equal(s.bar().animate, true);
      assert.equal(s.bar().bottomInset, 24);
      s.press();
      assert.deepEqual(s.destinations, ['/create-recipe']);
      s.update({ focused: false });
      assert.equal(s.bar().animate, false);
      s.update({ focused: true });
      assert.equal(s.bar().animate, true);
      s.keyboardEvent('keyboardDidShow');
      assert.equal(s.bar(), undefined);
      s.keyboardEvent('keyboardDidHide');
      assert.equal(s.bar().animate, true);
      s.unmount();
      assert.equal(s.keyboard.size, 0, 'Native keyboard subscriptions are released.');
    },
  );

  test(
    platform + ': rapid presses reach current actions across tab switches and recipe steps',
    async (t) => {
      // Every activation occurs inside the old shared 800 ms lockout window.
      t.mock.method(Date, 'now', () => 20_000);
      const s = setup(platform);
      t.after(s.unmount);
      s.press();
      s.update({ route: 'search' });
      s.press();
      s.press();
      assert.deepEqual(s.delivered, ['filters:0', 'filters:1']);
      await s.settle();
      assert.equal(s.bar().action.label, 'Filters opened: 2');
      s.update({ route: 'more' });
      s.press();
      assert.equal(s.delivered.at(-1), 'profile');
      s.update({ route: 'recipes' });
      s.press();
      assert.deepEqual(s.destinations, ['/create-recipe', '/my-recipes/liked-favorites']);
      s.update({ route: 'create-recipe' });
      s.press();
      s.press();
      await s.settle();
      assert.equal(s.bar().action.kind, 'submit');
      s.press();
      assert.deepEqual(s.delivered.slice(-3), ['step:0', 'step:1', 'step:2']);
      s.update({ route: 'search' });
      s.press();
      assert.equal(s.delivered.at(-1), 'filters:2');
    },
  );
}
