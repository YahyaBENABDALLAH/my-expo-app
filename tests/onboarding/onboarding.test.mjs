import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

function setup(storage = {}, step) {
  const writes = [];
  const navigation = [];
  const native = (name) => (props) => h(name, props, props.children);
  let hardwareBack;
  const publicUI = {};
  const load = createSourceLoader({
    '@react-native-async-storage/async-storage': {
      getItem: (key) => storage.getItem?.(key) ?? Promise.resolve(storage.value ?? null),
      setItem: async (key, value) => {
        writes.push([key, value]);
        await storage.setItem?.(key, value);
        storage.value = value;
      },
    },
    '@components/ui': publicUI,
    '@expo/ui': {
      Column: native('Column'),
      Row: native('Row'),
      ScrollView: native('ScrollView'),
      RNHostView: native('RNHostView'),
      Spacer: native('Spacer'),
      LoadingContent: native('Loading'),
      PageFrame: native('PageFrame'),
      UniversalHost: native('Host'),
      UniversalTextContent: native('Text'),
      UniversalButtonContent: native('Button'),
      nativeFillWidth: [],
      nativeRowWeight: [],
    },
    '@assets/images/recipe-examples/salad.jpg': 1,
    '@assets/images/recipe-examples/pasta.jpg': 2,
    '@assets/images/recipe-examples/breakfast.jpg': 3,
    'expo-image': { Image: native('Image') },
    '@/components/ui/host/universal-host': {
      UniversalHost: native('Host'),
      useHostColorScheme: (scheme) => scheme ?? 'light',
    },
    '@/components/ui/button/universal-button-content': { UniversalButtonContent: native('Button') },
    '@/components/ui/text/universal-text': { UniversalTextContent: native('Text') },
    '@/components/ui/loading/loading-state': { LoadingContent: native('Loading') },
    '@/components/ui/native/native-fill-width': { nativeFillWidth: [], nativeRowWeight: [] },
    '@/components/ui/onboarding/onboarding-pager': { OnboardingPager: native('Pager') },
    '@/context/language.context': { useLanguage: () => ({ language: storage.language ?? 'en' }) },
    '@/context/layout-direction.context': { useLayoutDirection: () => storage.direction ?? 'ltr' },
    'react-native': {
      BackHandler: {
        addEventListener: (_event, handler) => {
          hardwareBack = handler;
          return { remove: () => {} };
        },
      },
      View: native('View'),
      Platform: { OS: storage.platform ?? 'android' },
      useWindowDimensions: () => storage.dimensions ?? { width: 390, height: 844, fontScale: 1 },
    },
    'react-native-reanimated': { useReducedMotion: () => storage.reducedMotion ?? false },
    'react-native-safe-area-context': {
      useSafeAreaInsets: () => ({ top: 59, bottom: 34, left: 0, right: 0 }),
    },
    '@/hooks/use-color-scheme': { useColorScheme: () => 'light' },
    '@/hooks/use-theme': { useThemeColors: () => ({}) },
    'expo-router': {
      router: {
        navigate: (href) => navigation.push(['navigate', href]),
        replace: (href) => navigation.push(['replace', href]),
        canGoBack: () => storage.canGoBack ?? true,
        back: () => navigation.push(['back']),
      },
    },
  });
  publicUI.OnboardingPage = load('components/ui/onboarding/onboarding-page.tsx').OnboardingPage;
  const { OnboardingProvider, useOnboarding } = load('context/onboarding.context.tsx');
  const Screen =
    step === undefined ? null : load('features/onboarding/onboarding-screen.tsx').OnboardingScreen;
  let context;
  function Consumer() {
    context = useOnboarding();
    return Screen ? h(Screen) : null;
  }
  const view = renderFixture(h(OnboardingProvider, null, h(Consumer)));
  const button = (id) => view.findAll('Button').find(({ props }) => props.testID === id).props;
  for (let index = 0; index < (step ?? 0); index++)
    view.flush(() => button('onboarding-next').onPress());
  return {
    view,
    writes,
    navigation,
    hardwareBack: () => hardwareBack(),
    context: () => context,
    flushAsync: async () => {
      await new Promise(setImmediate);
      view.flush(() => {});
    },
    button,
    pager: () => view.findAll('Pager')[0].props,
    progress: () =>
      view.findAll('Text').find(({ props }) => props.testID === 'onboarding-progress').children[0]
        .text,
  };
}

