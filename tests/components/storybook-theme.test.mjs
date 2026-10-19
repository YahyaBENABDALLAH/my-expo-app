import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h, Fragment, useState, useSyncExternalStore } from 'react';
import { defaultDecorateStory } from 'storybook/preview-api';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

function setup() {
  const appearance = [];
  let deviceScheme = 'light';
  let focused = true;
  const listeners = new Set();
  const load = createSourceLoader({
    'expo-router': {
      useIsFocused: () =>
        useSyncExternalStore(
          (listener) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
          },
          () => focused,
        ),
    },
    'react-native': {
      View: (props) => h('View', props, props.children),
      I18nManager: { isRTL: false },
      useColorScheme: () =>
        useSyncExternalStore(
          (listener) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
          },
          () => deviceScheme,
        ),
      Appearance: { setColorScheme: (scheme) => appearance.push(scheme) },
    },
    '@react-native-async-storage/async-storage': {
      getItem: async () => null,
      setItem: async () => {},
    },
  });
  const preview = load('../.rnstorybook/preview.tsx').default;
  const { themes } = load('constants/themes/index.ts');
  const { ThemePreferencesProvider, useThemeSettings } = load('context/theme.context.tsx');
  const { useAppTheme } = load('hooks/use-theme.ts');
  function Probe({ args }) {
    const [draft, setDraft] = useState('');
    return h('Story', { ...useAppTheme(), ...useThemeSettings(), draft, setDraft, args });
  }
  const decorated = defaultDecorateStory(
    (context) => h(Probe, { args: context.args }),
    preview.decorators,
  );
  let updateContext;
  function Harness({ initial }) {
    const [context, setContext] = useState(initial);
    updateContext = setContext;
    return decorated(context);
  }
  function AppPreferences() {
    return h('App', useThemeSettings());
  }
  const render = (args = {}, id = 'example--default') =>
    renderFixture(
      h(
        ThemePreferencesProvider,
        { initialTheme: 'tiktok', initialColorScheme: 'dark' },
        h(
          Fragment,
          null,
          h(AppPreferences),
          h(Harness, { initial: { id, args: { ...preview.args, ...args } } }),
        ),
      ),
    );
  return {
    themes,
    appearance,
    render,
    updateContext: (args, id = 'example--default') =>
      updateContext({ id, args: { ...preview.args, ...args } }),
    setDeviceScheme(scheme) {
      deviceScheme = scheme;
      listeners.forEach((listener) => listener());
    },
    setFocused(value) {
      focused = value;
      listeners.forEach((listener) => listener());
    },
  };
}

test('shared decorators apply every brand and appearance without passing themeId to controls', () => {
  const s = setup();
  for (const themeId of Object.keys(s.themes)) {
    for (const colorScheme of ['light', 'dark']) {
      const view = s.render({ themeId, colorScheme, label: 'Example' });
      try {
        const story = view.findAll('Story')[0].props;
        assert.equal(story.colors, s.themes[themeId].colors[colorScheme]);
        assert.equal(story.scheme, colorScheme);
        assert.deepEqual(story.args, { colorScheme, label: 'Example' });
        assert.equal(view.findAll('View')[0].props.style.backgroundColor, story.colors.background);
        assert.equal(s.appearance.at(-1), colorScheme);
      } finally {
        view.unmount();
      }
      assert.equal(s.appearance.at(-1), 'dark', 'leaving a story restores app appearance');
    }
  }
});

test('local preference changes retain drafts and leave app preferences isolated; Controls and story changes reset the fixture', () => {
  const s = setup();
  const view = s.render({ themeId: 'ux', colorScheme: 'light' });
  const story = () => view.findAll('Story')[0].props;
  try {
    view.flush(() => {
      story().setDraft('Keep this draft');
      story().setThemeId('instagram');
      story().setColorScheme('dark');
    });
    assert.equal(story().draft, 'Keep this draft');
    assert.equal(story().colors, s.themes.instagram.colors.dark);
    assert.equal(s.appearance.at(-1), 'dark');
    assert.equal(view.findAll('App')[0].props.themeId, 'tiktok');
    assert.equal(view.findAll('App')[0].props.colorScheme, 'dark');
    view.flush(() => s.updateContext({ themeId: 'facebook', colorScheme: 'light' }));
    assert.equal(story().colors, s.themes.facebook.colors.light);
    assert.equal(story().draft, '');
    view.flush(() => story().setThemeId('ux'));
    view.flush(() =>
      s.updateContext({ themeId: 'facebook', colorScheme: 'light' }, 'example--next'),
    );
    assert.equal(story().colors, s.themes.facebook.colors.light);
  } finally {
    view.unmount();
  }
});

test('System follows live device appearance and releases the native override', () => {
  const s = setup();
  const view = s.render({ themeId: 'ux', colorScheme: 'system' });
  try {
    assert.equal(view.findAll('Story')[0].props.scheme, 'light');
    assert.equal(s.appearance.at(-1), 'unspecified');
    view.flush(() => s.setDeviceScheme('dark'));
    assert.equal(view.findAll('Story')[0].props.colors, s.themes.ux.colors.dark);
    view.flush(() => view.findAll('Story')[0].props.setColorScheme('light'));
    assert.equal(view.findAll('Story')[0].props.scheme, 'light');
    view.flush(() => view.findAll('Story')[0].props.setColorScheme('system'));
    assert.equal(view.findAll('Story')[0].props.scheme, 'dark');
    assert.equal(s.appearance.at(-1), 'unspecified');
  } finally {
    view.unmount();
  }
  assert.equal(s.appearance.at(-1), 'dark');
});

test('leaving the Storybook tab restores app appearance while retaining story state', () => {
  const s = setup();
  const view = s.render({ themeId: 'ux', colorScheme: 'light' });
  const story = () => view.findAll('Story')[0].props;
  try {
    view.flush(() => story().setDraft('Retained while hidden'));
    view.flush(() => s.setFocused(false));
    assert.equal(s.appearance.at(-1), 'dark');
    const callsWhileHidden = s.appearance.length;
    view.flush(() => story().setColorScheme('dark'));
    view.flush(() => story().setColorScheme('light'));
    assert.equal(s.appearance.length, callsWhileHidden);
    view.flush(() => s.setFocused(true));
    assert.equal(s.appearance.at(-1), 'light');
    assert.equal(story().draft, 'Retained while hidden');
  } finally {
    view.unmount();
  }
  assert.equal(s.appearance.at(-1), 'dark');
});
