import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createApiHarness, deferred } from '../helpers/api-harness.mjs';
import { recipeFixture } from '../helpers/api-fixtures.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

const uuid = '550e8400-e29b-41d4-a716-446655440000';

// Exercise the screen and its real workflow/cache; native rendering and I/O are boundaries.
function setup(write = () => recipeFixture()) {
  const native = (name) => (props) => h(name, props, props.children);
  const Picker = native('Picker');
  Picker.Item = native('PickerItem');
  const navigations = [];
  let action;
  const renders = { page: 0, action: 0 };
  const s = createApiHarness(write, {
    '@components/ui': {
      Column: native('Column'),
      Picker,
      UniversalButtonContent: native('Button'),
      UniversalTextContent: native('Text'),
      RecipeStepper: native('Stepper'),
      PageScreen: (props) => {
        renders.page++;
        return h('Page', props, props.children);
      },
      NativeField: native('Field'),
      QueryContent: native('QueryContent'),
    },
    'expo-router': {
      useIsFocused: () => true,
      router: { push: (destination) => navigations.push(destination) },
    },
    '@/context/auth.context': {
      useAuthContext: () => ({ user: { uuid: 'alice', isChef: true, chefProfileUuid: uuid } }),
    },
    '@/hooks/use-theme': {
      useThemeColors: () => s.load('constants/colors.ts').default.light,
    },
    '@/features/recipes/queries': {
      lookupLabel: (item) => item.name,
      lookupOptions: (kind, page = 1, search = '') => ({
        queryKey: ['lookup', kind, page, search],
        queryFn: async () => ({ data: [{ uuid, name: kind }], meta: { hasNextPage: true } }),
      }),
      chefProfileOptions: (user) => ({ queryKey: ['chef', user], queryFn: async () => null }),
    },
  });
  const { TabActionsProvider, useTabActions } = s.load('features/pages/tab-actions.tsx');
  const Screen = s.load('features/recipes/create-screen.tsx').default;
  function Actions() {
    renders.action++;
    action = useTabActions().actions['create-recipe'];
    return null;
  }
  const view = renderFixture(
    h(
      QueryClientProvider,
      { client: s.client },
      h(TabActionsProvider, null, h(Screen), h(Actions)),
    ),
  );
  const button = (id) => view.findAll('Button').find((node) => node.props.testID === id);
  const field = (id) => view.findAll('Field').find((node) => node.props.testID === id);
  const press = (id) => view.flush(() => button(id).props.onPress());
  const change = (id, value) => view.flush(() => field(id).props.onChange(value));
  const advance = () => press('recipe-continue');
  const previous = () =>
    view.flush(() =>
      view
        .findAll('Button')
        .find((node) => node.props.label === 'Previous step')
        .props.onPress(),
    );
  return {
    ...s,
    view,
    renders,
    navigations,
    button,
    field,
    press,
    change,
    advance,
    previous,
    action: () => action,
    async until(predicate) {
      for (let attempt = 0; attempt < 50; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 5));
        view.flush(() => {});
        if (predicate()) return;
      }
      assert.fail('Workflow did not reach the expected state.');
    },
    close() {
      view.unmount();
      s.client.clear();
    },
  };
}

function fillRecipe(s) {
  s.change('recipe-title', '  Tagine  ');
  s.advance();
  s.view.flush(() => s.view.findAll('Picker')[0].props.onValueChange(uuid));
  s.advance();
  s.press('recipe-add-ingredient');
  s.view.flush(() => s.view.findAll('Picker')[0].props.onValueChange(uuid));
  s.change('ingredient-0-quantity', '1.5');
  s.advance();
  s.press('recipe-add-step');
  s.change('recipe-instruction-1', '  Simmer.  ');
}

test('typing renders the recipe page once and keeps tab actions stable with the latest draft', async () => {
  const s = setup();
  try {
    await s.until(() => Boolean(s.action()));
    const before = { ...s.renders };
    s.change('recipe-title', 'Tagine');
    assert.equal(s.renders.page, before.page + 1);
    assert.equal(s.renders.action, before.action);
    s.change('recipe-summary', 'Family dinner');
    assert.equal(s.renders.page, before.page + 2);
    assert.equal(s.renders.action, before.action);
    s.view.flush(() => s.action().onPress());
    assert.notEqual(s.field('recipe-servings'), undefined);
    s.previous();
    assert.equal(s.field('recipe-title').props.value, 'Tagine');
    assert.equal(s.field('recipe-summary').props.value, 'Family dinner');
  } finally {
    s.close();
  }
});

