import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

function setup(storage = {}, step) {
  const writes = [];
  const navigation = [];
  const native = (name) => (props) => h(name, props, props.children);
  const Icon = native('Icon');
  Icon.select = ({ ios, android }) => {
    assert.equal(typeof android?.then, 'undefined', 'Native icons require a synchronous asset.');
    return storage.platform === 'android' ? android : ios;
  };
  const load = createSourceLoader({
    '@react-native-async-storage/async-storage': {
      getItem: (key) => storage.getItem?.(key) ?? Promise.resolve(storage.value ?? null),
      setItem: async (key, value) => {
        writes.push([key, value]);
        await storage.setItem?.(key, value);
        storage.value = value;
      },
    },
    '@components/ui': {
      Column: native('Column'),
      Row: native('Row'),
      ScrollView: native('ScrollView'),
      Icon,
      LoadingContent: native('Loading'),
      PageFrame: native('PageFrame'),
      UniversalHost: native('Host'),
      UniversalTextContent: native('Text'),
      UniversalButtonContent: native('Button'),
      nativeFillWidth: [],
      nativeRowWeight: [],
    },
    '@expo/material-symbols/restaurant.xml': 1,
    '@expo/material-symbols/menu_book.xml': 2,
    '@expo/material-symbols/bookmark.xml': 3,
    'react-native': { View: native('View') },
    'react-native-safe-area-context': {
      useSafeAreaInsets: () => ({ top: 59, bottom: 34, left: 0, right: 0 }),
    },
    '@/hooks/use-color-scheme': { useColorScheme: () => 'light' },
    '@/hooks/use-theme': { useThemeColors: () => ({}) },
    'expo-router': {
      router: {
        push: (href) => navigation.push(['push', href]),
        replace: (href) => navigation.push(['replace', href]),
        canGoBack: () => storage.canGoBack ?? true,
        back: () => navigation.push(['back']),
      },
    },
  });
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
        `Introduction progress · ${step + 1} / 3`,
      );
      assert.equal(
        s.view.findAll('Button').some(({ props }) => props.testID === 'onboarding-back'),
        step > 0,
      );
      if (step < 2) {
        assert.equal(s.button('onboarding-next').label, 'Next');
        s.view.flush(() => s.button('onboarding-next').onPress());
        assert.deepEqual(s.navigation, [
          ['push', step === 0 ? '/(onboarding)/cook' : '/(onboarding)/save'],
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

test('all three Android pages resolve native icons to their installed XML assets', async () => {
  for (const step of [0, 1, 2]) {
    const s = setup({ platform: 'android' }, step);
    try {
      await s.flushAsync();
      assert.equal(s.view.findAll('Icon')[0].props.name, step + 1);
    } finally {
      s.view.unmount();
    }
  }
});
