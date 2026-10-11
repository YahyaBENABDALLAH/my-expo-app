import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

function setup(initial = {}) {
  const native = (name) => (props) => h(name, props, props.children);
  const Picker = Object.assign(native('Picker'), { Item: native('Item') });
  const updates = [];
  const reads = [];
  let changeParams;
  let action;
  let hasResults = true;
  const setAction = (_tab, value) => {
    action = value;
  };
  const load = createSourceLoader({
    '@components/ui': {
      BottomSheet: native('Sheet'),
      Column: native('Column'),
      Row: native('Row'),
      ScrollView: native('ScrollView'),
      Picker,
      UniversalButtonContent: native('Button'),
      PageScreen: native('Page'),
      UniversalTextContent: native('Text'),
      NativeField: native('Input'),
      RecipeCard: native('Card'),
      QueryContent: native('Content'),
      nativeFillWidth: [],
    },
    'expo-router': {
      useIsFocused: () => true,
      useLocalSearchParams: () => {
        const [params, update] = useState(initial);
        changeParams = update;
        return params;
      },
      router: {
        setParams: (values) => {
          updates.push(values);
          changeParams((params) => ({ ...params, ...values }));
        },
      },
    },
    'react-native': { useWindowDimensions: () => ({ height: 844, width: 390, fontScale: 1 }) },
    '@/features/pages/tab-actions': { useTabActions: () => ({ setAction }) },
    '@/hooks/use-screen-refresh': { useScreenRefresh: () => async () => {} },
    '@/features/recipes/queries': {
      lookupLabel: (item) => item.name,
      lookupOptions: (kind) => ({ queryKey: [kind] }),
      recipeListOptions: (params) => ({ queryKey: ['recipes', { ...params }] }),
    },
    '@tanstack/react-query': {
      useQuery: (options) => {
        reads.push(options);
        const isRecipe = options.queryKey[0] === 'recipes';
        return {
          isSuccess: true,
          isFetching: false,
          isEnabled: options.enabled,
          fetchStatus: 'idle',
          error: null,
          data: {
            data: isRecipe
              ? hasResults
                ? [{ uuid: 'live-recipe' }]
                : []
              : [{ uuid: 'catalog-item', name: 'Salads' }],
            meta: { itemCount: hasResults ? 24 : 0, hasNextPage: hasResults },
          },
        };
      },
    },
  });
  return {
    Screen: load('features/recipes/search-screen.tsx').default,
    updates,
    reads,
    action: () => action,
    result: () => reads.filter((options) => options.queryKey[0] === 'recipes').at(-1).queryKey[1],
    byId: (view, id) =>
      ['Button', 'Input', 'Text']
        .flatMap((name) => view.findAll(name))
        .find((node) => node.props.testID === id),
    empty: () => {
      hasResults = false;
    },
  };
}

test('filters apply atomically; cancel and native dismissal discard a draft', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const s = setup({ categoryUuid: 'original-category' });
  const view = renderFixture(h(s.Screen));
  try {
    const press = (id) => view.flush(() => s.byId(view, id).props.onPress());
    view.flush(() => t.mock.timers.tick(300));
    press('search-next-page');
    assert.equal(s.result().page, 2);
    assert.equal(s.reads.filter((read) => read.queryKey[0] !== 'recipes').at(-1).enabled, false);
    view.flush(() => s.action().onPress());
    view.flush(() => view.findAll('Picker')[0].props.onValueChange('new-category'));
    assert.equal(s.result().categoryUuid, 'original-category');
    assert.equal(s.updates.length, 0);
    press('search-filter-cancel');
    assert.equal(view.findAll('Sheet')[0].props.isPresented, false);
    press('search-filters');
    assert.equal(view.findAll('Picker')[0].props.selectedValue, 'original-category');
    view.flush(() => view.findAll('Picker')[0].props.onValueChange('another-draft'));
    view.flush(() => view.findAll('Sheet')[0].props.onDismiss());
    press('search-filters');
    assert.equal(view.findAll('Picker')[0].props.selectedValue, 'original-category');
    view.flush(() => view.findAll('Picker')[0].props.onValueChange('applied-category'));
    press('search-filter-done');
    assert.equal(s.updates.length, 1);
    assert.equal(s.result().categoryUuid, 'applied-category');
    assert.equal(s.result().page, 1);
    assert.equal(view.findAll('Sheet')[0].props.isPresented, false);
    assert.equal(view.findAll('Page')[0].props.description.includes('applied-category'), false);
  } finally {
    view.unmount();
  }
});

test('typing debounces the query and resets pagination only when the search commits', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const s = setup({ q: 'tagine' });
  const view = renderFixture(h(s.Screen));
  try {
    view.flush(() => s.byId(view, 'search-next-page').props.onPress());
    view.flush(() => t.mock.timers.tick(300));
    assert.equal(s.result().page, 2, 'Mounting must not schedule a delayed page reset.');
    view.flush(() => s.byId(view, 'recipe-search-input').props.onChange('  couscous  '));
    view.flush(() => t.mock.timers.tick(299));
    assert.equal(s.result().search, 'tagine');
    assert.equal(s.result().page, 2);
    view.flush(() => t.mock.timers.tick(1));
    assert.equal(s.result().search, 'couscous');
    assert.equal(s.result().page, 1);
    assert.equal(s.updates.length, 0);
  } finally {
    view.unmount();
  }
});

test('a successful empty search offers reset and clears route criteria and the input', () => {
  const s = setup({ q: 'missing', cuisineUuid: 'filter-id' });
  s.empty();
  const view = renderFixture(h(s.Screen));
  try {
    assert.equal(
      view
        .findAll('Content')
        .find((node) => node.props.empty)
        .props.emptyMessage.includes('reset'),
      true,
    );
    assert.equal(view.findAll('Card').length, 0);
    assert.equal(s.byId(view, 'search-next-page'), undefined);
    view.flush(() => s.byId(view, 'search-reset').props.onPress());
    assert.equal(s.byId(view, 'recipe-search-input').props.value, '');
    assert.equal(s.result().search, '');
    assert.equal(s.result().cuisineUuid, '');
    assert.equal(s.result().page, 1);
    assert.equal(s.byId(view, 'search-reset'), undefined);
  } finally {
    view.unmount();
  }
});
