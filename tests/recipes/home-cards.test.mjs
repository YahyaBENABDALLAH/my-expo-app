import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

// Exercise sample selection with the real cards; native views and bundled assets are boundaries.
function setup() {
  const native = (name) => (props) => h(name, props, props.children);
  let resize;
  const Icon = Object.assign(native('Icon'), { select: ({ ios }) => ios });
  const ui = {
    Column: native('Column'),
    Row: native('Row'),
    ScrollView: native('ScrollView'),
    BottomSheet: native('BottomSheet'),
    UniversalButtonContent: native('Button'),
    UniversalTextContent: native('Text'),
    nativeFillWidth: [],
    nativeRowWeight: [],
  };
  const load = createSourceLoader({
    '@components/ui': ui,
    '@expo/ui': { Column: ui.Column, Row: ui.Row, ScrollView: ui.ScrollView, Icon },
    'react-native': {
      useWindowDimensions: () => {
        const [dimensions, update] = useState({ width: 390, height: 844, fontScale: 1 });
        resize = update;
        return dimensions;
      },
    },
    'react-native-safe-area-context': { useSafeAreaInsets: () => ({ left: 0, right: 0 }) },
    '@/hooks/use-theme': {
      useThemeColors: () => ({
        text: '#111111',
        muted: '#555555',
        surfaceRaised: '#ffffff',
        surfaceVariant: '#eeeeee',
        tint: '#008069',
        error: '#b3261e',
      }),
    },
    '@/components/ui/host/universal-host': { useHostColorScheme: () => 'light' },
    '@/components/ui/native/native-fill-width': { nativeFillWidth: [], nativeRowWeight: [] },
    '@/components/ui/button/universal-button-content': {
      UniversalButtonContent: ui.UniversalButtonContent,
    },
    '@/components/ui/text/universal-text': { UniversalTextContent: ui.UniversalTextContent },
    '@/components/ui/home-recipe-card/home-recipe-card-image': {
      HomeRecipeCardImage: ({ top, bottom, ...props }) => h('CardImage', props, top, bottom),
    },
    '@assets/images/recipe-examples/breakfast.jpg': 1,
    '@assets/images/recipe-examples/salad.jpg': 2,
    '@assets/images/recipe-examples/pasta.jpg': 3,
    '@expo/material-symbols/favorite.xml': 1,
    '@expo/material-symbols/schedule.xml': 2,
    '@expo/material-symbols/person.xml': 3,
    '@expo/material-symbols/star.xml': 4,
    'expo-router': {
      router: { push: () => assert.fail('Samples must not navigate to fake API recipes.') },
    },
  });
  ui.HomeRecipeCard = load('components/ui/home-recipe-card/home-recipe-card.tsx').HomeRecipeCard;
  return {
    ...load('features/ui-showcase/home-card-examples.tsx'),
    i18n: load('lib/i18n.ts').default,
    resize: (dimensions) => resize(dimensions),
    byId: (view, type, testID) => view.findAll(type).find((node) => node.props.testID === testID),
  };
}

test('sample card taps open the matching local preview, and close and native dismissal both clear it', (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', () =>
    assert.fail('Bundled examples must not fetch data.'),
  );
  const s = setup();
  const view = renderFixture(h(s.HomeCardExamples));
  try {
    assert.equal(view.findAll('CardImage').length, 8);
    const buttons = view.findAll('Button');
    const popularIds = buttons
      .map((node) => node.props.testID)
      .filter((id) => id?.startsWith('home-popular-example-'));
    const editorialIds = buttons
      .map((node) => node.props.testID)
      .filter((id) => id?.startsWith('home-editorial-example-'));
    assert.deepEqual(popularIds, [
      'home-popular-example-toast',
      'home-popular-example-salad',
      'home-popular-example-pasta',
      'home-popular-example-toast-4',
    ]);
    assert.deepEqual(
      editorialIds,
      popularIds.map((id) => id.replace('home-popular-example-', 'home-editorial-example-')),
    );
    assert.equal(view.findAll('ScrollView').length, 2);
    assert.equal(view.findAll('ScrollView')[0].props.direction, 'horizontal');
    assert.equal(
      s.byId(view, 'ScrollView', 'home-editorial-card-examples').props.direction,
      'vertical',
    );
    assert.equal(view.findAll('BottomSheet').length, 0);
    view.flush(() => s.byId(view, 'Button', 'home-popular-example-toast').props.onPress());
    assert.equal(s.byId(view, 'Text', 'home-example-recipe-title').props.children, 'Avocado toast');
    view.flush(() => s.byId(view, 'Button', 'home-example-recipe-close').props.onPress());
    assert.equal(view.findAll('BottomSheet').length, 0);
    view.flush(() => s.byId(view, 'Button', 'home-editorial-example-pasta').props.onPress());
    assert.equal(s.byId(view, 'Text', 'home-example-recipe-title').props.children, 'Pesto pasta');
    view.flush(() => view.findAll('BottomSheet')[0].props.onDismiss());
    assert.equal(view.findAll('BottomSheet').length, 0);
    for (const lastCardId of [popularIds.at(-1), editorialIds.at(-1)]) {
      view.flush(() => s.byId(view, 'Button', lastCardId).props.onPress());
      assert.equal(
        s.byId(view, 'Text', 'home-example-recipe-title').props.children,
        'Avocado toast · 4',
      );
      view.flush(() => view.findAll('BottomSheet')[0].props.onDismiss());
    }
    assert.equal(fetch.mock.calls.length, 0);
  } finally {
    view.unmount();
  }
});

test('rotating a compact screen keeps the selected preview and fits card images to available width', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] });
  const intervals = t.mock.method(globalThis, 'setInterval');
  const s = setup();
  const view = renderFixture(h(s.HomeCardExamples));
  try {
    view.flush(() => s.byId(view, 'Button', 'home-popular-example-salad').props.onPress());
    view.flush(() => s.resize({ width: 320, height: 568 }));
    assert.ok(view.findAll('CardImage').every((node) => node.props.width <= 272));
    assert.equal(
      s.byId(view, 'Text', 'home-example-recipe-title').props.children,
      'Chickpea salad',
    );
    view.flush(() => t.mock.timers.tick(60_000));
    assert.equal(intervals.mock.calls.length, 0);
  } finally {
    view.unmount();
  }
});

test('an open sample preview follows live French and Arabic translations without losing selection', async () => {
  const s = setup();
  const view = renderFixture(h(s.HomeCardExamples));
  try {
    view.flush(() => s.byId(view, 'Button', 'home-editorial-example-pasta').props.onPress());
    for (const [language, title] of [
      ['fr', 'Pâtes au pesto'],
      ['ar', 'معكرونة بالبيستو'],
    ]) {
      await s.i18n.changeLanguage(language);
      view.flush(() => {});
      assert.equal(s.byId(view, 'Text', 'home-example-recipe-title').props.children, title);
      assert.equal(view.findAll('BottomSheet').length, 1);
    }
  } finally {
    view.unmount();
  }
});
