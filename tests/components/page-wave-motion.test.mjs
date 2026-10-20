import assert from 'node:assert/strict';
import test from 'node:test';
import { createContext, createElement as h, useContext, useMemo, useRef, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

function setup(initialDirection = 'ltr') {
  const State = createContext({ direction: initialDirection, active: true });
  const callbacks = new Set();
  let motion,
    update,
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
      withTiming: (value) => value,
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
    motion = usePageWaveMotion({ animate: true, expanded: false, splash: false });
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
    update: (changes) => view.flush(() => update(changes)),
    tick: (elapsed) =>
      callbacks.forEach((callback) => callback({ timeSincePreviousFrame: elapsed })),
    unmount: view.unmount,
  };
}

const close = (actual, expected) =>
  assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} should equal ${expected}`);
const x = (drift) => drift.get()[0].translateX;
const y = (drift) => drift.get()[1].translateY;

for (const hz of [60, 120]) {
  test(`${hz} Hz: the 8-second wave cycle has half the travel and RTL reverses both layers`, (t) => {
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
    close(y(ltr.motion.frontDrift), 2);
    close(y(ltr.motion.backDrift), -3);
    close(x(rtl.motion.frontDrift), -x(ltr.motion.frontDrift));
    close(x(rtl.motion.backDrift), -x(ltr.motion.backDrift));
    close(y(rtl.motion.frontDrift), y(ltr.motion.frontDrift));
    assert.equal(ltr.renders, initialRenders, 'Frame callbacks must not render React.');
    assert.equal(ltr.parses, 2, 'Paths stay cached while transforms animate.');
    assert.equal(ltr.height, 200);
    assert.equal(ltr.motion.frontWave.svg, ltr.motion.frontSvg);
    assert.equal(ltr.motion.backWave.svg, ltr.motion.backSvg);
  });
}

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
