import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h, Fragment, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

// Real screen, placeholder and pulse hooks; native views and API transport are boundaries.
// These fixtures verify lifecycle and React work, not Android drawing or FPS.
function setup(recipeQuery) {
  const native = (name) => (props) => h(name, props, props.children);
  const FieldGroup = native('FieldGroup');
  FieldGroup.Section = native('FieldSection');
  FieldGroup.SectionFooter = native('FieldFooter');
  const colors = { surface: '#ffffff', border: '#cccccc' };
  let setFocused;
  let queryReads = 0;
  let motionReads = 0;
  let shapeRenders = 0;
  let setMotion;
  let setRecipes;
  const destinations = [];
  const ui = {
    Column: (props) => {
      if (props.modifiers?.[0]?.skeleton) shapeRenders++;
      return h('Column', props, props.children);
    },
    Row: native('Row'),
    FieldGroup,
    List: native('List'),
    ListItem: native('ListItem'),
    ScrollView: native('ScrollView'),
    PageScreen: native('PageScreen'),
    UniversalButtonContent: native('Button'),
    UniversalTextContent: native('Text'),
    QueryContent: native('QueryContent'),
    RecipeCard: native('RecipeCard'),
    Switch: native('Switch'),
    nativeFillWidth: [],
    nativeRowWeight: [],
    useHostColorScheme: () => 'light',
  };
  const load = createSourceLoader({
    '@components/ui': ui,
    '@expo/ui': { Column: ui.Column },
    '@/hooks/use-theme': { useThemeColors: () => colors },
    '@/hooks/use-motion-enabled': {
      useMotionEnabled: (animate = true) => {
        motionReads++;
        const [allowed, update] = useState(true);
        setMotion = update;
        return animate && allowed;
      },
    },
    'react-native-reanimated': {
      createAnimatedComponent: (component) => component,
      cubicBezier: (...points) => points,
    },
    '@/components/ui/host/universal-host': {
      UniversalHost: native('Host'),
      useHostColorScheme: ui.useHostColorScheme,
    },
    '@/components/ui/skeleton/skeleton-modifiers': {
      skeletonModifiers: (style) => [{ ...style, skeleton: true }],
    },
    'expo-router': {
      router: { push: (href) => destinations.push(href), navigate() {} },
      useIsFocused: () => {
        const [focused, update] = useState(true);
        setFocused = update;
        return focused;
      },
    },
    '@tanstack/react-query': {
      useQuery: ({ queryKey }) => {
        queryReads++;
        const recipe = queryKey[0] === 'recipes';
        const [result, update] = useState(
          recipe && recipeQuery
            ? recipeQuery
            : {
                data: { data: recipe ? [{ uuid: 'recipe-1' }] : [] },
                isFetching: false,
                fetchStatus: 'idle',
              },
        );
        if (recipe) setRecipes = update;
        return result;
      },
    },
    '@/hooks/use-screen-refresh': { useScreenRefresh: () => async () => {} },
    '@/features/recipes/home-card-examples': { HomeCardExamples: native('FoodExamples') },
    '@/features/recipes/queries': {
      lookupLabel: (item) => item.name,
      lookupOptions: () => ({ queryKey: ['categories'] }),
      recipeListOptions: () => ({ queryKey: ['recipes'] }),
    },
  });
  Object.assign(ui, load('components/ui/skeleton/skeleton.tsx'));
  return {
    ...ui,
    HomeExamplesScreen: load('features/ui-showcase/home-examples-screen.tsx').default,
    focus: (focused) => setFocused(focused),
    queryReads: () => queryReads,
    motionReads: () => motionReads,
    shapeRenders: () => shapeRenders,
    motion: (enabled) => setMotion(enabled),
    recipes: (result) => setRecipes(result),
    destinations,
    placeholders: (view) =>
      view.findAll('Column').filter((node) => node.props.modifiers?.[0]?.skeleton),
    preview: (view) =>
      view.findAll('Column').filter((node) => node.props.testID === 'home-skeleton-preview'),
  };
}

test('showcase static placeholders expire without resetting controls or making API reads', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] });
  const intervals = t.mock.method(globalThis, 'setInterval');
  const s = setup();
  const view = renderFixture(h(s.HomeExamplesScreen));
  try {
    const quickMeals = () =>
      view.findAll('Switch').find((node) => node.props.testID === 'home-quick-meals-switch');
    view.flush(() => quickMeals().props.onValueChange(false));
    const initialQueryReads = s.queryReads();
    assert.ok(s.placeholders(view).length > 0);
    assert.equal(s.motionReads(), 0);
    assert.equal(intervals.mock.calls.length, 0);
    view.flush(() => t.mock.timers.tick(9_999));
    assert.equal(s.preview(view).length, 1);
    view.flush(() => t.mock.timers.tick(1));
    assert.equal(s.preview(view).length, 0);
    assert.equal(s.placeholders(view).length, 0);
    assert.equal(s.queryReads(), initialQueryReads);
    assert.equal(quickMeals().props.value, false);
    assert.equal(s.queryReads(), 0);
  } finally {
    view.unmount();
  }
});

