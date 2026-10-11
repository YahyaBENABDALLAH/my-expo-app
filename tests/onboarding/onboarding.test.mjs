import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

function setup(storage = {}, step) {
  const writes = [];
  const navigation = [];
  const native = (name) => (props) => h(name, props, props.children);
  const gestures = [];
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
    '@/context/language.context': { useLanguage: () => ({ language: storage.language ?? 'en' }) },
    '@/context/layout-direction.context': { useLayoutDirection: () => storage.direction ?? 'ltr' },
    'react-native': {
      View: native('View'),
      Platform: { OS: storage.platform ?? 'android' },
      useWindowDimensions: () => storage.dimensions ?? { width: 390, height: 844, fontScale: 1 },
    },
    'react-native-gesture-handler': {
      GestureHandlerRootView: native('GestureRoot'),
      GestureDetector: native('GestureDetector'),
      Gesture: {
        Pan: () => {
          const gesture = {
            enabled(value) {
              this.isEnabled = value;
              return this;
            },
            activeOffsetX() {
              return this;
            },
            failOffsetY() {
              return this;
            },
            runOnJS() {
              return this;
            },
            onEnd(handler) {
              this.end = handler;
              return this;
            },
          };
          gestures.push(gesture);
          return gesture;
        },
      },
    },
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
    return Screen ? h(Screen, { step }) : null;
  }
  const view = renderFixture(h(OnboardingProvider, null, h(Consumer)));
  return {
    view,
    writes,
    navigation,
    gestures,
    context: () => context,
    flushAsync: async () => {
      await new Promise(setImmediate);
      view.flush(() => {});
    },
    button: (id) => view.findAll('Button').find(({ props }) => props.testID === id).props,
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
  test(`page ${step + 1} shows its progress, offers correct navigation, and can be skipped`, async () => {
    const s = setup({}, step);
    try {
      await s.flushAsync();
      assert.equal(
        s.view.findAll('Text').find(({ props }) => props.testID === 'onboarding-progress')
          .children[0].text,
        `${step + 1} of 3`,
      );
      assert.equal(
        s.view.findAll('Button').some(({ props }) => props.testID === 'onboarding-back'),
        step > 0,
      );
      if (step < 2) {
        assert.equal(s.button('onboarding-next').label, 'Next');
        s.view.flush(() => s.button('onboarding-next').onPress());
        assert.deepEqual(s.navigation, [
          ['navigate', step === 0 ? '/(onboarding)/cook' : '/(onboarding)/save'],
        ]);
        assert.equal(s.writes.length, 0);
      } else {
        assert.equal(s.button('onboarding-start').label, 'Let’s get started');
      }
      if (step > 0) {
        s.view.flush(() => s.button('onboarding-back').onPress());
        assert.deepEqual(s.navigation.at(-1), ['back']);
      }
      s.view.flush(() => s.button('onboarding-skip').onPress());
      await s.flushAsync();
      assert.equal(s.context().completed, true);
      assert.deepEqual(s.writes, [['onboardingCompleted', 'true']]);
    } finally {
      s.view.unmount();
    }
  });
}

test('direct entry to a later page has a safe previous-page fallback', async () => {
  for (const step of [1, 2]) {
    const s = setup({ canGoBack: false }, step);
    try {
      await s.flushAsync();
      s.view.flush(() => s.button('onboarding-back').onPress());
      assert.deepEqual(s.navigation, [
        ['replace', step === 1 ? '/(onboarding)/discover' : '/(onboarding)/cook'],
      ]);
    } finally {
      s.view.unmount();
    }
  }
});

test('all three pages display passive bundled photos without a network request', async () => {
  for (const step of [0, 1, 2]) {
    const s = setup({ platform: 'android' }, step);
    try {
      await s.flushAsync();
      const photo = s.view.findAll('Image')[0].props;
      assert.equal(photo.source, step + 1);
      assert.equal(photo.pointerEvents, 'none');
      assert.equal(photo.accessible, false);
    } finally {
      s.view.unmount();
    }
  }
});

for (const direction of ['ltr', 'rtl']) {
  test(`${direction}: deliberate horizontal swipes navigate; small movements and swiping beyond the final page do not complete onboarding`, async () => {
    const forward = direction === 'rtl' ? 120 : -120;
    const s = setup({ direction }, 1);
    try {
      await s.flushAsync();
      s.view.flush(() => s.gestures.at(-1).end({ translationX: forward / 4, velocityX: 0 }));
      assert.equal(s.navigation.length, 0);
      s.view.flush(() => s.gestures.at(-1).end({ translationX: forward, velocityX: 0 }));
      assert.deepEqual(s.navigation.at(-1), ['navigate', '/(onboarding)/save']);
      s.view.flush(() => s.gestures.at(-1).end({ translationX: -forward, velocityX: 0 }));
      assert.deepEqual(s.navigation.at(-1), ['back']);
    } finally {
      s.view.unmount();
    }
    const last = setup({ direction }, 2);
    try {
      await last.flushAsync();
      last.view.flush(() => last.gestures.at(-1).end({ translationX: forward, velocityX: 0 }));
      assert.equal(last.writes.length, 0);
      assert.equal(last.context().completed, false);
    } finally {
      last.view.unmount();
    }
  });
}

test('compact screens and enlarged text keep the primary action outside the scrollable content', async () => {
  const s = setup({ dimensions: { width: 360, height: 640, fontScale: 1.6 } }, 0);
  try {
    await s.flushAsync();
    const hosts = s.view.findAll('Host');
    assert.equal(hosts.length, 3);
    assert.equal(s.view.findAll('Image')[0].props.style.height, 179);
    const contains = (node, testID) =>
      node.props?.testID === testID || node.children.some((child) => contains(child, testID));
    assert.equal(contains(hosts[1], 'onboarding-next'), false);
    assert.equal(contains(hosts[2], 'onboarding-next'), true);
    assert.equal(s.button('onboarding-next').fullWidth, true);
  } finally {
    s.view.unmount();
  }
});
