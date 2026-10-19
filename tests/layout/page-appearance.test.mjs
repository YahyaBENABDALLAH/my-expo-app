import assert from 'node:assert/strict';
import test from 'node:test';
import {
  Fragment,
  createContext,
  createElement,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

function setup(deviceScheme = 'light', transparencyRead = Promise.resolve(false)) {
  const transparencyListeners = new Set();
  const appearanceListeners = new Set();
  const subscribeAppearance = (listener) => {
    appearanceListeners.add(listener);
    return () => appearanceListeners.delete(listener);
  };
  const getDeviceScheme = () => deviceScheme;
  const native = (type) =>
    function NativeFixture(props) {
      return createElement(type, props, props.children);
    };
  const SafeAreaInsetsContext = createContext({ top: 59, bottom: 34, left: 0, right: 0 });
  const Picker = native('Picker');
  Picker.Item = native('PickerItem');
  const FieldGroup = native('FieldGroup');
  FieldGroup.Section = native('Section');
  FieldGroup.SectionFooter = native('Footer');
  const Icon = native('Icon');
  Icon.select = ({ ios }) => ios;
  const SwiftMask = native('SwiftMask');
  SwiftMask.Content = native('SwiftMaskContent');
  const mocks = {
    'react-native': {
      View: native('View'),
      StyleSheet: { absoluteFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } },
      AccessibilityInfo: {
        isReduceTransparencyEnabled: () => transparencyRead,
        addEventListener: (_name, listener) => {
          transparencyListeners.add(listener);
          return { remove: () => transparencyListeners.delete(listener) };
        },
      },
      KeyboardAvoidingView: native('KeyboardAvoidingView'),
      Platform: { OS: 'ios' },
      useWindowDimensions: () => ({ width: 390, height: 844 }),
      I18nManager: { isRTL: false },
      useColorScheme: () => useSyncExternalStore(subscribeAppearance, getDeviceScheme),
    },
    'expo-router': {
      LocaleProvider: native('LocaleProvider'),
      router: { canGoBack: () => true, back() {}, push() {}, replace() {} },
    },
    'expo-blur': { BlurTargetView: native('BlurTarget'), BlurView: native('BlurView') },
    '@expo/ui/community/masked-view': {
      MaskedView: ({ maskElement, children, ...props }) =>
        createElement('MaskedView', props, createElement('Mask', null, maskElement), children),
    },
    '@shopify/react-native-skia': {
      Canvas: native('Canvas'),
      Group: native('Group'),
      Path: native('Path'),
    },
    '@expo/ui/swift-ui': {
      Mask: SwiftMask,
      Rectangle: native('MaterialSurface'),
      RNHostView: native('RNHostView'),
    },
    '@expo/ui/swift-ui/modifiers': {
      frame: (value) => ({ frame: value }),
      foregroundStyle: (value) => ({ foregroundStyle: value }),
      background: (value) => ({ background: value }),
      shapes: { rectangle: () => ({ shape: 'rectangle' }) },
    },
    'react-native-svg': {
      __esModule: true,
      default: native('Svg'),
      G: native('SvgGroup'),
      Path: native('SvgPath'),
    },
    'react-native-reanimated': {
      __esModule: true,
      default: { createAnimatedComponent: (component) => component },
      useAnimatedProps: (get) => ({ get }),
    },
    '@/components/ui/page/page-wave-context': {
      PageWaveContext: createContext({
        overlayHeight: 144,
        frontWave: { id: 'front' },
        backWave: { id: 'back' },
        frontSvg: 'M 0 0 H 1000 V 60 H 0 Z',
        backSvg: 'M 0 0 H 1000 V 80 H 0 Z',
        fit: { get: () => [{ scaleX: 0.39 }, { translateY: 0 }] },
        frontDrift: { get: () => [{ translateX: 0 }, { translateY: 0 }] },
        backDrift: { get: () => [{ translateX: 0 }, { translateY: 0 }] },
      }),
    },
    'react-native-safe-area-context': {
      SafeAreaInsetsContext,
      useSafeAreaInsets: () => useContext(SafeAreaInsetsContext),
    },
    '@expo/ui': {
      Host: native('Host'),
      Column: native('Column'),
      Row: native('Row'),
      Text: native('Text'),
      ScrollView: native('ScrollView'),
    },
    '@/components/ui/native/native-fill-width': {
      nativeCenteredMinHeight: () => [],
      nativeFillSize: [],
      nativeFillWidth: [],
      nativeRowWeight: [],
      nativeFillWidthCenter: [],
    },
    '@/components/ui/field-group/field-group': { FieldGroup },
    '@/components/ui/refreshable-scroll-view/refreshable-scroll-view': {
      RefreshableScrollView: native('ScrollView'),
    },
    '@/components/ui/button/universal-button-content': { UniversalButtonContent: native('Button') },
    '@/components/ui/switch/switch': { Switch: native('Switch') },
    '@/components/ui/picker/picker': { Picker },
    '@/components/ui/page/page-back-button': { PageBackButton: native('BackButton') },
    '@/context/language.context': { useLanguage: () => ({ language: 'en', ready: true }) },
    '@expo/material-symbols/open_in_new.xml': 1,
    '@expo/material-symbols/chevron_right.xml': 1,
    '@expo/material-symbols/person.xml': 1,
    '@expo/material-symbols/check.xml': 1,
  };
  const load = createSourceLoader(mocks);
  mocks['@/components/ui/page/page-wave-surface'] = load(
    'components/ui/page/page-wave-surface.ios.tsx',
  );
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
    Row: mocks['@expo/ui'].Row,
    Icon,
    FieldGroup,
    Switch: mocks['@/components/ui/switch/switch'].Switch,
    UniversalButtonContent:
      mocks['@/components/ui/button/universal-button-content'].UniversalButtonContent,
    BottomSheet: ({ isPresented, children, ...props }) =>
      createElement('Sheet', { isPresented, ...props }, isPresented ? children : null),
    nativeFillWidth: [],
    nativeFillSize: [],
    nativeRowWeight: [],
    ...load('components/ui/host/universal-host.tsx'),
    ...load('components/ui/text/universal-text.tsx'),
  };
  const settings = load('features/settings/settings-screen.tsx');
  return {
    ...exports,
    SettingsScreen: settings.default,
    SettingsPage: settings.SettingsPage,
    setReduceTransparency(value) {
      transparencyListeners.forEach((listener) => listener(value));
    },
    setDeviceScheme(value) {
      deviceScheme = value;
      appearanceListeners.forEach((listener) => listener());
    },
  };
}