test('first launch waits for storage; completion persists across later launches', async () => {
  let finishRead;
  const storage = {
    getItem: () =>
      new Promise((resolve) => {
        finishRead = resolve;
      }),
  };
  const s = setup(storage);
  try {
    assert.equal(s.context().ready, false);
    await s.context().complete();
    assert.equal(s.writes.length, 0, 'Cannot overwrite a preference that has not restored.');
    finishRead(null);
    await s.flushAsync();
    assert.equal(s.context().ready, true);
    assert.equal(s.context().completed, false);
    await s.context().complete();
    await s.flushAsync();
    assert.equal(s.context().completed, true);
    assert.deepEqual(s.writes, [['onboardingCompleted', 'true']]);
  } finally {
    s.view.unmount();
  }
  const restored = setup({ value: storage.value });
  try {
    await restored.flushAsync();
    assert.equal(restored.context().completed, true);
    await restored.context().complete();
    assert.equal(restored.writes.length, 0);
  } finally {
    restored.view.unmount();
  }
});

test('read failures leave startup usable; failed completion stays on onboarding and can be retried', async () => {
  let rejectWrite = true;
  const s = setup(
    {
      getItem: async () => {
        throw new Error('Read unavailable');
      },
      setItem: async () => {
        if (rejectWrite) throw new Error('Write unavailable');
      },
    },
    2,
  );
  try {
    await s.flushAsync();
    assert.equal(s.context().ready, true);
    s.view.flush(() => s.button('onboarding-start').onPress());
    await s.flushAsync();
    assert.equal(s.context().completed, false);
    assert.equal(s.context().saving, false);
    assert.equal(s.context().saveError, true);
    assert.equal(
      s.view.findAll('Text').find(({ props }) => props.testID === 'onboarding-save-error')
        .children[0].text,
      'We couldn’t save your progress. Please try again.',
    );
    rejectWrite = false;
    s.view.flush(() => s.button('onboarding-start').onPress());
    await s.flushAsync();
    assert.equal(s.context().completed, true);
    assert.equal(s.context().saveError, false);
  } finally {
    s.view.unmount();
  }
});

test('rapid skip/start taps save once and cannot finish before the write succeeds', async () => {
  let finishWrite;
  const s = setup(
    {
      setItem: () =>
        new Promise((resolve) => {
          finishWrite = resolve;
        }),
    },
    2,
  );
  try {
    await s.flushAsync();
    s.view.flush(() => {
      s.button('onboarding-skip').onPress();
      s.button('onboarding-start').onPress();
      s.button('onboarding-skip').onPress();
    });
    assert.equal(s.writes.length, 1);
    assert.equal(s.context().completed, false);
    assert.equal(s.context().saving, true);
    for (const id of ['onboarding-skip', 'onboarding-start', 'onboarding-back'])
      assert.equal(s.button(id).disabled, true);
    finishWrite();
    await s.flushAsync();
    assert.equal(s.context().completed, true);
  } finally {
    s.view.unmount();
  }
});

for (const step of [0, 1, 2]) {
  test(`step ${step + 1} stays in the carousel, shows progress, and can be skipped`, async () => {
    const s = setup({}, step);
    try {
      await s.flushAsync();
      assert.equal(s.progress(), `${step + 1} of 3`);
      assert.equal(s.button('onboarding-back').disabled, step === 0);
      if (step < 2) {
        assert.equal(s.button('onboarding-next').label, 'Next');
        s.view.flush(() => s.button('onboarding-next').onPress());
        assert.equal(s.progress(), `${step + 2} of 3`);
        assert.equal(s.writes.length, 0);
      } else {
        assert.equal(s.button('onboarding-start').label, 'Let’s get started');
      }
      if (step > 0) {
        const previousStep = s.pager().step;
        s.view.flush(() => s.button('onboarding-back').onPress());
        assert.equal(s.pager().step, previousStep - 1);
      }
      assert.deepEqual(s.navigation, [], 'Steps never navigate to another route.');
      s.view.flush(() => s.button('onboarding-skip').onPress());
      await s.flushAsync();
      assert.equal(s.context().completed, true);
      assert.deepEqual(s.writes, [['onboardingCompleted', 'true']]);
    } finally {
      s.view.unmount();
    }
  });
}

