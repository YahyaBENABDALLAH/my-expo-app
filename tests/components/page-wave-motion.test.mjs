import assert from 'node:assert/strict';
import test from 'node:test';
import { createContext, createElement as h, useContext, useMemo, useRef, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

function setup(initialDirection = 'ltr', options = {}) {
  const State = createContext({ direction: initialDirection, active: true });
  const callbacks = new Set();
  let motion,
    update,
    completeTiming,
    renders = 0,
    parses = 0;
  const load = createSourceLoader({
    'react-native': { useWindowDimensions: () => ({ width: 390, height: 844 }) },
    '@/context/layout-direction.context': { useLayoutDirection: () => useContext(State).direction },
    '@/hooks/use-motion-enabled': {
      useMotionEnabled: (animate) => {
        const { active } = useContext(State);
        return animate && active;
      },
    },
    '@shopify/react-native-skia': {
      vec: (x, y) => ({ x, y }),
      Skia: {
        Path: {
          MakeFromSVGString: (svg) => {
            parses++;
            return { svg };
          },
        },
      },
    },
    'react-native-worklets': { scheduleOnRN: (callback) => callback() },
    'react-native-reanimated': {
      cancelAnimation() {},
      Easing: { cubic: (value) => value, inOut: (easing) => easing },
      ReduceMotion: { Never: 'never' },
      withTiming: (value, _config, complete) => {
        completeTiming = complete;
        return value;
      },
      useSharedValue(initial) {
        const current = useRef(initial);
        return useMemo(() => {
          return {
            get: () => current.current,
            set: (next) => {
              current.current = typeof next === 'function' ? next(current.current) : next;
            },
          };
        }, []);
      },
      useDerivedValue(compute) {
        const latest = useRef(compute);
        latest.current = compute;
        return useMemo(() => ({ get: () => latest.current() }), []);
      },
      useFrameCallback(callback) {
        const latest = useRef(callback);
        latest.current = callback;
        return useMemo(() => {
          const frame = (info) => latest.current(info);
          return {
            setActive: (active) => (active ? callbacks.add(frame) : callbacks.delete(frame)),
          };
        }, []);
      },
    },
  });
  const { usePageWaveMotion, PAGE_WAVE_HEIGHT } = load(
    'components/ui/page/use-page-wave-motion.ts',
  );
  function Wave() {
    renders++;
    const state = useContext(State);
    motion = usePageWaveMotion({
      animate: true,
      expanded: false,
      splash: false,
      ...options,
      ...state,
    });
    return null;
  }
  function App() {
    const [state, setState] = useState({ direction: initialDirection, active: true });
    update = (changes) => setState((previous) => ({ ...previous, ...changes }));
    return h(State.Provider, { value: state }, h(Wave));
  }
  const view = renderFixture(h(App));
  return {
    get motion() {
      return motion;
    },
    get renders() {
      return renders;
    },
    get parses() {
      return parses;
    },
    height: PAGE_WAVE_HEIGHT,
    finishTiming: (finished) => view.flush(() => completeTiming?.(finished)),
    setHeaderHeight: (height) => {
      view.flush(() => motion.setHeaderHeight(height));
      view.flush(() => {});
    },
    update: (changes) => {
      view.flush(() => update(changes));
      view.flush(() => {});
    },
    tick: (elapsed) =>
      callbacks.forEach((callback) => callback({ timeSincePreviousFrame: elapsed })),
    unmount: view.unmount,
  };
}

const close = (actual, expected) =>
  assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} should equal ${expected}`);
const x = (drift) => drift.get()[0].translateX;
const y = (drift) => drift.get()[1].translateY;
const scale = (drift) => drift.get()[2].scaleY;

for (const hz of [60, 120]) {
  test(`${hz} Hz: opposite wave heights keep the leading section anchored through the 8-second cycle`, (t) => {
    const ltr = setup('ltr');
    const rtl = setup('rtl');
    t.after(() => {
      ltr.unmount();
      rtl.unmount();
    });
    const initialRenders = ltr.renders;
    for (let index = 0; index < hz * 2; index++) {
      ltr.tick(1000 / hz);
      rtl.tick(1000 / hz);
    }
    close(x(ltr.motion.frontDrift), 40);
    close(x(ltr.motion.backDrift), -50);
    close(scale(ltr.motion.frontDrift), 1);
    close(scale(ltr.motion.backDrift), 0.6);
    close(y(ltr.motion.frontDrift) + 100 * scale(ltr.motion.frontDrift), 100);
    close(y(ltr.motion.backDrift) + 100 * scale(ltr.motion.backDrift), 100);
    close(x(rtl.motion.frontDrift), -x(ltr.motion.frontDrift));
    close(x(rtl.motion.backDrift), -x(ltr.motion.backDrift));
    close(y(rtl.motion.frontDrift), y(ltr.motion.frontDrift));
    assert.equal(ltr.renders, initialRenders, 'Frame callbacks must not render React.');
    assert.equal(ltr.parses, 2, 'Paths stay cached while transforms animate.');
    assert.equal(ltr.height, 80);
    assert.equal(ltr.motion.frontWave.svg, ltr.motion.frontSvg);
    assert.equal(ltr.motion.backWave.svg, ltr.motion.backSvg);
  });
}

test('header measurements resize both SVGs without restarting phase or changing the fixed leading height', (t) => {
  const s = setup();
  t.after(() => s.unmount());
  for (let index = 0; index < 20; index++) s.tick(50);
  const before = x(s.motion.frontDrift);
  for (const height of [115, 163]) {
    // This is the same setter supplied to the focused PageFrame.
    s.setHeaderHeight(height);
    assert.equal(s.motion.waveHeight, height);
    assert.equal(s.motion.overlayHeight, height, 'Collapsed SVG bounds match the header.');
    close(s.motion.fit.get()[3].scaleY, height / 100);
    close(x(s.motion.frontDrift), before);
  }
  const renders = s.renders;
  const parses = s.parses;
  for (let index = 0; index < 160; index++) {
    s.tick(50);
    for (const drift of [s.motion.frontDrift, s.motion.backDrift]) {
      close(y(drift) + 100 * scale(drift), 100);
      assert.ok(scale(drift) >= 0.6 && scale(drift) <= 1);
    }
    close(scale(s.motion.frontDrift) + scale(s.motion.backDrift), 1.6);
  }
  assert.equal(s.renders, renders);
  assert.equal(s.parses, parses);
});

test('expanded Login centers its band and static mode snaps back to the measured header', async (t) => {
  const s = setup('ltr', { expanded: true });
  t.after(() => s.unmount());
  s.setHeaderHeight(115);
  close(s.motion.fit.get()[1].translateY, 844 * 0.35 - 115 / 2);
  close(s.motion.overlayHeight, 115 + 844 * 0.35 - 115 / 2);
  s.update({ expanded: false, active: false });
  await new Promise((resolve) => setImmediate(resolve));
  close(s.motion.fit.get()[1].translateY, 0);
  assert.equal(s.motion.overlayHeight, 115);
});

test('collapse releases extra SVG bounds and navigation only after successful completion', (t) => {
  let completions = 0;
  const s = setup('ltr', { expanded: true, onCollapseComplete: () => completions++ });
  t.after(() => s.unmount());
  s.setHeaderHeight(115);
  s.update({ expanded: false });
  assert.ok(s.motion.overlayHeight > 115, 'Keep space for the moving edge during collapse.');
  s.finishTiming(false);
  assert.equal(completions, 0, 'Cancellation cannot release navigation.');
  assert.ok(s.motion.overlayHeight > 115);
  s.update({ expanded: true });
  s.update({ expanded: false });
  s.finishTiming(true);
  assert.equal(completions, 1);
  assert.equal(s.motion.overlayHeight, 115);
});

test('splash keeps its original 80-point size and reveal orientation', (t) => {
  const s = setup('ltr', { splash: true });
  t.after(() => s.unmount());
  s.setHeaderHeight(163);
  assert.equal(s.motion.waveHeight, 80);
  assert.equal(s.motion.overlayHeight, 80);
  close(s.motion.fit.get()[3].scaleY, 80 / 210);
  close(s.motion.fit.get()[1].translateY, 80);
  close(scale(s.motion.frontDrift), 1);
  close(scale(s.motion.backDrift), 1);
});

test('changing direction retains phase and cached paths; pause/resume and frame stalls stay bounded', (t) => {
  const s = setup();
  t.after(() => s.unmount());
  for (let index = 0; index < 20; index++) s.tick(50);
  const before = x(s.motion.frontDrift);
  const path = s.motion.frontWave;
  s.update({ direction: 'rtl' });
  close(x(s.motion.frontDrift), -before);
  assert.equal(s.motion.frontWave, path);
  assert.equal(s.parses, 2);
  s.update({ active: false });
  s.tick(10000);
  close(x(s.motion.frontDrift), -before);
  s.update({ active: true });
  s.tick(null);
  close(x(s.motion.frontDrift), -before);
  s.tick(10000);
  close(x(s.motion.frontDrift), -Math.sin((1064 / 8000) * 2 * Math.PI) * 40);
});
