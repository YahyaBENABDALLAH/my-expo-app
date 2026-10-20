import assert from 'node:assert/strict';
import test from 'node:test';
import { createContext, createElement as h, useContext, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

function setup(platform = 'ios') {
  const native = (type) => (props) => h(type, props, props.children);
  const SafeAreaInsetsContext = createContext({ top: 59, bottom: 34, left: 44, right: 0 });
  const PageWaveContext = createContext(null);
  const listeners = new Set();
  const mocks = {
    '@/constants/app-dev': { appDevEnabled: true },
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
    '@/hooks/use-theme': { useThemeColors: () => ({ background: '#FFFFFF' }) },
    '@/components/ui/host/universal-host': {
      useHostColorScheme: (scheme) => scheme ?? 'light',
    },
    '@/components/ui/page/page-header': { PageHeader: native('Header') },
    '@/components/ui/page/page-wave-context': { PageWaveContext },
    '@/components/ui/page/page-wave-surface': { PageWaveSurface: native('WaveSurface') },
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
      h('Sheet', props, isPresented ? children : null),
    Column: native('Column'),
    Row: native('Row'),
    Switch: native('Switch'),
    ThemePicker: native('ThemePicker'),
    ColorSchemeControl: native('ColorSchemeControl'),
    UniversalButtonContent: native('Button'),
    UniversalHost: native('Host'),
    UniversalTextContent: native('Text'),
    nativeFillSize: [],
    nativeFillWidth: [],
    nativeRowWeight: [],
  };
  mocks['expo-router'] = { router: { canGoBack: () => true, back() {}, replace() {} } };
  mocks['@/context/language.context'] = { useLanguage: () => ({ language: 'en', ready: true }) };
  for (const icon of ['open_in_new', 'chevron_right', 'person', 'check']) {
    mocks[`@expo/material-symbols/${icon}.xml`] = 1;
  }
  return {
    ...frame,
    load,
    SafeAreaInsetsContext,
    PageWaveContext,
    reduceTransparency: (value) => listeners.forEach((listener) => listener(value)),
  };
}

const headerArea = (view) =>
  view.findAll('View').find(({ props }) => props.testID === 'page-header-safe-area');
const measure = (view, height) =>
  view.flush(() => headerArea(view).props.onLayout({ nativeEvent: { layout: { height } } }));

for (const platform of ['ios', 'android']) {
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
      1,
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

  test(`${platform}: scrolling frames own one header inset and share the wave backdrop`, (t) => {
    const s = setup(platform);
    const wave = { overlayHeight: 180 };
    function ScrollContent() {
      return h('ScrollContent', { paddingTop: s.usePageHeaderInset() + 24 });
    }
    const view = renderFixture(
      h(
        s.PageWaveContext.Provider,
        { value: wave },
        h(s.PageFrame, { title: 'Home', scrollsBehindHeader: true }, h(ScrollContent)),
      ),
    );
    t.after(() => view.unmount());
    measure(view, 115);
    assert.equal(view.findAll('BlurTarget')[0].props.style.paddingTop, 0);
    assert.equal(headerArea(view).props.style.position, 'absolute');
    assert.equal(view.findAll('ScrollContent')[0].props.paddingTop, 139);
    assert.equal(view.findAll('WaveSurface')[0].props.wave, wave);
    assert.equal(headerArea(view).props.pointerEvents, 'none');
    measure(view, 163);
    assert.equal(view.findAll('ScrollContent')[0].props.paddingTop, 187);
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
