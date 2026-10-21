import assert from 'node:assert/strict';
import test from 'node:test';
import { createContext, createElement as h, useContext, useEffect, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

function setup(platform = 'ios') {
  const native = (type) => (props) => h(type, props, props.children);
  const SafeAreaInsetsContext = createContext({ top: 59, bottom: 34, left: 44, right: 0 });
  const PageWaveContext = createContext(null);
  const FocusContext = createContext(true);
  const DirectionContext = createContext('ltr');
  const listeners = new Set();
  const mocks = {
    'expo-router': {
      router: { canGoBack: () => true, back() {}, replace() {} },
      useFocusEffect: (callback) => {
        const focused = useContext(FocusContext);
        useEffect(() => (focused ? callback() : undefined), [focused, callback]);
      },
    },
    '@/constants/app-dev': { appDevEnabled: true },
    '@/context/layout-direction.context': {
      useLayoutDirection: () => useContext(DirectionContext),
    },
    'react-native': {
      View: native('View'),
      Platform: { OS: platform },
      AccessibilityInfo: {
        isReduceTransparencyEnabled: () => Promise.resolve(false),
        addEventListener: (_name, listener) => {
          listeners.add(listener);
          return { remove: () => listeners.delete(listener) };
        },
      },
    },
    'react-native-safe-area-context': {
      SafeAreaInsetsContext,
      useSafeAreaInsets: () => useContext(SafeAreaInsetsContext),
    },
    'expo-blur': { BlurTargetView: native('BlurTarget'), BlurView: native('BlurView') },
    'react-native-reanimated': {
      __esModule: true,
      default: { View: native('TouchShield') },
      useAnimatedStyle: (compute) => ({ compute }),
    },
    '@/hooks/use-theme': { useThemeColors: () => ({ background: '#FFFFFF' }) },
    '@/components/ui/host/universal-host': {
      useHostColorScheme: (scheme) => scheme ?? 'light',
    },
    '@/components/ui/page/page-header': { PageHeader: native('Header') },
    '@/components/ui/page/page-wave-context': { PageWaveContext },
    '@/components/ui/page/page-wave-surface': { PageWaveSurface: native('WaveSurface') },
    '@/components/ui/page/use-page-wave-motion': { PAGE_WAVE_HEIGHT: 80 },
    '@/components/ui/native/native-fill-width': { nativeFillSize: [] },
    '@expo/ui/swift-ui/modifiers': {
      scrollContentBackground: (visible) => ({ type: 'scrollContentBackground', visible }),
    },
  };
  const load = createSourceLoader(mocks);
  const frame = load('components/ui/page/page-frame.tsx');
  const formModifiers = load(`components/ui/page/page-form-modifiers.${platform}.ts`);
  const FieldGroup = native('FieldGroup');
  FieldGroup.Section = native('Section');
  FieldGroup.SectionHeader = native('SectionHeader');
  FieldGroup.SectionFooter = native('Footer');
  const Icon = native('Icon');
  Icon.select = ({ ios, android }) => (platform === 'ios' ? ios : android);
  mocks['@components/ui'] = {
    ...frame,
    ...formModifiers,
    FieldGroup,
    Icon,
    BottomSheet: ({ isPresented, children, ...props }) =>
      h('Sheet', { ...props, isPresented }, isPresented ? children : null),
    PageSection: native('PageSection'),
    Column: native('Column'),
    Row: native('Row'),
    Switch: native('Switch'),
    ThemePicker: native('ThemePicker'),
    HeaderMotionPicker: native('HeaderMotionPicker'),
    ColorSchemeControl: native('ColorSchemeControl'),
    UniversalButtonContent: native('Button'),
    UniversalHost: native('Host'),
    UniversalTextContent: native('Text'),
    nativeFillSize: [],
    nativeFillWidth: [],
    nativeRowWeight: [],
  };
  mocks['@/context/language.context'] = { useLanguage: () => ({ language: 'en', ready: true }) };
  for (const icon of ['open_in_new', 'chevron_right', 'person', 'check']) {
    mocks[`@expo/material-symbols/${icon}.xml`] = 1;
  }
  return {
    ...frame,
    load,
    SafeAreaInsetsContext,
    DirectionContext,
    PageWaveContext,
    FocusContext,
    reduceTransparency: (value) => listeners.forEach((listener) => listener(value)),
  };
}

const headerArea = (view) =>
  view.findAll('View').find(({ props }) => props.testID === 'page-header-safe-area');
const measure = (view, height) =>
  view.flush(() => headerArea(view).props.onLayout({ nativeEvent: { layout: { height } } }));

for (const platform of ['ios', 'android']) {
  test(`${platform}: initial header clearance survives incomplete native layout and grows for larger text`, (t) => {
    const s = setup(platform);
    const heights = [];
    const wave = { setHeaderHeight: (height) => heights.push(height) };
    function Content() {
      return h('ScrollContent', { paddingTop: s.usePageHeaderInset() });
    }
    const view = renderFixture(
      h(
        s.PageWaveContext.Provider,
        { value: wave },
        h(s.PageFrame, { title: 'Home', scrollsBehindHeader: true }, h(Content)),
      ),
    );
    t.after(() => view.unmount());
    const content = view.findAll('ScrollContent')[0];
    assert.equal(
      content.props.paddingTop,
      107,
      'Reserve the status bar and 48-point row immediately.',
    );
    assert.deepEqual(heights, [107]);
    for (const height of [0, 59, 90, 106, 107]) measure(view, height);
    assert.equal(content.props.paddingTop, 107);
    assert.deepEqual(heights, [107], 'An unmeasured Host must not shrink the shared SVG.');
    measure(view, 163);
    assert.equal(
      content.props.paddingTop,
      163,
      'Wrapped/scaled titles retain their native height.',
    );
    measure(view, 59);
    assert.equal(
      content.props.paddingTop,
      163,
      'A later incomplete pass must not erase valid bounds.',
    );
    measure(view, 107);
    assert.equal(
      content.props.paddingTop,
      107,
      'Valid measurements can shrink after text changes.',
    );
    assert.equal(view.findAll('ScrollContent')[0], content);
    assert.deepEqual(heights, [107, 163, 107]);
  });

  test(`${platform}: navigating to Back and returning keeps the shared wave height while inactive layouts stay local`, (t) => {
    const s = setup(platform);
    const heights = [];
    const wave = { setHeaderHeight: (height) => heights.push(height) };
    let navigate;
    function Navigation() {
      const [details, setDetails] = useState(false);
      const [opened, setOpened] = useState(false);
      navigate = (next) => {
        if (next) setOpened(true);
        setDetails(next);
      };
      return h(
        s.PageWaveContext.Provider,
        { value: wave },
        h(s.FocusContext.Provider, { value: !details }, h(s.PageFrame, { title: 'Home' })),
        opened
          ? h(
              s.FocusContext.Provider,
              { value: details },
              h(s.PageFrame, { title: 'Details', onBack: () => navigate(false) }),
            )
          : null,
      );
    }
    const view = renderFixture(h(Navigation));
    t.after(() => view.unmount());
    measure(view, 107);
    const homeArea = headerArea(view);
    view.flush(() => navigate(true));
    const detailsArea = view
      .findAll('View')
      .filter(({ props }) => props.testID === 'page-header-safe-area')[1];
    view.flush(() => detailsArea.props.onLayout({ nativeEvent: { layout: { height: 59 } } }));
    view.flush(() => detailsArea.props.onLayout({ nativeEvent: { layout: { height: 107 } } }));
    assert.deepEqual(heights, [107, 107], 'Mounting a Back header retains the same bounds.');
    view.flush(() => homeArea.props.onLayout({ nativeEvent: { layout: { height: 163 } } }));
    assert.deepEqual(heights, [107, 107], 'An unfocused screen cannot resize the overlay.');
    view.flush(() => homeArea.props.onLayout({ nativeEvent: { layout: { height: 107 } } }));
    view.flush(() => view.findAll('Header')[1].props.onBack());
    assert.deepEqual(heights, [107, 107, 107]);
    assert.equal(headerArea(view), homeArea, 'Back restores the retained screen.');
  });

  test(`${platform}: safe-area changes immediately retain the measured title height`, (t) => {
    const s = setup(platform);
    const heights = [];
    const wave = { setHeaderHeight: (height) => heights.push(height) };
    let changeInsets;
    function Content() {
      return h('ScrollContent', { paddingTop: s.usePageHeaderInset() });
    }
    function Screen() {
      const [top, setTop] = useState(59);
      changeInsets = setTop;
      return h(
        s.SafeAreaInsetsContext.Provider,
        { value: { top, bottom: 34, left: 0, right: 0 } },
        h(
          s.PageWaveContext.Provider,
          { value: wave },
          h(s.PageFrame, { title: 'Long title', scrollsBehindHeader: true }, h(Content)),
        ),
      );
    }
    const view = renderFixture(h(Screen));
    t.after(() => view.unmount());
    measure(view, 163);
    const content = view.findAll('ScrollContent')[0];
    view.flush(() => changeInsets(24));
    assert.equal(content.props.paddingTop, 128, 'Keep the 104-point title, replace the top inset.');
    assert.equal(heights.at(-1), 128);
    measure(view, 72);
    assert.equal(content.props.paddingTop, 72, 'A shorter title can settle after rotation.');
    assert.equal(heights.at(-1), 72);
    assert.equal(view.findAll('ScrollContent')[0], content);
  });

  test(`${platform}: App Settings scrolls beneath the blur and reserves the measured title inside the form`, (t) => {
    const s = setup(platform);
    const { SettingsPage } = s.load('features/settings/settings-screen.tsx');
    let backs = 0;
    const view = renderFixture(h(SettingsPage, { language: 'fr', onBack: () => backs++ }));
    t.after(() => view.unmount());
    const header = view.findAll('Header')[0];
    assert.equal(header.props.title, 'App Settings');
    assert.equal(headerArea(view).props.style.position, 'absolute');
    measure(view, 143);
    assert.equal(view.findAll('BlurTarget')[0].props.style.paddingTop, 0);
    const scrollInset = () =>
      view.findAll('Column').find(({ props }) => props.testID === 'app-settings-scroll-inset');
    assert.equal(scrollInset().props.style.paddingTop, 143);
    const account = view
      .findAll('Column')
      .find(({ props }) => props.testID === 'app-settings-account');
    measure(view, 191);
    assert.equal(scrollInset().props.style.paddingTop, 191);
    assert.equal(
      view.findAll('Column').find(({ props }) => props.testID === 'app-settings-account'),
      account,
    );
    const form = view.findAll('FieldGroup')[0];
    assert.equal(form.props.style.backgroundColor, 'transparent');
    if (platform === 'ios') {
      assert.ok(
        form.props.modifiers.some(
          (modifier) =>
            modifier.type === 'scrollContentBackground' && modifier.visible === 'hidden',
        ),
      );
    }
    const viewport = view
      .findAll('View')
      .find(({ props }) => props.testID === 'app-settings-viewport');
    assert.equal(viewport.props.style.overflow, 'hidden');
    assert.equal(viewport.props.collapsable, false);
    assert.equal(
      view.findAll('FieldGroup').length,
      1,
      'The form remains the only scroll container.',
    );
    assert.equal(view.findAll('Sheet')[0].children.length, 0);
    view.flush(() => header.props.onBack());
    assert.equal(backs, 1);
  });

  test(`${platform}: every titled frame blurs by default and reserves resized headers without losing a draft`, (t) => {
    const s = setup(platform);
    let updateDraft;
    let backs = 0;
    function Content() {
      const [draft, setDraft] = useState('Unsaved recipe');
      updateDraft = setDraft;
      return h('Draft', {
        draft,
        insets: useContext(s.SafeAreaInsetsContext),
        headerInset: s.usePageHeaderInset(),
      });
    }
    const view = renderFixture(
      h(s.PageFrame, { title: 'Settings', onBack: () => backs++ }, h(Content)),
    );
    t.after(() => view.unmount());
    const draft = view.findAll('Draft')[0];
    measure(view, 115);
    const target = view.findAll('BlurTarget')[0];
    const blur = view.findAll('BlurView')[0];
    assert.equal(
      headerArea(view).props.style.position,
      undefined,
      'Fixed headers stay in normal layout.',
    );
    assert.equal(
      headerArea(view).props.style.zIndex,
      2,
      'The title stays above the blur and native form.',
    );
    assert.equal(target.props.style.position, 'absolute');
    assert.equal(target.props.style.top, 0);
    assert.equal(target.props.style.bottom, 0);
    assert.equal(target.props.style.paddingTop, 115);
    assert.equal(draft.props.headerInset, 0, 'The frame already reserves the header.');
    assert.deepEqual(draft.props.insets, { top: 0, bottom: 34, left: 44, right: 0 });
    assert.equal(blur.props.style.height, 115);
    assert.equal(blur.props.blurTarget, target.props.ref);
    assert.equal(blur.props.pointerEvents, 'none');
    assert.equal(blur.props.blurMethod, 'dimezisBlurViewSdk31Plus');
    view.flush(() => updateDraft('Updated recipe'));
    measure(view, 163);
    assert.equal(target.props.style.paddingTop, 163);
    assert.equal(view.findAll('Draft')[0], draft);
    assert.equal(draft.props.draft, 'Updated recipe');
    view.flush(() => view.findAll('Header')[0].props.onBack());
    assert.equal(backs, 1);
  });

  test(`${platform}: wave bounds and visibility never add to the measured header inset`, (t) => {
    const s = setup(platform);
    const heights = [];
    const wave = { overlayHeight: 80, setHeaderHeight: (height) => heights.push(height) };
    let updateWave;
    function ScrollContent() {
      return h('ScrollContent', { paddingTop: s.usePageHeaderInset() + 24 });
    }
    function Preview() {
      const [currentWave, setWave] = useState(wave);
      updateWave = setWave;
      return h(
        s.PageWaveContext.Provider,
        { value: currentWave },
        h(s.PageFrame, { title: 'Home', scrollsBehindHeader: true }, h(ScrollContent)),
      );
    }
    const view = renderFixture(h(Preview));
    t.after(() => view.unmount());
    measure(view, 115);
    assert.equal(heights.at(-1), 115, 'The focused header supplies its measured SVG height.');
    assert.equal(headerArea(view).props.style.backgroundColor, undefined);
    assert.equal(view.findAll('BlurTarget')[0].props.style.paddingTop, 0);
    assert.equal(headerArea(view).props.style.position, 'absolute');
    assert.equal(view.findAll('ScrollContent')[0].props.paddingTop, 139);
    assert.equal(view.findAll('WaveSurface')[0].props.wave, wave);
    assert.equal(headerArea(view).props.pointerEvents, 'none');
    const headerStyle = { ...headerArea(view).props.style };
    const contentStyle = { ...view.findAll('BlurTarget')[0].props.style };
    const content = view.findAll('ScrollContent')[0];
    for (const nextWave of [{ overlayHeight: 400 }, { overlayHeight: 1400 }, null, wave]) {
      view.flush(() => updateWave(nextWave));
      assert.deepEqual(headerArea(view).props.style, headerStyle);
      assert.deepEqual(view.findAll('BlurTarget')[0].props.style, contentStyle);
      assert.equal(view.findAll('ScrollContent')[0], content, 'Wave changes retain content.');
      assert.equal(content.props.paddingTop, 139, 'Only the measured title adds clearance.');
    }
    measure(view, 163);
    assert.equal(view.findAll('ScrollContent')[0].props.paddingTop, 187);
    assert.equal(heights.at(-1), 163, 'Larger text resizes both paths to the header.');
  });

  test(`${platform}: full-height overlays blur without shifting content or consuming map insets`, (t) => {
    const s = setup(platform);
    function MapContent() {
      return h('Map', { insets: useContext(s.SafeAreaInsetsContext) });
    }
    const view = renderFixture(
      h(s.PageFrame, { title: 'Maps', headerOverlay: true }, h(MapContent)),
    );
    t.after(() => view.unmount());
    measure(view, 115);
    assert.equal(view.findAll('BlurTarget')[0].props.style.paddingTop, 0);
    assert.equal(view.findAll('Map')[0].props.insets.top, 59);
    assert.equal(view.findAll('BlurView').length, 1);
    assert.equal(headerArea(view).props.pointerEvents, 'none');
  });
  test(`${platform}: the header blocks covered content while Back remains above the shield`, (t) => {
    const s = setup(platform);
    let offset = 0;
    const wave = { waveHeight: 115, fit: { get: () => [{ scaleX: 1 }, { translateY: offset }] } };
    let backs = 0;
    const view = renderFixture(
      h(
        s.PageWaveContext.Provider,
        { value: wave },
        h(
          s.PageFrame,
          { title: 'Settings', onBack: () => backs++, scrollsBehindHeader: true },
          h('ContentAction'),
        ),
      ),
    );
    t.after(() => view.unmount());
    measure(view, 115);
    const shield = view.findAll('TouchShield')[0];
    const [bounds, animated] = shield.props.style;
    assert.equal(bounds.position, 'absolute');
    assert.equal(shield.props.pointerEvents, 'box-only');
    assert.equal(shield.props.onStartShouldSetResponder(), true);
    assert.equal(shield.props.onMoveShouldSetResponder(), true);
    assert.equal(shield.props.onResponderTerminationRequest(), false);
    assert.equal(animated.compute().height, 115);
    assert.ok(headerArea(view).props.style.zIndex > bounds.zIndex);
    assert.equal(headerArea(view).props.pointerEvents, 'box-none');
    view.flush(() => view.findAll('Header')[0].props.onBack());
    assert.equal(backs, 1);
    offset = 250;
    assert.equal(animated.compute().height, 365, 'Expanded waves cover only their current band.');
    offset = 100;
    assert.equal(
      animated.compute().height,
      215,
      'The shield follows collapse without React renders.',
    );
    offset = 0;
    assert.equal(animated.compute().height, 115);
    assert.equal(view.findAll('BlurTarget')[0].props.style.paddingTop, 0);
  });
}

test('a header without waves honors live Reduce Transparency and restores themed blur', async (t) => {
  const s = setup();
  const view = renderFixture(h(s.PageFrame, { title: 'Session', colorScheme: 'dark' }));
  t.after(() => view.unmount());
  await new Promise((resolve) => setImmediate(resolve));
  view.flush(() => {});
  measure(view, 115);
  assert.equal(view.findAll('BlurView')[0].props.tint, 'dark');
  view.flush(() => s.reduceTransparency(true));
  assert.equal(view.findAll('BlurView').length, 0);
  const solid = view
    .findAll('View')
    .find(({ props }) => props.testID === 'page-header-solid-background');
  assert.equal(solid.props.style.backgroundColor, '#FFFFFF');
  assert.equal(solid.props.style.height, 115);
  view.flush(() => s.reduceTransparency(false));
  assert.equal(view.findAll('BlurView').length, 1);
});

test('titleless auth frames keep their existing layout and explicit blur opt-outs work', (t) => {
  const s = setup();
  const view = renderFixture(h(s.PageFrame, null, h('AuthContent')));
  const plain = renderFixture(h(s.PageFrame, { title: 'Plain', headerBlur: false }, h('Content')));
  t.after(() => {
    view.unmount();
    plain.unmount();
  });
  for (const fixture of [view, plain]) {
    assert.equal(fixture.findAll('BlurTarget').length, 0);
    assert.equal(fixture.findAll('BlurView').length, 0);
    assert.equal(headerArea(fixture).props.style.position, undefined);
  }
});

for (const platform of ['ios', 'android']) {
  test(`${platform}: language direction changes refresh only the affected Settings host and retain the page and language sheet`, (t) => {
    const s = setup(platform);
    const { SettingsPage } = s.load('features/settings/settings-screen.tsx');
    let changeLanguage,
      backs = 0;
    function Screen() {
      const [language, setLanguage] = useState('en');
      changeLanguage = setLanguage;
      return h(
        s.DirectionContext.Provider,
        { value: language === 'ar' ? 'rtl' : 'ltr' },
        h(SettingsPage, { language, onLanguageChange: setLanguage, onBack: () => backs++ }),
      );
    }
    const view = renderFixture(h(Screen));
    t.after(() => view.unmount());
    const contentHost = () =>
      view.findAll('Host').find(({ props }) => props.testID === 'app-settings-content');
    const presentationHost = view
      .findAll('Host')
      .find(({ props }) => props.testID === 'app-settings-language-presentation');
    const frame = view.findAll('View')[0];
    let previousHost = contentHost();
    let previousDirection = 'ltr';
    view.flush(() =>
      view
        .findAll('Button')
        .find(({ props }) => props.testID === 'app-settings-language')
        .props.onPress(),
    );
    assert.equal(view.findAll('Sheet')[0].props.isPresented, true);
    for (const language of ['ar', 'en', 'fr', 'ar', 'fr']) {
      view.flush(() => changeLanguage(language));
      const direction = language === 'ar' ? 'rtl' : 'ltr';
      assert.equal(
        contentHost() === previousHost,
        platform !== 'ios' || direction === previousDirection,
      );
      assert.equal(
        view.findAll('View')[0],
        frame,
        'Keep navigation and the measured page mounted.',
      );
      assert.equal(
        view
          .findAll('Host')
          .find(({ props }) => props.testID === 'app-settings-language-presentation'),
        presentationHost,
      );
      assert.equal(
        view.findAll('Sheet')[0].props.isPresented,
        true,
        'Only the grouped form refreshes.',
      );
      previousHost = contentHost();
      previousDirection = direction;
    }
    view.flush(() =>
      view
        .findAll('Button')
        .find(({ props }) => props.testID === 'app-settings-language-en')
        .props.onPress(),
    );
    assert.equal(view.findAll('Sheet')[0].props.isPresented, false);
    view.flush(() => view.findAll('Header')[0].props.onBack());
    assert.equal(backs, 1);
  });
}
