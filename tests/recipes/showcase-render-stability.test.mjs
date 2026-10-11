import assert from 'node:assert/strict';
import test from 'node:test';
import { createContext, createElement as h, useContext, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

test('showcase preview and height changes reuse cards; changed card width and language update content', async () => {
  const native = (name) => (props) => h(name, props, props.children);
  const dimensions = createContext({ width: 390, height: 844, fontScale: 1 });
  const calls = { cards: 0, fixtures: 0 };
  const mocks = {
    '@components/ui': {
      Column: native('Column'),
      Row: native('Row'),
      ScrollView: native('Scroll'),
      BottomSheet: native('Sheet'),
      UniversalButtonContent: native('Button'),
      UniversalTextContent: native('Text'),
      nativeFillWidth: [],
      HomeRecipeCard: (props) => {
        calls.cards++;
        return h('Card', props);
      },
    },
    'react-native': { useWindowDimensions: () => useContext(dimensions) },
    'react-native-safe-area-context': { useSafeAreaInsets: () => ({ left: 0, right: 0 }) },
    '@assets/images/recipe-examples/breakfast.jpg': 1,
    '@assets/images/recipe-examples/salad.jpg': 2,
    '@assets/images/recipe-examples/pasta.jpg': 3,
  };
  const load = createSourceLoader(mocks);
  const data = load('features/recipes/home-card-examples.data.ts');
  mocks['@/features/recipes/home-card-examples.data'] = {
    homeRecipeExamples: (t) => {
      calls.fixtures++;
      return data.homeRecipeExamples(t);
    },
  };
  const { HomeCardExamples } = load('features/recipes/home-card-examples.tsx');
  const i18n = load('lib/i18n.ts').default;
  const content = h(HomeCardExamples);
  let resize;
  function Window() {
    const [size, update] = useState({ width: 390, height: 844, fontScale: 1 });
    resize = update;
    return h(dimensions.Provider, { value: size }, content);
  }
  const view = renderFixture(h(Window));
  try {
    const count = view.findAll('Card').length;
    assert.equal(count, 8);
    const recipe = view.findAll('Card')[0].props.recipe;
    view.flush(() => view.findAll('Card')[0].props.onPress());
    assert.equal(view.findAll('Sheet').length, 1);
    assert.equal(calls.cards, count);
    assert.equal(calls.fixtures, 1);
    view.flush(() => resize({ width: 390, height: 500, fontScale: 1 }));
    assert.equal(calls.cards, count);
    assert.equal(calls.fixtures, 1);
    assert.equal(view.findAll('Scroll').at(-1).props.style.height, 325);
    view.flush(() => resize({ width: 520, height: 500, fontScale: 1 }));
    assert.equal(calls.cards, count + count / 2);
    assert.equal(
      view.findAll('Card').find(({ props }) => props.variant === 'editorial').props.width,
      472,
    );
    await i18n.changeLanguage('fr');
    await new Promise((resolve) => setImmediate(resolve));
    view.flush(() => {});
    assert.equal(calls.fixtures, 2);
    assert.notEqual(view.findAll('Card')[0].props.recipe.title, recipe.title);
    assert.notEqual(
      view.findAll('Text').find(({ props }) => props.testID === 'home-example-recipe-title').props
        .children,
      recipe.title,
    );
    view.flush(() => view.findAll('Sheet')[0].props.onDismiss());
    assert.equal(view.findAll('Sheet').length, 0);
  } finally {
    view.unmount();
    await i18n.changeLanguage('en');
  }
});
