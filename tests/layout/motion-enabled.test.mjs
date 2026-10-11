import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h, Fragment } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

function setup(initialReducedMotion = false) {
  const appListeners = new Set();
  const motionListeners = new Set();
  const reads = [];
  const subscriptions = { app: 0, motion: 0 };
  let renders = 0;
  const appState = {
    currentState: 'active',
    addEventListener: (_event, listener) => {
      subscriptions.app++;
      appListeners.add(listener);
      return { remove: () => appListeners.delete(listener) };
    },
  };
  const load = createSourceLoader({
    'react-native': {
      AppState: appState,
      AccessibilityInfo: {
        addEventListener: (_event, listener) => {
          subscriptions.motion++;
          motionListeners.add(listener);
          return { remove: () => motionListeners.delete(listener) };
        },
        isReduceMotionEnabled: () =>
          new Promise((resolve, reject) => reads.push({ resolve, reject })),
      },
    },
    'react-native-reanimated': { useReducedMotion: () => initialReducedMotion },
  });
  const { useMotionEnabled } = load('hooks/use-motion-enabled.ts');
  function Consumer({ visible = true }) {
    const enabled = useMotionEnabled(visible);
    renders++;
    return h('Motion', { enabled });
  }
  return {
    Consumer,
    reads,
    subscriptions,
    appListeners,
    motionListeners,
    renders: () => renders,
    app: (state) => {
      appState.currentState = state;
      appListeners.forEach((listener) => listener(state));
    },
    motion: (reduced) => motionListeners.forEach((listener) => listener(reduced)),
    enabled: (view) => view.findAll('Motion').map((node) => node.props.enabled),
  };
}

test('many animation consumers share native subscriptions and ignore duplicate events', async () => {
  const s = setup();
  const view = renderFixture(
    h(
      Fragment,
      null,
      Array.from({ length: 10 }, (_, key) => h(s.Consumer, { key })),
    ),
  );
  try {
    assert.deepEqual(s.subscriptions, { app: 1, motion: 1 });
    assert.equal(s.reads.length, 1);
    s.reads[0].resolve(false);
    await Promise.resolve();
    view.flush(() => {});
    assert.ok(s.enabled(view).every(Boolean));
    const renders = s.renders();
    view.flush(() => {
      s.app('active');
      s.motion(false);
    });
    assert.equal(s.renders(), renders);
    view.flush(() => s.app('background'));
    assert.ok(s.enabled(view).every((enabled) => !enabled));
    view.flush(() => s.app('active'));
    assert.ok(s.enabled(view).every(Boolean));
    view.flush(() => s.motion(true));
    assert.ok(s.enabled(view).every((enabled) => !enabled));
    view.flush(() => s.motion(false));
    assert.ok(s.enabled(view).every(Boolean));
  } finally {
    view.unmount();
  }
  assert.equal(s.appListeners.size, 0);
  assert.equal(s.motionListeners.size, 0);
});

test('a live accessibility event wins over an older async read', async () => {
  const s = setup(true);
  const view = renderFixture(h(s.Consumer));
  try {
    assert.deepEqual(s.enabled(view), [false]);
    view.flush(() => s.motion(true));
    s.reads[0].resolve(false);
    await Promise.resolve();
    view.flush(() => {});
    assert.deepEqual(s.enabled(view), [false]);
    view.flush(() => s.motion(false));
    assert.deepEqual(s.enabled(view), [true]);
  } finally {
    view.unmount();
  }
});

test('hidden consumers allocate no native subscriptions and old reads cannot affect a new session', async () => {
  const s = setup();
  const hidden = renderFixture(h(s.Consumer, { visible: false }));
  assert.deepEqual(s.enabled(hidden), [false]);
  assert.deepEqual(s.subscriptions, { app: 0, motion: 0 });
  assert.equal(s.reads.length, 0);
  const first = renderFixture(h(s.Consumer));
  const second = renderFixture(h(s.Consumer));
  first.unmount();
  assert.equal(s.appListeners.size, 1);
  second.unmount();
  assert.equal(s.appListeners.size, 0);
  s.app('background');
  const next = renderFixture(h(s.Consumer));
  try {
    assert.deepEqual(s.enabled(next), [false]);
    assert.deepEqual(s.subscriptions, { app: 2, motion: 2 });
    next.flush(() => s.app('active'));
    s.reads[0].resolve(true);
    await Promise.resolve();
    next.flush(() => {});
    assert.deepEqual(s.enabled(next), [true]);
    s.reads[1].resolve(true);
    await Promise.resolve();
    next.flush(() => {});
    assert.deepEqual(s.enabled(next), [false]);
  } finally {
    next.unmount();
    hidden.unmount();
  }
  assert.equal(s.motionListeners.size, 0);
});

test('a failed accessibility read keeps the synchronous reduced-motion fallback', async () => {
  const s = setup(true);
  const view = renderFixture(h(s.Consumer));
  try {
    s.reads[0].reject(new Error('native read unavailable'));
    await Promise.resolve();
    await Promise.resolve();
    view.flush(() => {});
    assert.deepEqual(s.enabled(view), [false]);
  } finally {
    view.unmount();
  }
});