for (const scheme of ['light', 'dark']) {
  test(`${scheme}: blurred pages keep draft state and scroll padding aligned when the measured header resizes`, (t) => {
    const s = setup(scheme);
    let setDraft;
    let backs = 0;
    function Draft() {
      const [value, update] = useState('Unsaved recipe');
      setDraft = update;
      return createElement('Draft', { value });
    }
    const view = renderFixture(
      createElement(
        s.PageScreen,
        {
          title: 'Saved recipes',
          description: 'Scroll content',
          colorScheme: scheme,
          onBack: () => backs++,
        },
        createElement(Draft),
      ),
    );
    t.after(() => view.unmount());
    const header = view
      .findAll('View')
      .find(({ props }) => props.testID === 'page-header-safe-area');
    const scroll = view.findAll('ScrollView')[0];
    const draft = view.findAll('Draft')[0];
    const content = () => descendants(scroll, 'Column')[0];
    view.flush(() => header.props.onLayout({ nativeEvent: { layout: { height: 115 } } }));
    assert.equal(content().props.style.paddingTop, 139);
    assert.equal(header.props.style.paddingTop, 59);
    const surface = view.findAll('MaterialSurface')[0];
    assert.deepEqual(surface.props.modifiers.find((modifier) => modifier.background).background, {
      type: 'material',
      material: 'ultraThin',
    });
    assert.equal(
      view.findAll('BlurView').length,
      0,
      'UIKit blur must not be placed inside the iOS mask.',
    );
    const maskHost = view
      .findAll('Host')
      .find(({ props }) => props.testID === 'page-wave-blur-mask');
    assert.equal(maskHost.props.pointerEvents, 'none');
    assert.equal(maskHost.props.colorScheme, scheme);
    view.flush(() => setDraft('Updated draft'));
    view.flush(() => header.props.onLayout({ nativeEvent: { layout: { height: 163 } } }));
    assert.equal(content().props.style.paddingTop, 187);
    assert.equal(view.findAll('Draft')[0], draft);
    assert.equal(draft.props.value, 'Updated draft');
    view.flush(() => view.findAll('BackButton')[0].props.onPress());
    assert.equal(backs, 1);
  });
}

