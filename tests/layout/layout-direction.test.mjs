import assert from 'node:assert/strict';
import test from 'node:test';
import { createContext, createElement, useContext, useEffect, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

function setup(isRTL = false, platform = 'android') {
  const SafeAreaInsetsContext = createContext({ top: 0, bottom: 0, left: 0, right: 0 });
  const useSafeAreaInsets = () => useContext(SafeAreaInsetsContext);
  const native = (type) =>
    function NativeFixture(props) {
      return createElement(type, props, props.children);
    };
  const mocks = {
    'react-native': {
      Platform: { OS: platform },
      I18nManager: {
        isRTL,
        forceRTL: () => assert.fail('Switching direction must not mutate global RTL.'),
        allowRTL: () => assert.fail('Switching direction must not mutate global RTL.'),
      },
      View: native('View'),
    },
    'expo-router': { LocaleProvider: native('LocaleProvider') },
    'react-native-safe-area-context': { SafeAreaInsetsContext, useSafeAreaInsets },
    '@expo/ui': {
      Host: native('Host'),
      BottomSheet: native('BottomSheet'),
      RNHostView: native('RNHostView'),
      Column: native('Column'),
      Row: native('Row'),
      Spacer: native('Spacer'),
      Text: native('Text'),
    },
    '@/hooks/use-color-scheme': { useColorScheme: (scheme) => scheme ?? 'light' },
    '@/components/ui/switch/switch': { Switch: native('Switch') },
    '@/components/ui/native/native-fill-width': { nativeFillWidth: [], nativeRowWeight: [] },
    '@/components/ui/floating-action/floating-action': { FloatingAction: native('FloatingAction') },
    '@/components/ui/navigation/navigation-glass-surface': {
      NavigationGlassSurface: native('GlassSurface'),
    },
    '@/components/ui/navigation/navigation-tab': { NavigationTab: native('NavigationTab') },
    '@expo/ui/jetpack-compose': { Icon: native('Icon'), IconButton: native('IconButton') },
    '@expo/ui/swift-ui/modifiers': {
      frame: (config) => ({ frame: config }),
      onGeometryChange: (handler) => ({ onGeometryChange: handler }),
    },
    '@expo/ui/jetpack-compose/modifiers': {
      semantics: (props) => ({ semantics: props }),
      size: (width, height) => ({ width, height }),
      testID: (id) => ({ id }),
    },
    '@expo/material-symbols/arrow_back.xml': 'arrow_back',
    '@expo/material-symbols/arrow_forward.xml': 'arrow_forward',
  };
  const load = createSourceLoader(mocks);
  const direction = load('context/layout-direction.context.tsx');
  const host = load('components/ui/host/universal-host.tsx');
  const control = load('components/ui/appearance/layout-direction-control.tsx');
  mocks['@components/ui'] = {
    Column: mocks['@expo/ui'].Column,
    ...host,
    ...control,
    nativeFillWidth: [],
  };
  return {
    load,
    mocks,
    native,
    SafeAreaInsetsContext,
    useSafeAreaInsets,
    ...direction,
    ...host,
    ...load('components/ui/bottom-sheet/bottom-sheet.tsx'),
    ...control,
    ...load('../.rnstorybook/components/layout-direction-frame.tsx'),
    colors: load('constants/colors.ts').default,
  };
}

for (const scheme of ['light', 'dark']) {
  test(`${scheme}: flipping LTR/RTL updates navigation, native Hosts and an open sheet without remounting`, () => {
    const s = setup();
    let settings;
    let changeDraft;
    let mounts = 0;
    let unmounts = 0;
    function Screen() {
      settings = s.useLayoutDirectionSettings();
      const [draft, setDraft] = useState('');
      changeDraft = setDraft;
      useEffect(() => {
        mounts += 1;
        return () => {
          unmounts += 1;
        };
      }, []);
      return createElement(
        s.UniversalHost,
        { colorScheme: scheme },
        createElement(s.LayoutDirectionControl),
        createElement('Field', { draft }),
        createElement(
          s.BottomSheet,
          { isPresented: true, onDismiss() {} },
          createElement('SheetDraft', { draft }),
        ),
      );
    }
    const view = renderFixture(
      createElement(s.LayoutDirectionProvider, null, createElement(Screen)),
    );
    const screenHost = view.findAll('Host')[0];
    const sheetHost = view.findAll('Host')[1];
    const field = view.findAll('Field')[0];
    const sheet = view.findAll('BottomSheet')[0];
    view.flush(() => changeDraft('مسودة Draft 123'));
    for (const direction of ['rtl', 'ltr', 'rtl']) {
      view.flush(() => view.findAll('Switch')[0].props.onValueChange(direction === 'rtl'));
      assert.equal(settings.direction, direction);
      assert.equal(view.findAll('LocaleProvider')[0].props.direction, direction);
      assert.equal(view.findAll('View')[0].props.style.direction, direction);
      assert.equal(view.findAll('Host')[0], screenHost);
      assert.equal(view.findAll('Host')[1], sheetHost);
      for (const host of view.findAll('Host')) {
        assert.equal(
          host.props.layoutDirection,
          direction === 'rtl' ? 'rightToLeft' : 'leftToRight',
        );
        assert.equal(host.props.colorScheme, scheme);
      }
      assert.equal(view.findAll('Field')[0], field);
      assert.equal(field.props.draft, 'مسودة Draft 123');
      assert.equal(view.findAll('SheetDraft')[0].props.draft, 'مسودة Draft 123');
      assert.equal(view.findAll('BottomSheet')[0], sheet);
      assert.equal(sheet.props.isPresented, true);
      assert.equal(sheet.props.containerColor, s.colors[scheme].surface);
      assert.equal(sheet.props.contentColor, s.colors[scheme].text);
      assert.equal(sheet.props.contentPadding, 24);
      assert.equal(mounts, 1);
      assert.equal(unmounts, 0);
    }
    view.unmount();
    assert.equal(unmounts, 1);
  });
}

for (const isRTL of [false, true]) {
  test(`initial direction follows an ${isRTL ? 'RTL' : 'LTR'} device without global writes`, () => {
    const s = setup(isRTL);
    const view = renderFixture(
      createElement(s.LayoutDirectionProvider, null, createElement(s.UniversalHost)),
    );
    assert.equal(view.findAll('LocaleProvider')[0].props.direction, isRTL ? 'rtl' : 'ltr');
    assert.equal(
      view.findAll('Host')[0].props.layoutDirection,
      isRTL ? 'rightToLeft' : 'leftToRight',
    );
    view.unmount();
  });
}

test('explicit native Host direction overrides app direction and is inherited through nested Hosts', () => {
  const s = setup();
  let settings;
  function Screen() {
    settings = s.useLayoutDirectionSettings();
    return createElement(
      s.UniversalHost,
      { layoutDirection: 'rightToLeft' },
      createElement(
        s.UniversalHost,
        null,
        createElement(s.UniversalHost, { layoutDirection: 'leftToRight' }),
      ),
    );
  }
  const view = renderFixture(createElement(s.LayoutDirectionProvider, null, createElement(Screen)));
  view.flush(() => settings.setDirection('rtl'));
  view.flush(() => settings.setDirection('ltr'));
  assert.deepEqual(
    view.findAll('Host').map(({ props }) => props.layoutDirection),
    ['rightToLeft', 'rightToLeft', 'leftToRight'],
  );
  view.unmount();
});

test('direction switch starts checked on an RTL device and switches off to LTR', () => {
  const s = setup(true);
  const view = renderFixture(
    createElement(s.LayoutDirectionProvider, null, createElement(s.LayoutDirectionControl)),
  );
  const control = view.findAll('Switch')[0];
  assert.equal(control.props.label, 'RTL layout');
  assert.equal(control.props.value, true);
  view.flush(() => control.props.onValueChange(false));
  assert.equal(control.props.value, false);
  assert.equal(view.findAll('LocaleProvider')[0].props.direction, 'ltr');
  view.unmount();
});

test('sheet bridge preserves explicit chrome colors and dismissal callback', () => {
  const s = setup();
  let dismissed = 0;
  const contentPadding = { top: 8, bottom: 32, left: 20, right: 12 };
  const snapPoints = ['half', 'full'];
  const view = renderFixture(
    createElement(
      s.LayoutDirectionProvider,
      null,
      createElement(
        s.BottomSheet,
        {
          isPresented: true,
          containerColor: '#123456',
          contentColor: '#abcdef',
          contentPadding,
          snapPoints,
          onDismiss: () => dismissed++,
        },
        createElement('SheetContent'),
      ),
    ),
  );
  const { props } = view.findAll('BottomSheet')[0];
  assert.equal(props.containerColor, '#123456');
  assert.equal(props.contentColor, '#abcdef');
  assert.equal(props.contentPadding, contentPadding);
  assert.equal(props.snapPoints, snapPoints);
  props.onDismiss();
  assert.equal(dismissed, 1);
  view.unmount();
});

test('iOS sheet resizes its content to the presented width without losing local state', () => {
  const s = setup(false, 'ios');
  let changeDraft;
  function Draft() {
    const [draft, setDraft] = useState('');
    changeDraft = setDraft;
    return createElement('SheetDraft', { draft });
  }
  const view = renderFixture(
    createElement(
      s.UniversalHost,
      { colorScheme: 'dark', layoutDirection: 'rightToLeft' },
      createElement(s.BottomSheet, { isPresented: true, onDismiss() {} }, createElement(Draft)),
    ),
  );
  try {
    const sheet = view.findAll('BottomSheet')[0];
    const host = view.findAll('Host')[1];
    const draft = view.findAll('SheetDraft')[0];
    const geometry = view.findAll('Column')[0].props.modifiers.find((mod) => mod.onGeometryChange);
    view.flush(() => changeDraft('مسودة Draft 123'));
    for (const width of [342, 492, 300]) {
      view.flush(() => geometry.onGeometryChange({ x: 0, y: 0, width, height: 280 }));
      assert.equal(view.findAll('Host')[1], host);
      assert.equal(host.props.style.at(-1).width, width);
      assert.deepEqual(host.props.matchContents, { vertical: true });
      assert.equal(host.props.layoutDirection, 'rightToLeft');
      assert.equal(host.props.colorScheme, 'dark');
      assert.equal(view.findAll('BottomSheet')[0], sheet);
      assert.equal(view.findAll('SheetDraft')[0], draft);
      assert.equal(draft.props.draft, 'مسودة Draft 123');
    }
    for (const width of [0, -1, NaN, Infinity]) {
      view.flush(() => geometry.onGeometryChange({ x: 0, y: 0, width, height: 280 }));
      assert.equal(host.props.style.at(-1).width, 300);
    }
  } finally {
    view.unmount();
  }
});

for (const snapPoints of [undefined, [], ['half', 'full']]) {
  test(`iOS sheet ${snapPoints?.length ? 'anchors explicit detents to the top' : 'keeps auto-sized height'}`, () => {
    const s = setup(false, 'ios');
    const view = renderFixture(
      createElement(
        s.BottomSheet,
        { isPresented: true, snapPoints, contentPadding: 0, onDismiss() {} },
        createElement('SheetContent'),
      ),
    );
    const { frame } = view.findAll('Column')[0].props.modifiers[0];
    assert.equal(frame.alignment, 'topLeading');
    assert.equal(frame.maxWidth, Infinity);
    assert.equal(frame.maxHeight, snapPoints?.length ? Infinity : undefined);
    assert.equal(view.findAll('BottomSheet')[0].props.contentPadding, 0);
    view.unmount();
  });
}

test('Android page back arrow flips live and retains the same press target', () => {
  const s = setup();
  const { PageBackButton } = s.load('components/ui/page/page-back-button.android.tsx');
  let settings;
  let presses = 0;
  function Screen() {
    settings = s.useLayoutDirectionSettings();
    return createElement(
      s.UniversalHost,
      null,
      createElement(PageBackButton, { color: '#123456', onPress: () => presses++ }),
    );
  }
  const view = renderFixture(createElement(s.LayoutDirectionProvider, null, createElement(Screen)));
  const button = view.findAll('IconButton')[0];
  assert.equal(view.findAll('Icon')[0].props.source, 'arrow_back');
  view.flush(() => settings.setDirection('rtl'));
  assert.equal(view.findAll('Icon')[0].props.source, 'arrow_forward');
  assert.equal(view.findAll('IconButton')[0], button);
  assert.equal(view.findAll('Icon')[0].props.tint, '#123456');
  button.props.onClick();
  assert.equal(presses, 1);
  view.flush(() => settings.setDirection('ltr'));
  assert.equal(view.findAll('Icon')[0].props.source, 'arrow_back');
  view.unmount();
});

test('tab bar follows live direction, keeps the action centered and preserves physical insets', () => {
  const s = setup();
  const { ReferenceNavigationBar } = s.load(
    'components/ui/navigation/reference-navigation-bar.tsx',
  );
  let settings;
  function Screen() {
    settings = s.useLayoutDirectionSettings();
    return createElement(ReferenceNavigationBar, {
      colorScheme: 'dark',
      selected: 'index',
      action: { kind: 'create', label: 'Create', onPress() {} },
      onSelect() {},
      leftInset: 44,
      rightInset: 0,
    });
  }
  const view = renderFixture(createElement(s.LayoutDirectionProvider, null, createElement(Screen)));
  for (const direction of ['rtl', 'ltr']) {
    view.flush(() => settings.setDirection(direction));
    const bar = view.findAll('View').find(({ props }) => props.testID === 'main-tab-bar');
    assert.equal(bar.props.style.direction, direction);
    const controls = view.findAll('View').find(({ props }) => props.testID === 'tab-dock-controls');
    assert.equal(controls.props.style.left, 44);
    assert.equal(controls.props.style.right, 0);
    const overlay = view.findAll('View').find(({ props }) => props.testID === 'tab-action-overlay');
    assert.equal(overlay.props.style.left, controls.props.style.left);
    assert.equal(overlay.props.style.right, controls.props.style.right);
    const action = view.findAll('View').find(({ props }) => props.style?.start === '50%');
    assert.equal(action.props.style.marginStart, -action.props.style.width / 2);
    assert.equal(
      view.findAll('Host')[0].props.layoutDirection,
      direction === 'rtl' ? 'rightToLeft' : 'leftToRight',
    );
    assert.deepEqual(
      view.findAll('NavigationTab').map(({ props }) => props.name),
      ['index', 'search', 'recipes', 'more'],
    );
  }
  view.unmount();
});

for (const scheme of ['light', 'dark']) {
  test(`${scheme}: page toolbar stays mounted, preserves drafts and consumes only the top safe area`, () => {
    const s = setup();
    let setInsets;
    let setDraft;
    function Page() {
      const insets = s.useSafeAreaInsets();
      const direction = s.useLayoutDirection();
      const [draft, updateDraft] = useState('');
      setDraft = updateDraft;
      return createElement('PageDraft', { draft, direction, insets });
    }
    function App() {
      const [insets, updateInsets] = useState({ top: 59, bottom: 34, left: 0, right: 0 });
      setInsets = updateInsets;
      return createElement(
        s.SafeAreaInsetsContext.Provider,
        { value: insets },
        createElement(
          s.LayoutDirectionProvider,
          null,
          createElement(s.LayoutDirectionFrame, { colorScheme: scheme }, createElement(Page)),
        ),
      );
    }
    const view = renderFixture(createElement(App));
    const toolbar = view
      .findAll('View')
      .find(({ props }) => props.testID === 'page-layout-direction-toolbar');
    const control = view.findAll('Switch')[0];
    const page = view.findAll('PageDraft')[0];
    assert.equal(toolbar.props.style.paddingTop, 59);
    assert.deepEqual(page.props.insets, { top: 0, bottom: 34, left: 0, right: 0 });
    assert.equal(view.findAll('Host')[0].props.colorScheme, scheme);
    assert.equal(view.findAll('Column')[0].props.style.backgroundColor, s.colors[scheme].surface);
    assert.equal(control.props.testID, 'page-layout-direction-switch');
    assert.equal(control.props.value, false);
    view.flush(() => setDraft('Draft 123'));
    for (const direction of ['rtl', 'ltr']) {
      view.flush(() => control.props.onValueChange(direction === 'rtl'));
      assert.equal(view.findAll('Switch')[0], control);
      assert.equal(view.findAll('PageDraft')[0], page);
      assert.equal(page.props.direction, direction);
      assert.equal(control.props.value, direction === 'rtl');
      assert.equal(page.props.draft, 'Draft 123');
    }
    view.flush(() => setInsets({ top: 0, bottom: 21, left: 44, right: 0 }));
    assert.equal(toolbar.props.style.paddingTop, 0);
    assert.equal(toolbar.props.style.paddingLeft, 44);
    assert.equal(toolbar.props.style.paddingRight, 0);
    assert.deepEqual(page.props.insets, { top: 0, bottom: 21, left: 44, right: 0 });
    assert.equal(page.props.draft, 'Draft 123');
    view.unmount();
  });
}

test('compact switches keep distinct prefixes for global, story and sheet controls', () => {
  const s = setup();
  const view = renderFixture(
    createElement(
      s.LayoutDirectionProvider,
      null,
      createElement(s.LayoutDirectionControl, {
        compact: true,
        testIDPrefix: 'sheet-layout-direction',
      }),
    ),
  );
  assert.equal(view.findAll('Column').length, 0);
  assert.equal(view.findAll('Switch')[0].props.testID, 'sheet-layout-direction-switch');
  view.unmount();
});

for (const authenticated of [false, true]) {
  test(`${authenticated ? 'signed-in' : 'signed-out'} root exits when resources are ready and retains navigation/providers when direction flips`, (t) => {
    t.mock.timers.enable({ apis: ['setTimeout'] });
    const s = setup();
    let directionSettings;
    let finishRestore;
    let finishLanguage;
    const RestorationContext = createContext(true);
    const LanguageContext = createContext({ ready: false });
    const NativeAuthProvider = s.native('AuthProvider');
    const NativeStack = s.native('Stack');
    function Stack(props) {
      directionSettings = s.useLayoutDirectionSettings();
      return createElement(NativeStack, props);
    }
    Stack.Protected = function ProtectedFixture({ guard, children }) {
      return guard ? children : null;
    };
    Stack.Screen = s.native('Screen');
    Object.assign(s.mocks['expo-router'], {
      Stack,
      ThemeProvider: s.native('ThemeProvider'),
      DarkTheme: { colors: {} },
      DefaultTheme: { colors: {} },
    });
    s.mocks['@components/ui'] = {
      UniversalHost: s.UniversalHost,
      useAuthTheme: () => ({ buttonPalette: {} }),
      LaunchScreen: s.native('LaunchScreen'),
      AuroraBackground: s.native('AuroraBackground'),
      PageMotionOverlay: s.native('PageMotionOverlay'),
      ToastHost: s.native('ToastHost'),
      PageFrame: s.native('RestorationPanel'),
      Column: s.native('Column'),
      LoadingContent: s.native('LoadingContent'),
      Spacer: s.native('Spacer'),
    };
    s.mocks['expo-font'] = { useFonts: () => [true, null] };
    s.mocks['expo-splash-screen'] = {
      preventAutoHideAsync: async () => {},
      setOptions() {},
      hide() {},
    };
    s.mocks['expo-status-bar'] = { StatusBar: s.native('StatusBar') };
    s.mocks['react-native-reanimated'] = { useReducedMotion: () => false };
    s.mocks['@assets/fonts/Inter-Black.otf'] = 1;
    s.mocks['@assets/fonts/UnifrakturCook-Bold.ttf'] = 2;
    s.mocks['@/context/query-provider'] = { AppQueryProvider: s.native('AppQueryProvider') };
    s.mocks['@/context/auth.context'] = {
      AuthProvider({ children }) {
        const [restoring, setRestoring] = useState(true);
        finishRestore = () => setRestoring(false);
        return createElement(
          RestorationContext.Provider,
          { value: restoring },
          createElement(NativeAuthProvider, null, children),
        );
      },
      useAuthContext: () => ({ error: null }),
    };
    s.mocks['@/context/language.context'] = {
      LanguageProvider({ children }) {
        const [ready, setReady] = useState(false);
        finishLanguage = () => setReady(true);
        return createElement(LanguageContext.Provider, { value: { ready } }, children);
      },
      useLanguage: () => useContext(LanguageContext),
    };
    s.mocks['@/guards/auth-guards'] = {
      useAuthGuards: () => ({
        requireNoAuth: !authenticated,
        requireAuth: authenticated,
        restoring: useContext(RestorationContext),
      }),
    };
    const { default: RootLayout } = s.load('app/_layout.tsx');
    const view = renderFixture(createElement(RootLayout));
    const queryProvider = view.findAll('AppQueryProvider')[0];
    const authProvider = view.findAll('AuthProvider')[0];
    const background = view.findAll('AuroraBackground')[0];
    const headerWave = view.findAll('PageMotionOverlay')[0];
    const launch = view.findAll('LaunchScreen')[0];
    assert.equal(background.props.animate, false);
    assert.equal(headerWave.props.animate, false);
    assert.equal(launch.props.exiting, false);
    // Time alone cannot release startup while required resources are unavailable.
    view.flush(() => t.mock.timers.tick(5_000));
    assert.equal(launch.props.exiting, false);
    view.flush(() => launch.props.onReady());
    assert.equal(view.findAll('Stack').length, 0);
    assert.equal(view.findAll('RestorationPanel').length, 0);
    view.flush(finishLanguage);
    assert.equal(view.findAll('Stack').length, 0);
    assert.equal(view.findAll('RestorationPanel').length, 0);
    view.flush(finishRestore);
    const stack = view.findAll('Stack')[0];
    assert.equal(
      launch.props.exiting,
      true,
      'Readiness must begin the exit without a branding delay.',
    );
    assert.equal(
      view.findAll('View').some((node) => node.props.testID === 'app-ready'),
      false,
    );
    view.flush(() => launch.props.onExitComplete());
    assert.equal(view.findAll('LaunchScreen').length, 0);
    assert.equal(view.findAll('AuroraBackground')[0], background);
    assert.equal(background.props.animate, true);
    assert.equal(view.findAll('PageMotionOverlay').length, 1);
    assert.equal(view.findAll('PageMotionOverlay')[0], headerWave);
    assert.equal(headerWave.props.animate, true);
    assert.equal(
      view.findAll('View').some((node) => node.props.testID === 'app-ready'),
      true,
    );
    assert.equal(stack.props.screenOptions.contentStyle.backgroundColor, 'transparent');
    assert.equal(view.findAll('AuthProvider')[0], authProvider);
    assert.equal(view.findAll('AppQueryProvider')[0], queryProvider);
    assert.equal(view.findAll('Switch').length, 0);
    assert.equal(view.findAll('Screen')[0].props.name, authenticated ? '(tabs)' : '(auth)');
    for (const direction of ['rtl', 'ltr']) {
      view.flush(() => directionSettings.setDirection(direction));
      assert.equal(view.findAll('Switch').length, 0);
      assert.equal(view.findAll('Stack')[0], stack);
      assert.equal(stack.props.screenOptions.contentStyle.direction, direction);
      assert.equal(view.findAll('AppQueryProvider')[0], queryProvider);
      assert.equal(view.findAll('AuthProvider')[0], authProvider);
      assert.equal(view.findAll('PageMotionOverlay')[0], headerWave);
    }
    view.unmount();
  });
}