test('Next, Previous, and native swipes keep the screen, header, footer, and pager mounted', async () => {
  const s = setup({}, 0);
  try {
    await s.flushAsync();
    const screen = s.view.findAll('View')[0];
    const header = s.view.findAll('Host').find(({ props }) => props.testID === 'onboarding-header');
    const footer = s.view.findAll('Host').find(({ props }) => props.testID === 'onboarding-footer');
    const pager = s.view.findAll('Pager')[0];
    for (const [action, expected] of [
      [() => s.button('onboarding-next').onPress(), 1],
      [() => s.pager().onStepChange(2), 2],
      [() => s.button('onboarding-back').onPress(), 1],
      [() => s.pager().onStepChange(0), 0],
    ]) {
      s.view.flush(action);
      assert.equal(s.pager().step, expected);
      assert.equal(s.view.findAll('View')[0], screen);
      assert.equal(
        s.view.findAll('Host').find(({ props }) => props.testID === 'onboarding-header'),
        header,
      );
      assert.equal(
        s.view.findAll('Host').find(({ props }) => props.testID === 'onboarding-footer'),
        footer,
      );
      assert.equal(s.view.findAll('Pager')[0], pager);
      assert.equal(s.writes.length, 0);
    }
    assert.deepEqual(s.navigation, []);
  } finally {
    s.view.unmount();
  }
});

test('the native pager receives all three passive bundled photos together', async () => {
  const s = setup({}, 0);
  try {
    await s.flushAsync();
    const photos = s.view.findAll('Image');
    assert.deepEqual(
      photos.map(({ props }) => props.source),
      [1, 2, 3],
    );
    for (const { props } of photos) {
      assert.equal(props.pointerEvents, 'none');
      assert.equal(props.accessible, false);
    }
    assert.equal(s.view.findAll('View')[0].props.testID, 'onboarding-discover');
  } finally {
    s.view.unmount();
  }
});

test('swiping to the final slide does not complete onboarding; invalid selections are ignored', async () => {
  const s = setup({}, 0);
  try {
    await s.flushAsync();
    s.view.flush(() => s.pager().onStepChange(2));
    assert.equal(s.progress(), '3 of 3');
    assert.equal(s.context().completed, false);
    assert.equal(s.writes.length, 0);
    for (const invalid of [-1, 3, NaN, 0.5]) {
      s.view.flush(() => s.pager().onStepChange(invalid));
      assert.equal(s.pager().step, 2);
    }
    s.view.flush(() => s.button('onboarding-start').onPress());
    await s.flushAsync();
    assert.equal(s.context().completed, true);
  } finally {
    s.view.unmount();
  }
});

test('pending persistence disables the pager and ignores stale button, swipe, and hardware Back callbacks', async () => {
  let finishWrite;
  const s = setup(
    {
      setItem: () =>
        new Promise((resolve) => {
          finishWrite = resolve;
        }),
    },
    2,
  );
  try {
    await s.flushAsync();
    s.view.flush(() => s.button('onboarding-start').onPress());
    assert.equal(s.pager().disabled, true);
    s.view.flush(() => {
      s.pager().onStepChange(1);
      s.button('onboarding-back').onPress();
      s.button('onboarding-skip').onPress();
      s.button('onboarding-start').onPress();
      assert.equal(s.hardwareBack(), true);
    });
    assert.equal(s.pager().step, 2);
    assert.equal(s.writes.length, 1);
    finishWrite();
    await s.flushAsync();
    assert.equal(s.context().completed, true);
  } finally {
    s.view.unmount();
  }
});

test('Android hardware Back moves to the previous slide before allowing exit from the first slide', async () => {
  const s = setup({}, 2);
  try {
    await s.flushAsync();
    for (const expected of [1, 0]) {
      s.view.flush(() => assert.equal(s.hardwareBack(), true));
      assert.equal(s.pager().step, expected);
    }
    assert.equal(s.hardwareBack(), false);
    assert.deepEqual(s.navigation, []);
  } finally {
    s.view.unmount();
  }
});

test('compact screens and enlarged text keep the primary action outside the swipeable content', async () => {
  const s = setup(
    { dimensions: { width: 360, height: 640, fontScale: 1.6 }, reducedMotion: true },
    0,
  );
  try {
    await s.flushAsync();
    const hosts = s.view.findAll('Host');
    assert.equal(hosts.length, 3);
    const contains = (node, testID) =>
      node.props?.testID === testID || node.children.some((child) => contains(child, testID));
    assert.equal(contains(hosts[1], 'onboarding-next'), false);
    assert.equal(contains(hosts[2], 'onboarding-next'), true);
    assert.equal(s.button('onboarding-next').fullWidth, true);
    assert.equal(s.pager().reducedMotion, true);
  } finally {
    s.view.unmount();
  }
});