test('Reduce Transparency changes replace the blur and take precedence over an older accessibility read', async (t) => {
  let finishRead;
  const s = setup(
    'light',
    new Promise((resolve) => {
      finishRead = resolve;
    }),
  );
  const view = renderFixture(
    createElement(s.PageScreen, { title: 'Recipes', description: 'Content' }),
  );
  t.after(() => view.unmount());
  const surface = () => view.findAll('MaterialSurface')[0];
  assert.equal(surface().props.testID, 'page-header-blur');
  view.flush(() => s.setReduceTransparency(true));
  assert.equal(surface().props.testID, 'page-header-solid-background');
  assert.equal(
    surface().props.modifiers.find((modifier) => modifier.background).background,
    '#FFFFFF',
  );
  finishRead(false);
  await new Promise((resolve) => setImmediate(resolve));
  view.flush(() => {});
  assert.equal(surface().props.testID, 'page-header-solid-background');
  view.flush(() => s.setReduceTransparency(false));
  assert.equal(surface().props.testID, 'page-header-blur');
});

test('the language sheet waits for readiness, selects each autonym, updates direction and dismisses without changing a selection', (t) => {
  const s = setup();
  let setReady;
  let selected;
  const changes = [];
  function Preferences() {
    const [language, setLanguage] = useState('en');
    const [ready, updateReady] = useState(false);
    const { setDirection } = s.useLayoutDirectionSettings();
    setReady = updateReady;
    selected = language;
    return createElement(s.SettingsPage, {
      language,
      languageReady: ready,
      onLanguageChange: (value) => {
        changes.push(value);
        setLanguage(value);
        setDirection(value === 'ar' ? 'rtl' : 'ltr');
      },
    });
  }
  const view = renderFixture(
    createElement(
      s.LayoutDirectionProvider,
      null,
      createElement(s.ThemePreferencesProvider, null, createElement(Preferences)),
    ),
  );
  t.after(() => view.unmount());
  const row = (id) => view.findAll('Button').find(({ props }) => props.testID === id).props;
  const sheet = () => view.findAll('Sheet')[0].props;
  const press = (id) => view.flush(() => row(id).onPress());
  assert.equal(row('app-settings-language').disabled, true);
  press('app-settings-language');
  assert.equal(sheet().isPresented, false);
  view.flush(() => setReady(true));
  for (const language of ['fr', 'ar', 'en']) {
    press('app-settings-language');
    assert.equal(sheet().isPresented, true);
    assert.deepEqual(
      ['fr', 'en', 'ar'].map((value) => {
        const node = view
          .findAll('Button')
          .find(({ props }) => props.testID === `app-settings-language-${value}`);
        return descendants(node, 'Text')[0].props.children;
      }),
      ['Français', 'English', 'العربية'],
    );
    press(`app-settings-language-${language}`);
    assert.equal(selected, language);
    assert.equal(sheet().isPresented, false);
    assert.equal(
      view.findAll('LocaleProvider')[0].props.direction,
      language === 'ar' ? 'rtl' : 'ltr',
    );
  }
  press('app-settings-language');
  view.flush(() => sheet().onDismiss());
  assert.equal(sheet().isPresented, false);
  assert.equal(selected, 'en');
  assert.deepEqual(changes, ['fr', 'ar', 'en']);
});

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
    const settingsHost = view
      .findAll('Host')
      .find(({ props }) => props.testID === 'app-settings-content');
    const presentationHost = view
      .findAll('Host')
      .find(({ props }) => props.testID === 'app-settings-language-presentation');
    const control = (id) => view.findAll('Switch').find((node) => node.props.testID === id);
    const draft = view.findAll('Draft')[0];
    assert.equal(view.findAll('Host').length, 4);
    assert.equal(descendants(settingsHost, 'Sheet').length, 0);
    assert.equal(descendants(presentationHost, 'FieldGroup').length, 0);
    assert.equal(presentationHost.props.pointerEvents, 'box-none');
    assert.equal(descendants(header, 'Switch').length, 0);
    assert.equal(descendants(header, 'Picker').length, 0);
    assert.equal(descendants(settingsHost, 'Switch').length, 3);
    assert.equal(view.findAll('Switch').length, 3);
    for (const placeholder of ['chat', 'invitations', 'authentication']) {
      assert.equal(control(`app-settings-${placeholder}`).props.disabled, true);
    }
    const schemePicker = () =>
      view
        .findAll('Picker')
        .find((node) => node.props.testID === 'app-settings-color-scheme-picker');
    assert.equal(schemePicker().props.selectedValue, 'system');
    assert.equal(settingsHost.props.colorScheme, initialScheme);
    assert.deepEqual(
      descendants(schemePicker(), 'PickerItem').map(({ props: { label, value } }) => ({
        label,
        value,
      })),
      [
        { label: 'System', value: 'system' },
        { label: 'Light Mode', value: 'light' },
        { label: 'Dark Mode', value: 'dark' },
      ],
    );
    const themePicker = () =>
      view.findAll('Picker').find((node) => node.props.testID === 'app-settings-theme-picker');
    assert.deepEqual(
      descendants(themePicker(), 'PickerItem').map(({ props: { label, value } }) => ({
        label,
        value,
      })),
      Object.entries(s.themes).map(([value, { label }]) => ({ label, value })),
    );
    assert.equal(view.findAll('Picker').length, 2);
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
        view.flush(() => schemePicker().props.onValueChange(scheme));
        assert.equal(view.findAll('Host')[0], header);
        assert.equal(
          view.findAll('Host').find(({ props }) => props.testID === 'app-settings-content'),
          settingsHost,
        );
        assert.equal(settingsHost.props.seedColor, s.themes[themeId].colors[scheme].tint);
        assert.equal(settingsHost.props.colorScheme, scheme);
        assert.equal(presentationHost.props.seedColor, settingsHost.props.seedColor);
        assert.equal(presentationHost.props.colorScheme, scheme);
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
    assert.equal(view.findAll('Draft')[0].props.themeId, 'ux');
    assert.equal(view.findAll('Draft')[0].props.scheme, 'light');
    view.flush(() => showSettings(true));
    assert.equal(themePicker().props.selectedValue, 'ux');
    assert.equal(schemePicker().props.selectedValue, 'light');
    view.unmount();
  });
}