test('standalone CSS skeletons avoid pulse timers and React work between lifecycle changes', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] });
  const intervals = t.mock.method(globalThis, 'setInterval');
  const s = setup();
  const view = renderFixture(
    h(s.Skeleton, { testID: 'css-skeleton', style: { width: 160, height: 28, opacity: 0.35 } }),
  );
  try {
    const host = () => view.findAll('Host')[0].props;
    const shape = () => s.placeholders(view)[0].props.modifiers[0];
    assert.equal(view.findAll('Host').length, 1);
    assert.equal(host().inline, true);
    assert.equal(host().pointerEvents, 'none');
    assert.equal(host().importantForAccessibility, 'no-hide-descendants');
    assert.equal(host().style.animationIterationCount, 'infinite');
    assert.equal(host().style.animationDuration, 900);
    assert.equal(shape().width, 160);
    assert.equal(shape().height, 28);
    assert.equal(shape().opacity, 0.35);
    assert.equal(shape().animationDuration, undefined);
    const renders = s.shapeRenders();
    view.flush(() => t.mock.timers.tick(9_000));
    assert.equal(s.shapeRenders(), renders);
    assert.equal(intervals.mock.calls.length, 0);
    view.flush(() => s.motion(false));
    assert.equal(host().style.animationName, undefined);
    assert.equal(host().style.opacity, 1);
    assert.equal(shape().opacity, 0.35);
    view.flush(() => s.motion(true));
    assert.equal(host().style.animationIterationCount, 'infinite');
    assert.equal(intervals.mock.calls.length, 0);
  } finally {
    view.unmount();
  }
});

test('static standalone skeletons bypass motion and retain flexible native sizing', () => {
  const s = setup();
  const view = renderFixture(
    h(s.Skeleton, { animate: false, style: { width: '100%', opacity: 0 } }),
  );
  try {
    assert.equal(s.motionReads(), 0);
    assert.equal(view.findAll('Host')[0].props.inline, false);
    assert.equal(view.findAll('Host')[0].props.style.animationName, undefined);
    assert.equal(s.placeholders(view)[0].props.modifiers[0].width, undefined);
    assert.equal(s.placeholders(view)[0].props.modifiers[0].opacity, 0);
  } finally {
    view.unmount();
  }
});

test('showcase control updates do not restart an expired preview', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] });
  const s = setup();
  const view = renderFixture(h(s.HomeExamplesScreen));
  try {
    view.flush(() => t.mock.timers.tick(10_000));
    assert.equal(s.preview(view).length, 0);
    view.flush(() => view.findAll('Switch')[0].props.onValueChange(true));
    view.flush(() => t.mock.timers.tick(10_000));
    assert.equal(s.preview(view).length, 0);
    assert.equal(s.motionReads(), 0);
  } finally {
    view.unmount();
  }
});

test('leaving the showcase cancels its pending preview timeout', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] });
  const timeouts = t.mock.method(globalThis, 'setTimeout');
  const clear = t.mock.method(globalThis, 'clearTimeout');
  const s = setup();
  const view = renderFixture(h(s.HomeExamplesScreen));
  const timeout = timeouts.mock.calls.find((call) => call.arguments[1] === 10_000);
  assert.ok(timeout);
  view.flush(() => t.mock.timers.tick(5_000));
  view.unmount();
  assert.ok(clear.mock.calls.some((call) => call.arguments[0] === timeout.result));
  t.mock.timers.tick(10_000);
  assert.equal(s.placeholders(view).length, 0);
});

// The former live-query Home cases are covered by the placeholder catalog suite now.

test('animated skeletons retain one shared pulse clock and pausing releases it', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] });
  const intervals = t.mock.method(globalThis, 'setInterval');
  const clear = t.mock.method(globalThis, 'clearInterval');
  const s = setup();
  let setAnimate;
  function Preview() {
    const [animate, update] = useState(undefined);
    setAnimate = update;
    return h(
      Fragment,
      null,
      [0, 1].map((key) => h(s.SkeletonContent, { key, animate, style: { opacity: 0.5 } })),
    );
  }
  const view = renderFixture(h(Preview));
  try {
    assert.equal(intervals.mock.calls.length, 1);
    const opacity = () => s.placeholders(view).map((node) => node.props.modifiers[0].opacity);
    assert.deepEqual(opacity(), [0.5, 0.5]);
    view.flush(() => t.mock.timers.tick(900));
    assert.deepEqual(opacity(), [0.225, 0.225]);
    view.flush(() => setAnimate(false));
    const pausedMotionReads = s.motionReads();
    assert.deepEqual(opacity(), [0.5, 0.5]);
    assert.equal(clear.mock.calls.length, 1);
    view.flush(() => t.mock.timers.tick(2_700));
    assert.deepEqual(opacity(), [0.5, 0.5]);
    assert.equal(s.motionReads(), pausedMotionReads);
    view.flush(() => setAnimate(true));
    assert.equal(intervals.mock.calls.length, 2);
    view.flush(() => t.mock.timers.tick(900));
    assert.deepEqual(opacity(), [0.225, 0.225]);
  } finally {
    view.unmount();
  }
  assert.equal(clear.mock.calls.length, 2);
});