test('row edits and removals preserve other rows and drafts across recipe steps', async () => {
  const s = setup();
  try {
    fillRecipe(s);
    s.press('recipe-add-step');
    s.change('recipe-instruction-2', 'Serve.');
    s.view.flush(() => {
      s.field('recipe-instruction-1').props.onChange('Cook.');
      s.field('recipe-instruction-2').props.onChange('Plate.');
    });
    s.view.flush(() =>
      s.view
        .findAll('Button')
        .find((node) => node.props.label === 'Remove step')
        .props.onPress(),
    );
    assert.equal(s.field('recipe-instruction-1'), undefined);
    assert.equal(s.field('recipe-instruction-2').props.value, 'Plate.');
    s.previous();
    s.press('recipe-add-ingredient');
    s.view.flush(() => {
      s.field('ingredient-0-quantity').props.onChange('2.5');
      s.field('ingredient-3-quantity').props.onChange('4');
    });
    s.view.flush(() =>
      s.view
        .findAll('Button')
        .find((node) => node.props.label === 'Remove ingredient')
        .props.onPress(),
    );
    assert.equal(s.field('ingredient-0-quantity'), undefined);
    assert.equal(s.field('ingredient-3-quantity').props.value, '4');
    await s.until(() =>
      s.view
        .findAll('Button')
        .some((node) => node.props.label === 'Next ingredients' && !node.props.disabled),
    );
    s.view.flush(() =>
      s.view
        .findAll('Button')
        .find((node) => node.props.label === 'Next ingredients')
        .props.onPress(),
    );
    s.change('ingredient-search', 'Carrot');
    await s.until(
      () => s.client.getQueryState(['lookup', 'Ingredient', 1, 'Carrot'])?.status === 'success',
    );
    assert.equal(s.field('ingredient-3-quantity').props.value, '4');
    s.previous();
    s.previous();
    assert.equal(s.field('recipe-title').props.value, '  Tagine  ');
  } finally {
    s.close();
  }
});

test('publishing blocks duplicate submits, retains failed drafts and navigates after cache maintenance', async (t) => {
  const response = deferred();
  let fail = true;
  const s = setup(async () => {
    await response.promise;
    if (fail) throw new Error('Write failed');
    return recipeFixture({ uuid: 'published-recipe' });
  });
  try {
    fillRecipe(s);
    s.view.flush(() => {
      s.button('recipe-continue').props.onPress();
      s.action().onPress();
    });
    await s.until(() => s.requests.length === 1);
    assert.equal(s.action().disabled, true);
    response.resolve();
    await s.until(() =>
      s.view.findAll('Text').some((node) => node.props.testID === 'recipe-publish-error'),
    );
    assert.equal(s.field('recipe-instruction-1').props.value, '  Simmer.  ');
    assert.deepEqual(s.navigations, []);
    const maintenance = deferred();
    const invalidate = s.client.invalidateQueries.bind(s.client);
    t.mock.method(s.client, 'invalidateQueries', async (...args) => {
      await maintenance.promise;
      return invalidate(...args);
    });
    fail = false;
    s.advance();
    await s.until(() => s.client.getQueryData(['recipes', 'detail', 'published-recipe']));
    assert.deepEqual(s.navigations, [], 'Navigation waits for cache maintenance.');
    assert.equal(s.field('recipe-instruction-1').props.value, '  Simmer.  ');
    maintenance.resolve();
    await s.until(() => s.navigations.length === 1);
    assert.equal(s.requests.length, 2);
    assert.equal(s.requests[1].body.title, 'Tagine');
    assert.deepEqual(s.requests[1].body.ingredients, [
      { ingredientUuid: uuid, quantity: 1.5, unitUuid: null, sortOrder: 0, isOptional: false },
    ]);
    assert.deepEqual(s.requests[1].body.steps, [{ instruction: 'Simmer.', stepNumber: 1 }]);
    assert.ok(s.client.getQueryData(['recipes', 'detail', 'published-recipe']));
    assert.equal(s.field('recipe-title').props.value, '');
    assert.deepEqual(s.navigations, [
      { pathname: '/recipe/[uuid]', params: { uuid: 'published-recipe' } },
    ]);
  } finally {
    s.close();
  }
});