test('System follows live device changes; manual modes stay fixed and returning to System resumes detection', (t) => {
  const s = setup('light');
  function Content() {
    const [draft, setDraft] = useState('Unsaved recipe');
    const { themeId, scheme, colors } = s.useAppTheme();
    const override = s.useAppTheme('dark');
    return createElement('Draft', { draft, setDraft, themeId, scheme, colors, override });
  }
  const view = renderFixture(
    createElement(
      s.LayoutDirectionProvider,
      null,
      createElement(
        s.ThemePreferencesProvider,
        null,
        createElement(s.SettingsScreen),
        createElement(Content),
      ),
    ),
  );
  t.after(() => view.unmount());
  const picker = view
    .findAll('Picker')
    .find(({ props }) => props.testID === 'app-settings-color-scheme-picker');
  const draft = view.findAll('Draft')[0];
  const host = view.findAll('Host').find(({ props }) => props.testID === 'app-settings-content');
  const expectScheme = (scheme, preference) => {
    assert.equal(picker.props.selectedValue, preference);
    assert.equal(host.props.colorScheme, scheme);
    assert.equal(draft.props.scheme, scheme);
    assert.equal(draft.props.colors, s.themes.whatsapp.colors[scheme]);
    assert.equal(draft.props.override.scheme, 'dark', 'Explicit component overrides stay fixed.');
    assert.equal(view.findAll('Draft')[0], draft);
    assert.equal(draft.props.draft, 'Unsaved recipe');
  };
  expectScheme('light', 'system');
  view.flush(() => s.setDeviceScheme('dark'));
  expectScheme('dark', 'system');
  view.flush(() => s.setDeviceScheme('light'));
  expectScheme('light', 'system');
  for (const manual of ['dark', 'light']) {
    view.flush(() => picker.props.onValueChange(manual));
    for (const device of ['dark', 'light']) {
      view.flush(() => s.setDeviceScheme(device));
      expectScheme(manual, manual);
    }
    view.flush(() => picker.props.onValueChange('system'));
    expectScheme('light', 'system');
    view.flush(() => s.setDeviceScheme('dark'));
    expectScheme('dark', 'system');
  }
  view.flush(() => s.setDeviceScheme(null));
  expectScheme('light', 'system');
});

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

