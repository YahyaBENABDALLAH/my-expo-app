import assert from 'node:assert/strict';
import test from 'node:test';
import { Fragment, createContext, createElement, useContext, useEffect, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

function setup(deviceScheme = 'light') {
  const native = (type) =>
    function NativeFixture(props) {
      return createElement(type, props, props.children);
    };
  const SafeAreaInsetsContext = createContext({ top: 59, bottom: 34, left: 0, right: 0 });
  const Picker = native('Picker');
  Picker.Item = native('PickerItem');
  const mocks = {
    'react-native': {
      View: native('View'),
      KeyboardAvoidingView: native('KeyboardAvoidingView'),
      Platform: { OS: 'ios' },
      useWindowDimensions: () => ({ width: 390, height: 844 }),
      I18nManager: { isRTL: false },
      useColorScheme: () => deviceScheme,
    },
    'expo-router': {
      LocaleProvider: native('LocaleProvider'),
      router: { canGoBack: () => true, back() {}, push() {}, replace() {} },
    },
    'react-native-safe-area-context': {
      SafeAreaInsetsContext,
      useSafeAreaInsets: () => useContext(SafeAreaInsetsContext),
    },
    '@expo/ui': {
      Host: native('Host'),
      Column: native('Column'),
      Row: native('Row'),
      Spacer: native('Spacer'),
      Text: native('Text'),
      ScrollView: native('ScrollView'),
    },
    '@/components/ui/native/native-fill-width': {
      nativeFillWidth: [],
      nativeRowWeight: [],
      nativeFillWidthCenter: [],
    },
    '@/components/ui/refreshable-scroll-view/refreshable-scroll-view': {
      RefreshableScrollView: native('ScrollView'),
    },
    '@/components/ui/button/universal-button-content': { UniversalButtonContent: native('Button') },
    '@/components/ui/switch/switch': { Switch: native('Switch') },
    '@/components/ui/picker/picker': { Picker },
    '@/components/ui/page/page-back-button': { PageBackButton: native('BackButton') },
  };
  const load = createSourceLoader(mocks);
  const exports = {
    ...load('context/theme.context.tsx'),
    ...load('context/layout-direction.context.tsx'),
    ...load('hooks/use-theme.ts'),
    ...load('hooks/use-color-scheme.ts'),
    ...load('components/ui/page/page-frame.tsx'),
    ...load('components/ui/page/page-screen.tsx'),
    ...load('components/ui/auth/auth-screen-frame.tsx'),
    ...load('components/ui/loading/screen-error.tsx'),
    ...load('components/ui/appearance/theme-picker.tsx'),
    ...load('components/ui/appearance/color-scheme-control.tsx'),
    themes: load('constants/themes/index.ts').themes,
    SafeAreaInsetsContext,
  };
  mocks['@components/ui'] = {
    ...exports,
    Column: mocks['@expo/ui'].Column,
    nativeFillWidth: [],
    ...load('components/ui/text/universal-text.tsx'),
  };
  return { ...exports, SettingsScreen: load('features/settings/settings-screen.tsx').default };
}

for (const initialScheme of ['light', 'dark']) {
  test(`${initialScheme}: App Settings updates every brand without losing drafts, and preferences carry back to pages`, () => {
    const s = setup(initialScheme);
    let setDraft;
    let navigate;
    let showSettings;
    let mounts = 0;
    function Content() {
      const [draft, updateDraft] = useState('');
      setDraft = updateDraft;
      const { themeId, scheme, colors } = s.useAppTheme();
      const insets = useContext(s.SafeAreaInsetsContext);
      useEffect(() => {
        mounts++;
      }, []);
      return createElement('Draft', { draft, themeId, scheme, colors, insets });
    }
    function Pages() {
      const [page, setPage] = useState('First page');
      const [settingsOpen, setSettingsOpen] = useState(true);
      navigate = setPage;
      showSettings = setSettingsOpen;
      return createElement(
        Fragment,
        null,
        createElement(s.PageFrame, { key: page, title: page }, createElement(Content)),
        settingsOpen ? createElement(s.SettingsScreen) : null,
      );
    }
    const view = renderFixture(
      createElement(
        s.LayoutDirectionProvider,
        null,
        createElement(s.ThemePreferencesProvider, null, createElement(Pages)),
      ),
    );
    const header = view.findAll('Host')[0];
    const settingsHost = view.findAll('Host').at(-1);
    const control = (id) => view.findAll('Switch').find((node) => node.props.testID === id);
    const draft = view.findAll('Draft')[0];
    assert.equal(view.findAll('Host').length, 3);
    assert.equal(descendants(header, 'Switch').length, 0);
    assert.equal(descendants(header, 'Picker').length, 0);
    assert.equal(descendants(settingsHost, 'Switch').length, 1);
    assert.equal(view.findAll('Switch').length, 1);
    assert.equal(control('app-settings-color-scheme-switch').props.value, initialScheme === 'dark');
    const themePicker = () =>
      view.findAll('Picker').find((node) => node.props.testID === 'app-settings-theme-picker');
    assert.equal(descendants(themePicker(), 'PickerItem').length, 4);
    assert.equal(view.findAll('Picker').length, 1);
    assert.equal(
      view.findAll('View').find((node) => node.props.testID === 'page-header-safe-area').props.style
        .paddingTop,
      59,
    );
    assert.deepEqual(draft.props.insets, { top: 0, bottom: 34, left: 0, right: 0 });
    view.flush(() => setDraft('مسودة Draft 123'));
    for (const themeId of Object.keys(s.themes)) {
      view.flush(() => themePicker().props.onValueChange(themeId));
      for (const scheme of ['dark', 'light']) {
        view.flush(() =>
          control('app-settings-color-scheme-switch').props.onValueChange(scheme === 'dark'),
        );
        assert.equal(view.findAll('Host')[0], header);
        assert.equal(view.findAll('Host').at(-1), settingsHost);
        assert.equal(settingsHost.props.seedColor, s.themes[themeId].colors[scheme].tint);
        assert.equal(settingsHost.props.colorScheme, scheme);
        assert.equal(draft.props.draft, 'مسودة Draft 123');
        assert.equal(draft.props.colors, s.themes[themeId].colors[scheme]);
        assert.equal(mounts, 1);
      }
    }
    view.flush(() => showSettings(false));
    assert.equal(view.findAll('Host').length, 1);
    assert.equal(view.findAll('Picker').length, 0);
    assert.equal(view.findAll('Switch').length, 0);
    assert.equal(draft.props.draft, 'مسودة Draft 123');
    view.flush(() => navigate('Second page'));
    assert.equal(view.findAll('Draft')[0].props.themeId, 'tiktok');
    assert.equal(view.findAll('Draft')[0].props.scheme, 'light');
    view.flush(() => showSettings(true));
    assert.equal(themePicker().props.selectedValue, 'tiktok');
    assert.equal(control('app-settings-color-scheme-switch').props.value, false);
    view.unmount();
  });
}

function descendants(root, type) {
  return root.children.flatMap((child) => [
    ...(child.type === type ? [child] : []),
    ...descendants(child, type),
  ]);
}

for (const kind of ['page', 'auth', 'frame', 'error']) {
  test(`${kind}: shared page shells contain no direction, language or theme controls`, (t) => {
    const previousDev = globalThis.__DEV__;
    globalThis.__DEV__ = true;
    t.after(() => {
      if (previousDev === undefined) delete globalThis.__DEV__;
      else globalThis.__DEV__ = previousDev;
    });
    const s = setup();
    const props =
      kind === 'page'
        ? {
            title: 'Example',
            description: 'Page content',
            actions: [{ label: 'Next', href: '/ui' }],
          }
        : kind === 'error'
          ? { error: new Error('Example failure'), retry() {} }
          : { title: 'Login', description: 'Auth content', testID: 'auth-example' };
    const Screen = {
      page: s.PageScreen,
      auth: s.AuthScreenFrame,
      frame: s.PageFrame,
      error: s.ScreenError,
    }[kind];
    const view = renderFixture(
      createElement(
        s.LayoutDirectionProvider,
        null,
        createElement(
          s.ThemePreferencesProvider,
          null,
          createElement(Screen, props, createElement('Body')),
        ),
      ),
    );
    assert.equal(view.findAll('Switch').length, 0);
    assert.equal(view.findAll('Picker').length, 0);
    assert.equal(
      view.findAll('Host').some((node) => node.props.testID === 'page-appearance-footer-container'),
      false,
      'No page shell should mount the removed footer.',
    );
    const header = view.findAll('Host').find((node) => node.props.testID === 'page-header');
    if (header) assert.equal(descendants(header, 'Switch').length, 0);
    if (kind === 'page') assert.equal(view.findAll('Button').at(-1).props.label, 'Next');
    if (kind === 'error')
      assert.equal(view.findAll('Button').at(-1).props.testID, 'screen-error-retry');
    view.unmount();
  });
}

function luminance(hex) {
  const rgb = hex
    .slice(1)
    .match(/../g)
    .slice(0, 3)
    .map((value) => parseInt(value, 16) / 255);
  const linear = rgb.map((value) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  );
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

test('all four light/dark palettes cover the same roles with readable foregrounds', () => {
  const { themes } = setup();
  const roles = Object.keys(themes.whatsapp.colors.light).sort();
  const pairs = [
    ['text', 'background'],
    ['text', 'surface'],
    ['text', 'surfaceRaised'],
    ['muted', 'background'],
    ['muted', 'surface'],
    ['onPrimary', 'primary'],
    ['onSecondary', 'secondary'],
    ['onPrimaryContainer', 'primaryContainer'],
    ['onSecondaryContainer', 'secondaryContainer'],
    ['onError', 'error'],
    ['onSuccess', 'success'],
    ['onWarning', 'warning'],
    ['onInfo', 'info'],
    ['tint', 'background'],
  ];
  for (const [id, theme] of Object.entries(themes)) {
    for (const [scheme, colors] of Object.entries(theme.colors)) {
      assert.deepEqual(Object.keys(colors).sort(), roles);
      for (const value of Object.values(colors))
        assert.match(value, /^#[0-9A-F]{6}([0-9A-F]{2})?$/i);
      for (const [foreground, background] of pairs) {
        const first = luminance(colors[foreground]);
        const second = luminance(colors[background]);
        const ratio = (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
        assert.ok(ratio >= 4.5, `${id}/${scheme} ${foreground}/${background}: ${ratio.toFixed(2)}`);
      }
    }
  }
});
