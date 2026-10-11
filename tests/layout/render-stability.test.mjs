import assert from 'node:assert/strict';
import test from 'node:test';
import { createContext, createElement as h, memo, useContext, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';
import { recipeFixture } from '../helpers/api-fixtures.mjs';

function setup() {
  const native = (name) => (props) => h(name, props, props.children);
  const SafeAreaInsetsContext = createContext({ top: 59, bottom: 34, left: 0, right: 0 });
  const calls = { cards: 0, steppers: 0 };
  const chain = () => ({ moveTo() {}, lineTo() {}, cubicTo() {}, close() {}, build: () => ({}) });
  const shared = (value) => ({
    get: () => value,
    set: (next) => {
      value = typeof next === 'function' ? next(value) : next;
    },
  });
  const load = createSourceLoader({
    'react-native': {
      View: native('View'),
      useColorScheme: () => 'light',
      I18nManager: { isRTL: false },
    },
    'expo-router': { LocaleProvider: native('Locale'), router: { push() {} } },
    '@react-native-async-storage/async-storage': {
      getItem: async () => 'en',
      setItem: async () => {},
    },
    'react-native-safe-area-context': {
      SafeAreaInsetsContext,
      useSafeAreaInsets: () => useContext(SafeAreaInsetsContext),
    },
    '@expo/ui': {
      Host: native('Host'),
      Column: native('Column'),
      RNHostView: native('RNHostView'),
    },
    'expo-image': {
      Image: (props) => {
        calls.cards++;
        return h('Image', props);
      },
    },
    '@/hooks/use-motion-enabled': { useMotionEnabled: () => false },
    '@/components/ui/native/native-fill-width': { nativeFillWidth: [], nativeRowWeight: [] },
    '@/components/ui/page/page-header': { PageHeader: native('Header') },
    '@/components/ui/button/universal-button-content': { UniversalButtonContent: native('Button') },
    '@/components/ui/text/universal-text': { UniversalTextContent: native('Text') },
    '@/components/ui/recipe-stepper/recipe-stepper-layout': {
      RecipeStepperLayout: ({ artwork, steps }) =>
        h(
          'StepperLayout',
          null,
          artwork(320),
          ...steps.map((step) => h('Step', { key: step.id }, step.number, step.label)),
        ),
    },
    '@shopify/react-native-skia': {
      Canvas: (props) => {
        calls.steppers++;
        return h('Canvas', props, props.children);
      },
      Circle: native('Circle'),
      Group: native('Group'),
      LinearGradient: native('Gradient'),
      Path: native('Path'),
      Skia: { Path: { Circle: () => ({}) }, PathBuilder: { Make: chain } },
      vec: (x, y) => ({ x, y }),
      interpolateColors: () => '',
    },
    'react-native-reanimated': {
      useSharedValue: shared,
      useDerivedValue: (get) => ({ get }),
      cancelAnimation() {},
      Easing: { linear() {} },
      withRepeat: (value) => value,
      withSpring: (value) => value,
      withTiming: (value) => value,
    },
  });
  return { load, SafeAreaInsetsContext, calls };
}

for (const [file, provider, useSettings, change] of [
  [
    'context/theme.context.tsx',
    'ThemePreferencesProvider',
    'useThemeSettings',
    (value) => value.setColorScheme('dark'),
  ],
  [
    'context/layout-direction.context.tsx',
    'LayoutDirectionProvider',
    'useLayoutDirectionSettings',
    (value) => value.setDirection('rtl'),
  ],
]) {
  test(`${provider}: unrelated parent state does not notify unchanged context consumers`, () => {
    const s = setup();
    const module = s.load(file);
    let bump,
      settings,
      renders = 0;
    const Consumer = memo(function Consumer() {
      renders++;
      settings = module[useSettings]();
      return null;
    });
    function App() {
      const [, update] = useState(0);
      bump = () => update((value) => value + 1);
      return h(module[provider], null, h(Consumer));
    }
    const view = renderFixture(h(App));
    try {
      assert.equal(renders, 1);
      view.flush(bump);
      assert.equal(renders, 1);
      view.flush(() => change(settings));
      assert.equal(renders, 2);
    } finally {
      view.unmount();
    }
  });
}

test('language commands stay stable on parent updates while actual language changes notify consumers', async () => {
  const s = setup();
  const { LayoutDirectionProvider } = s.load('context/layout-direction.context.tsx');
  const { LanguageProvider, useLanguage } = s.load('context/language.context.tsx');
  let bump,
    language,
    renders = 0;
  const Consumer = memo(function Consumer() {
    renders++;
    language = useLanguage();
    return null;
  });
  function App() {
    const [, change] = useState(0);
    bump = () => change((value) => value + 1);
    return h(LayoutDirectionProvider, null, h(LanguageProvider, null, h(Consumer)));
  }
  const view = renderFixture(h(App));
  try {
    await new Promise((resolve) => setImmediate(resolve));
    view.flush(() => {});
    assert.equal(language.ready, true);
    const before = renders;
    const setLanguage = language.setLanguage;
    view.flush(bump);
    assert.equal(renders, before);
    assert.equal(language.setLanguage, setLanguage);
    view.flush(() => setLanguage('fr'));
    await new Promise((resolve) => setImmediate(resolve));
    view.flush(() => {});
    assert.equal(language.language, 'fr');
    assert.ok(renders > before);
  } finally {
    view.unmount();
    await s.load('lib/i18n.ts').default.changeLanguage('en');
  }
});

test('tab registration updates callbacks without broadcasting draft changes or rendering command consumers', async () => {
  const s = setup();
  const { TabActionsProvider, useTabActions, useSetTabAction, useRegisterTabAction } = s.load(
    'features/pages/tab-actions.tsx',
  );
  let changeDraft,
    setAction,
    registered,
    readRenders = 0,
    commandRenders = 0;
  const pressed = [];
  function Registrar() {
    const [draft, update] = useState('first');
    changeDraft = update;
    useRegisterTabAction('create-recipe', {
      kind: 'continue',
      label: 'Continue',
      onPress: () => pressed.push(draft),
    });
    return null;
  }
  const Commands = memo(function Commands() {
    commandRenders++;
    setAction = useSetTabAction();
    return null;
  });
  function Reader() {
    readRenders++;
    registered = useTabActions().actions;
    return null;
  }
  const view = renderFixture(h(TabActionsProvider, null, h(Registrar), h(Commands), h(Reader)));
  try {
    await new Promise((resolve) => setImmediate(resolve));
    view.flush(() => {});
    assert.ok(registered['create-recipe']);
    const before = readRenders;
    view.flush(() => changeDraft('latest'));
    assert.equal(readRenders, before);
    view.flush(() => registered['create-recipe'].onPress());
    assert.deepEqual(pressed, ['latest']);
    const other = { kind: 'filters', label: 'Filters', onPress() {} };
    view.flush(() => setAction('search', other));
    assert.equal(commandRenders, 1);
    assert.equal(readRenders, before + 1);
    view.flush(() => setAction('search', { ...other }));
    assert.equal(readRenders, before + 1);
    view.flush(() => setAction('missing', undefined));
    assert.equal(readRenders, before + 1);
  } finally {
    view.unmount();
  }
});

test('PageFrame preserves inset subscriptions across unrelated parent updates and forwards real changes', () => {
  const s = setup();
  const { PageFrame } = s.load('components/ui/page/page-frame.tsx');
  let bump,
    updateInsets,
    received,
    renders = 0;
  const Consumer = memo(function Consumer() {
    renders++;
    received = useContext(s.SafeAreaInsetsContext);
    return null;
  });
  function App() {
    const [, update] = useState(0);
    const [insets, change] = useState({ top: 59, bottom: 34, left: 0, right: 0 });
    bump = () => update((value) => value + 1);
    updateInsets = change;
    return h(
      s.SafeAreaInsetsContext.Provider,
      { value: insets },
      h(PageFrame, { title: 'Page' }, h(Consumer)),
    );
  }
  const view = renderFixture(h(App));
  try {
    assert.equal(received.top, 0);
    view.flush(bump);
    assert.equal(renders, 1);
    view.flush(() => updateInsets({ top: 59, bottom: 34, left: 44, right: 0 }));
    assert.equal(renders, 2);
    assert.equal(received.left, 44);
  } finally {
    view.unmount();
  }
});

test('auth button palette does not broadcast typing state but updates when appearance changes', () => {
  const s = setup();
  const { ThemePreferencesProvider, useThemeSettings } = s.load('context/theme.context.tsx');
  const { useAuthTheme } = s.load('components/ui/auth/auth-theme.ts');
  const { UniversalHost, useHostButtonPalette } = s.load('components/ui/host/universal-host.tsx');
  let bump,
    settings,
    palette,
    renders = 0;
  const Consumer = memo(function Consumer() {
    renders++;
    palette = useHostButtonPalette();
    return null;
  });
  function Content() {
    const [, update] = useState(0);
    bump = () => update((value) => value + 1);
    settings = useThemeSettings();
    const { buttonPalette } = useAuthTheme();
    return h(UniversalHost, { buttonPalette }, h(Consumer));
  }
  const view = renderFixture(h(ThemePreferencesProvider, null, h(Content)));
  try {
    const firstPalette = palette;
    view.flush(bump);
    assert.equal(renders, 1);
    assert.equal(palette, firstPalette);
    view.flush(() => settings.setColorScheme('dark'));
    assert.ok(renders > 1);
    assert.notEqual(palette, firstPalette);
    assert.equal(palette.onAccent, palette.onPrimary);
  } finally {
    view.unmount();
  }
});

for (const [file, exported, props, calls, updated] of [
  [
    'components/ui/recipe-card/recipe-card.tsx',
    'RecipeCard',
    { recipe: recipeFixture({ coverImageUrl: 'https://example.test/image.jpg' }) },
    'cards',
    (value) => ({ recipe: { ...value.recipe, title: 'Updated recipe' } }),
  ],
  [
    'components/ui/recipe-stepper/recipe-stepper.tsx',
    'RecipeStepper',
    { current: 0, isCurrentValid: false, animate: false },
    'steppers',
    (value) => ({ ...value, isCurrentValid: true }),
  ],
]) {
  test(`${exported}: unchanged content skips draft-parent renders while data, theme and locale changes render`, async () => {
    const s = setup();
    const Component = s.load(file)[exported];
    const { ThemePreferencesProvider, useThemeSettings } = s.load('context/theme.context.tsx');
    const i18n = s.load('lib/i18n.ts').default;
    let bump, updateProps, settings;
    function App() {
      settings = useThemeSettings();
      const [, change] = useState(0);
      const [value, update] = useState(props);
      bump = () => change((value) => value + 1);
      updateProps = update;
      return h(Component, value);
    }
    const view = renderFixture(h(ThemePreferencesProvider, null, h(App)));
    try {
      assert.equal(s.calls[calls], 1);
      view.flush(bump);
      assert.equal(s.calls[calls], 1);
      view.flush(() => updateProps(updated));
      assert.equal(s.calls[calls], 2);
      view.flush(() => settings.setColorScheme('dark'));
      assert.equal(s.calls[calls], 3);
      await i18n.changeLanguage('fr');
      await new Promise((resolve) => setImmediate(resolve));
      view.flush(() => {});
      assert.ok(s.calls[calls] > 3);
    } finally {
      view.unmount();
      await i18n.changeLanguage('en');
    }
  });
}
