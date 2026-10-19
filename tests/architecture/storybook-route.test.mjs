import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

function setup(initialParams) {
  let params = initialParams;
  let scheme = 'light';
  let update;
  const calls = [];
  const native = (name) => (props) => h(name, props, props.children);
  const mocks = {
    'react-native': { I18nManager: { isRTL: false }, View: native('View') },
    '@storybook/react-native-theming': { ThemeProvider: native('StorybookTheme') },
    'expo-router': {
      useIsFocused: () => true,
      useLocalSearchParams: () => params,
    },
    'expo-status-bar': { StatusBar: native('StatusBar') },
    'react-native-gesture-handler': { GestureHandlerRootView: native('GestureRoot') },
    'react-native-safe-area-context': {
      useSafeAreaInsets: () => ({ top: 0, bottom: 34, left: 0, right: 0 }),
    },
    '@react-native-async-storage/async-storage': {
      getItem: async () => null,
      setItem: async () => {},
    },
    '@/hooks/use-theme': {
      useAppTheme: () => ({ scheme }),
      useThemeColors: (preferredScheme = scheme) => ({
        background: preferredScheme === 'dark' ? '#000000' : '#ffffff',
      }),
    },
    './storybook.requires': {
      view: {
        getStorybookUI: (options) => {
          calls.push(options);
          return function NativeStorybook() {
            const [presses, setPresses] = useState(0);
            const story = h('Storybook', {
              ...options,
              presses,
              onPress: () => setPresses((value) => value + 1),
            });
            return options.CustomUIComponent
              ? h(
                  options.CustomUIComponent,
                  { story: { args: { colorScheme: 'dark' } }, theme: {} },
                  story,
                )
              : story;
          };
        },
      },
    },
  };
  const load = createSourceLoader(mocks);
  mocks['@storybook'] = load('../.rnstorybook/index.tsx');
  const Screen = load('features/storybook/storybook-screen.tsx').default;
  function App() {
    const [, refresh] = useState(0);
    update = (nextParams = params, nextScheme = scheme) => {
      params = nextParams;
      scheme = nextScheme;
      refresh((value) => value + 1);
    };
    return h(Screen);
  }
  const view = renderFixture(h(App));
  return { view, calls, update: (...args) => update(...args) };
}

test('a direct canvas link starts at the requested story before native URL listeners mount', () => {
  const s = setup({ mode: 'canvas', STORYBOOK_STORY_ID: 'expo-ui-universal-button--interaction' });
  try {
    const root = s.view.findAll('Storybook')[0];
    assert.equal(root.props.initialSelection, 'expo-ui-universal-button--interaction');
    assert.equal(typeof root.props.CustomUIComponent, 'function');
    assert.equal(root.props.hasStoryWrapper, false);
    assert.equal(root.props.shouldPersistSelection, false);
    const canvas = s.view.findAll('View')[0];
    // The shared preview decorator owns the themed background in both modes.
    assert.equal(canvas.props.testID, 'storybook-canvas');
    assert.equal(canvas.props.style.flex, 1);
    assert.equal(canvas.props.accessible, undefined);
  } finally {
    s.view.unmount();
  }
});

test('ordinary canvas renders retain story state while browser/canvas switches seed their target', () => {
  const s = setup({ mode: 'canvas', STORYBOOK_STORY_ID: 'expo-ui-universal-button--interaction' });
  try {
    s.view.flush(() => s.view.findAll('Storybook')[0].props.onPress());
    s.view.flush(() => s.update(undefined, 'dark'));
    assert.equal(s.calls.length, 1);
    assert.equal(s.view.findAll('Storybook')[0].props.presses, 1);

    s.view.flush(() => s.update({ STORYBOOK_STORY_ID: 'expo-ui-universal-checkbox--unchecked' }));
    let root = s.view.findAll('Storybook')[0];
    assert.equal(root.props.initialSelection, 'expo-ui-universal-checkbox--unchecked');
    assert.equal(root.props.onDeviceUI, true);
    assert.equal(root.props.CustomUIComponent, undefined);
    assert.equal(root.props.hasStoryWrapper, true);
    assert.equal(root.props.shouldPersistSelection, true);

    s.view.flush(() =>
      s.update({ mode: 'canvas', STORYBOOK_STORY_ID: 'expo-ui-universal-button--interaction' }),
    );
    root = s.view.findAll('Storybook')[0];
    assert.equal(root.props.initialSelection, 'expo-ui-universal-button--interaction');
    assert.equal(root.props.presses, 0);
    assert.equal(s.calls.length, 3);
  } finally {
    s.view.unmount();
  }
});

test('canvas entry without a valid story ID uses the deterministic Button fixture', () => {
  for (const id of [undefined, '', 'invalid', ['expo-ui-universal-button--interaction']]) {
    const s = setup({ mode: 'canvas', STORYBOOK_STORY_ID: id });
    try {
      assert.equal(
        s.view.findAll('Storybook')[0].props.initialSelection,
        'expo-ui-universal-button--primary',
      );
    } finally {
      s.view.unmount();
    }
  }
});

test('normal browser entry leaves persisted story selection to Storybook', () => {
  const s = setup({});
  try {
    const root = s.view.findAll('Storybook')[0];
    assert.equal(root.props.initialSelection, undefined);
    assert.equal(root.props.shouldPersistSelection, true);
    assert.equal(root.props.onDeviceUI, true);
  } finally {
    s.view.unmount();
  }
});