test('all light/dark palettes cover the same roles with readable foregrounds', () => {
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

test('UX Template keeps black primary actions and neutral foundations with distinct status colors', () => {
  const { themes } = setup();
  assert.equal(themes.ux.label, 'UX Template');
  const statusRoles = ['error', 'success', 'warning'];
  const coloredRoles = new Set(statusRoles.flatMap((role) => [role, `${role}Container`]));
  for (const [scheme, colors] of Object.entries(themes.ux.colors)) {
    assert.equal(colors.primary, '#000000', `${scheme}: primary stays black`);
    assert.equal(colors.onPrimary, '#FFFFFF', `${scheme}: primary labels stay white`);
    for (const [role, color] of Object.entries(colors)) {
      if (coloredRoles.has(role)) continue;
      const [, red, green, blue] = color.match(/^#(..)(..)(..)(?:..)?$/);
      assert.equal(red, green, `${scheme}/${role} must have equal RGB channels`);
      assert.equal(green, blue, `${scheme}/${role} must have equal RGB channels`);
    }
    const rgb = (role) =>
      colors[role]
        .slice(1)
        .match(/../g)
        .map((value) => parseInt(value, 16));
    const [errorRed, errorGreen, errorBlue] = rgb('error');
    assert.ok(errorRed > errorGreen && errorRed > errorBlue, `${scheme}: danger is red`);
    const [successRed, successGreen, successBlue] = rgb('success');
    assert.ok(
      successGreen > successRed && successGreen > successBlue,
      `${scheme}: success is green`,
    );
    const [warningRed, warningGreen, warningBlue] = rgb('warning');
    assert.ok(
      warningRed > warningGreen && warningGreen > warningBlue,
      `${scheme}: warning is amber`,
    );
    for (const role of statusRoles) {
      for (const background of ['background', 'surface', `${role}Container`]) {
        const first = luminance(colors[role]);
        const second = luminance(colors[background]);
        const ratio = (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
        assert.ok(ratio >= 4.5, `${scheme} ${role}/${background}: ${ratio.toFixed(2)}`);
      }
    }
  }
});
