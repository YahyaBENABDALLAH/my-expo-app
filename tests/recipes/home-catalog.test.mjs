import assert from 'node:assert/strict';
import test from 'node:test';
import { createContext, createElement as h, useContext, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

// Production sections/cards/hooks run unchanged; only native rendering and routing are boundaries.
function setup() {
  const native = (name) => (props) => h(name, props, props.children);
  const dimensions = createContext({ width: 390, height: 844 });
  const routes = [];
  const Icon = Object.assign(native('Icon'), { select: ({ ios }) => ios });
  const ui = {
    Column: native('Column'),
    Row: native('Row'),
    ScrollView: native('ScrollView'),
    BottomSheet: native('Sheet'),
    UniversalButtonContent: native('Button'),
    UniversalTextContent: native('Text'),
    nativeFillWidth: [],
    nativeRowWeight: [],
    useHostColorScheme: () => 'light',
    PageFrame: native('PageFrame'),
    UniversalHost: native('Host'),
  };
  const load = createSourceLoader({
    '@components/ui': ui,
    '@expo/ui': { Column: ui.Column, Row: ui.Row, Icon, RNHostView: native('RNHostView') },
    'expo-image': { Image: native('Image') },
    'react-native': { useWindowDimensions: () => useContext(dimensions) },
    'react-native-safe-area-context': { useSafeAreaInsets: () => ({ left: 0, right: 0 }) },
    '@/hooks/use-theme': {
      useThemeColors: () => ({
        text: '#111',
        muted: '#555',
        tint: '#080',
        surfaceVariant: '#eee',
        warningContainer: '#fec',
        info: '#08a',
        onInfo: '#fff',
        infoContainer: '#def',
      }),
    },
    '@/hooks/use-color-scheme': { useColorScheme: () => 'light' },
    '@/components/ui/host/universal-host': { useHostColorScheme: ui.useHostColorScheme },
    '@/components/ui/native/native-fill-width': { nativeFillWidth: [], nativeRowWeight: [] },
    '@/components/ui/button/universal-button-content': {
      UniversalButtonContent: ui.UniversalButtonContent,
    },
    '@/components/ui/text/universal-text': { UniversalTextContent: ui.UniversalTextContent },
    '@expo/material-symbols/image.xml': 1,
    '@expo/material-symbols/bookmark.xml': 2,
    '@expo/material-symbols/bookmark_added.xml': 3,
    '@assets/images/recipe-examples/breakfast.jpg': 1,
    '@assets/images/recipe-examples/salad.jpg': 2,
    '@assets/images/recipe-examples/pasta.jpg': 3,
    'expo-router': { router: { navigate: (route) => routes.push(route) } },
  });
  ui.HomeCatalogCard = load('components/ui/home-recipe-card/home-catalog-card.tsx').HomeCatalogCard;
  const { HomeCatalogSections } = load('features/recipes/home-catalog-sections.tsx');
  const HomeScreen = load('features/recipes/home-screen.tsx').default;
  let resize;
  function Frame({ Component = HomeCatalogSections }) {
    const [size, setSize] = useState({ width: 390, height: 844 });
    resize = setSize;
    return h(dimensions.Provider, { value: size }, h(Component));
  }
  const byId = (view, type, id) => {
    const node = view.findAll(type).find((candidate) => candidate.props.testID === id);
    assert.ok(node, `Missing ${type}: ${id}`);
    return node;
  };
  return {
    mount: () => renderFixture(h(Frame)),
    mountHome: () => renderFixture(h(Frame, { Component: HomeScreen })),
    byId,
    routes,
    i18n: load('lib/i18n.ts').default,
    resize: (size) => resize(size),
    tap: (view, id) => view.flush(() => byId(view, 'Button', id).props.onPress()),
  };
}

test('sample home has one vertical page scroll and horizontal rails without recipe API loading or pulse timers', (t) => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  const intervals = t.mock.method(globalThis, 'setInterval');
  const fetch = t.mock.method(globalThis, 'fetch', () =>
    assert.fail('Sample home must not fetch recipe data.'),
  );
  const s = setup();
  const view = s.mountHome();
  try {
    const scrolls = view.findAll('ScrollView');
    assert.equal(scrolls.filter((node) => node.props.direction === 'vertical').length, 1);
    assert.equal(scrolls.filter((node) => node.props.direction === 'horizontal').length, 6);
    assert.equal(view.findAll('Sheet')[0].props.isPresented, false);
    assert.equal(intervals.mock.calls.length, 0);
    assert.equal(fetch.mock.calls.length, 0);
    const artwork = s.byId(view, 'Image', 'home-card-hero-sample-1-artwork');
    const thumbnail = s.byId(view, 'Image', 'home-card-hero-sample-1-thumbnail');
    assert.match(artwork.props.source.uri, /^https:\/\/picsum\.photos\/seed\/[^/]+-1\/800\/450$/);
    assert.deepEqual(thumbnail.props.source, artwork.props.source);
    assert.equal(new Set(view.findAll('Image').map((image) => image.props.source.uri)).size, 8);
    s.tap(view, 'home-card-featured-sample-1-open');
    assert.equal(s.byId(view, 'Text', 'home-sample-preview-title').props.children, 'Avocado toast');
  } finally {
    view.unmount();
  }
});

test('Details opens the correct item and preserves the sheet/body through close, dismiss and reopen', () => {
  const s = setup();
  const view = s.mount();
  try {
    const sheet = view.findAll('Sheet')[0];
    assert.equal(sheet.props.isPresented, false);
    assert.equal(sheet.props.contentHeight, 420);
    s.tap(view, 'home-card-hero-sample-1-open');
    const title = s.byId(view, 'Text', 'home-sample-preview-title');
    assert.equal(title.props.children, 'Avocado toast');
    assert.equal(sheet.props.isPresented, true);
    s.tap(view, 'home-sample-preview-close');
    assert.equal(sheet.props.isPresented, false);
    assert.equal(view.findAll('Sheet')[0], sheet);
    assert.equal(s.byId(view, 'Text', 'home-sample-preview-title'), title);
    assert.equal(title.props.children, 'Avocado toast');
    s.tap(view, 'home-card-kitchen-sample-2-open');
    assert.equal(sheet.props.isPresented, true);
    assert.equal(title.props.children, 'Chickpea salad');
    assert.ok(s.byId(view, 'Text', 'home-sample-preview-item-sample-2'));
    view.flush(() => sheet.props.onDismiss());
    assert.equal(sheet.props.isPresented, false);
    assert.equal(title.props.children, 'Chickpea salad');
    s.tap(view, 'home-card-catalog-sample-8-open');
    assert.equal(title.props.children, 'Chickpea salad · 8');
    assert.equal(view.findAll('Sheet')[0], sheet);
    assert.deepEqual(s.routes, []);
  } finally {
    view.unmount();
  }
});

test('hero save toggles locally without presenting Details; search is the only navigation action', (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', () =>
    assert.fail('Sample home must not fetch recipe data.'),
  );
  const s = setup();
  const view = s.mount();
  const photos = () => view.findAll('Image').map((image) => image.props.source.uri);
  const initialPhotos = photos();
  const label = () =>
    s.byId(view, 'Button', 'home-card-hero-sample-1-save').props.children.props.children[1].props
      .children;
  try {
    assert.equal(label(), 'Save');
    s.tap(view, 'home-card-hero-sample-1-save');
    assert.equal(label(), 'Saved');
    assert.deepEqual(photos(), initialPhotos);
    assert.equal(view.findAll('Sheet')[0].props.isPresented, false);
    s.tap(view, 'home-card-hero-sample-1-save');
    assert.equal(label(), 'Save');
    s.tap(view, 'home-search');
    assert.deepEqual(s.routes, ['/search']);
    assert.equal(fetch.mock.calls.length, 0);
  } finally {
    view.unmount();
  }
});

test('a compact window resize preserves the selected preview and keeps rails within the available width', () => {
  const s = setup();
  const view = s.mount();
  try {
    s.tap(view, 'home-card-inspiration-sample-3-open');
    view.flush(() => s.resize({ width: 320, height: 568 }));
    assert.equal(view.findAll('Sheet')[0].props.contentHeight, 340.8);
    assert.equal(view.findAll('Sheet')[0].props.isPresented, true);
    assert.equal(s.byId(view, 'Text', 'home-sample-preview-title').props.children, 'Pesto pasta');
    assert.ok(
      view
        .findAll('Column')
        .filter((node) => node.props.style?.width)
        .every((node) => node.props.style.width <= 288),
    );
    assert.equal(
      view.findAll('ScrollView').filter((node) => node.props.direction === 'horizontal').length,
      6,
    );
  } finally {
    view.unmount();
  }
});

test('the selected preview follows locale changes without closing or losing its item', async () => {
  const s = setup();
  const view = s.mount();
  try {
    s.tap(view, 'home-card-hero-sample-3-open');
    for (const [language, title] of [
      ['fr', 'Pâtes au pesto'],
      ['ar', 'معكرونة بالبيستو'],
    ]) {
      await s.i18n.changeLanguage(language);
      view.flush(() => {});
      assert.equal(s.byId(view, 'Text', 'home-sample-preview-title').props.children, title);
      assert.equal(view.findAll('Sheet')[0].props.isPresented, true);
      assert.ok(s.byId(view, 'Text', 'home-sample-preview-item-sample-3'));
    }
  } finally {
    view.unmount();
  }
});
