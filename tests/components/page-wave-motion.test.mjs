import assert from 'node:assert/strict';
import test from 'node:test';
import { createContext, createElement as h, useContext, useMemo, useRef, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

function setup(initialDirection = 'ltr', { overlay = false, ...options } = {}) {
  const State = createContext({ direction: initialDirection, active: true });
  const callbacks = new Set();
  let motion,
    update,
    completeTiming,
    renders = 0,
    parses = 0;
  const load = createSourceLoader({
    'react-native': {
      View: 'View',
      useWindowDimensions: () => ({ width: 390, height: 844 }),
    },
    '@/hooks/use-color-scheme': { useColorScheme: () => 'light' },
    '@/hooks/use-theme': {
      useThemeColors: () => ({
        tint: '#246BFD',
        tabIconSelected: '#246BFD',
        background: '#FFFFFF',
      }),
    },
    '@/context/layout-direction.context': { useLayoutDirection: () => useContext(State).direction },
    '@/hooks/use-motion-enabled': {
      useMotionEnabled: (animate) => {
        const { active } = useContext(State);
        return animate && active;
      },
    },
    '@shopify/react-native-skia': {
      BlurMask: 'BlurMask',
      usePathValue(callback) {
        const latest = useRef(callback);
        latest.current = callback;
        return useMemo(
          () => ({
            get() {
              const commands = [];
              let svg;
              const builder = {
                moveTo: (...values) => commands.push(['M', ...values]),
                lineTo: (...values) => commands.push(['L', ...values]),
                cubicTo: (...values) => commands.push(['C', ...values]),
                close: () => commands.push(['Z']),
                addPath: (path) => {
                  svg = path.svg;
                },
              };
              latest.current(builder);
              return { commands, svg };
            },
          }),
          [],
        );
      },
      Canvas: 'Canvas',
      Group: 'Group',
      Path: 'Path',
      LinearGradient: 'LinearGradient',
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
  const { PageMotionOverlay } = load('components/ui/page/page-motion-overlay.tsx');
  const { PageWaveContext } = load('components/ui/page/page-wave-context.ts');
  function ReadOverlayMotion() {
    renders++;
    motion = useContext(PageWaveContext);
    return null;
  }
  function Wave() {
    const state = useContext(State);
    if (overlay) {
      return h(PageMotionOverlay, { ...options, ...state }, h(ReadOverlayMotion));
    }
    return h(ReadHookMotion);
  }
  function ReadHookMotion() {
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
    ...load('components/ui/page/page-header-shapes.ts'),
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
const shapes = ['waves', 'ribbon', 'dunes', 'smoke', 'water', 'rain'];
const svg = (s, layer = 0) => (layer === 0 ? s.motion.frontSvg : s.motion.backSvg).get();
const expected = (s, shape, time, layer = 0, height = 80) =>
  s.vectorPathToSvg(s.headerContour(shape, time, layer, -844 / (height / 100)));

for (const hz of [60, 120]) {
  test(`${hz} Hz: all shapes deform their control points on the UI clock without React renders or SVG parsing`, (t) => {
    const s = setup('ltr', { overlay: true, shape: 'waves' });
    t.after(() => s.unmount());
    const renders = s.renders;
    const path = s.motion.frontWave;
    const before = svg(s);
    for (let index = 0; index < hz * 2; index++) s.tick(1000 / hz);
    assert.notEqual(svg(s), before);
    for (const shape of shapes) {
      s.update({ shape });
      assert.equal(svg(s), expected(s, shape, 2));
      assert.equal(svg(s, 1), expected(s, shape, 2, 1));
      assert.equal(s.vectorPathToSvg(s.motion.frontWave.get().commands), expected(s, shape, 2));
    }
    // Only the six deliberate prop changes render the overlay's context consumer.
    assert.equal(s.renders, renders + shapes.length);
    assert.equal(s.motion.frontWave, path, 'Keep the UI-thread path value mounted.');
    assert.equal(s.parses, 0, 'Header paths use numeric builders, never per-frame SVG parsing.');
  });
}

test('every contour retains the protected title band, stays inside the header and loops without a seam', (t) => {
  const s = setup();
  t.after(() => s.unmount());
  for (const shape of shapes) {
    for (const layer of [0, 1]) {
      for (let time = 0; time < 120; time += 0.5) {
        const commands = s.headerContour(shape, time, layer, -1055);
        assert.deepEqual(commands.slice(0, 2), [
          ['M', -100, 100],
          ['L', 400, 100],
        ]);
        assert.equal(commands[2][2], 100, 'The curve leaves the junction horizontally.');
        for (const command of commands.filter((c) => c[0] === 'C')) {
          for (let i = 1; i < command.length; i += 2) {
            assert.ok(command[i] >= 400 && command[i + 1] >= 0 && command[i + 1] <= 100);
          }
        }
      }
      assert.equal(expected(s, shape, 0, layer), expected(s, shape, 120, layer));
    }
  }
});

test('control points move independently instead of reproducing a uniform vertical stretch', (t) => {
  const s = setup();
  t.after(() => s.unmount());
  for (const shape of shapes) {
    const start = s.headerContour(shape, 0, 0, -1055).filter((c) => c[0] === 'C');
    const end = s.headerContour(shape, 1, 0, -1055).filter((c) => c[0] === 'C');
    const ratios = start.map((c, i) => (100 - end[i][6]) / (100 - c[6]));
    assert.ok(Math.max(...ratios) - Math.min(...ratios) > 0.01, shape);
  }
});

test('header resizing and RTL retain phase, mirror the artwork and preserve measured content clearance', (t) => {
  const s = setup('ltr', { shape: 'smoke' });
  t.after(() => s.unmount());
  s.motion.width.set(390);
  for (let i = 0; i < 20; i++) s.tick(50);
  for (const height of [115, 163]) {
    s.setHeaderHeight(height);
    assert.equal(s.motion.waveHeight, height);
    assert.equal(s.motion.overlayHeight, height);
    assert.equal(svg(s), expected(s, 'smoke', 1, 0, height));
    for (const direction of ['rtl', 'ltr']) {
      const before = svg(s);
      s.update({ direction });
      assert.equal(svg(s), before);
      const fit = s.motion.fit.get();
      close(fit[0].scaleX * (fit[2].translateX + 400), 390 * (direction === 'rtl' ? 0.6 : 0.4));
      close(fit[3].scaleY, height / 100);
    }
  }
});

test('pause, Reduce Motion and hidden/app-inactive motion guards freeze contours and details; resume excludes paused time', (t) => {
  const s = setup('ltr', { overlay: true, shape: 'rain' });
  t.after(() => s.unmount());
  for (let i = 0; i < 20; i++) s.tick(50);
  const before = svg(s);
  const details = s.motion.detailWave.get().commands;
  s.update({ active: false });
  s.tick(10000);
  assert.equal(svg(s), before);
  assert.deepEqual(s.motion.detailWave.get().commands, details);
  s.update({ active: true });
  s.tick(null);
  assert.equal(svg(s), before);
  s.tick(10000);
  assert.equal(svg(s), expected(s, 'rain', 1.064));
  s.update({ animate: false });
  const paused = svg(s);
  s.tick(5000);
  assert.equal(svg(s), paused);
});

test('expanded Login centers its band; collapse releases bounds and navigation only on completion', (t) => {
  let completions = 0;
  const s = setup('ltr', { expanded: true, onCollapseComplete: () => completions++ });
  t.after(() => s.unmount());
  s.setHeaderHeight(115);
  close(s.motion.fit.get()[1].translateY, 844 * 0.35 - 115 / 2);
  s.update({ expanded: false });
  assert.ok(s.motion.overlayHeight > 115);
  s.finishTiming(false);
  assert.equal(completions, 0);
  s.update({ expanded: true });
  s.update({ expanded: false });
  s.finishTiming(true);
  assert.equal(completions, 1);
  assert.equal(s.motion.overlayHeight, 115);
  s.update({ expanded: true });
  s.update({ expanded: false, active: false });
  close(s.motion.fit.get()[1].translateY, 0);
  assert.equal(s.motion.overlayHeight, 115);
});

test('splash retains its cached artwork, 80-point size and opposite reveal drift', (t) => {
  const s = setup('ltr', { splash: true });
  t.after(() => s.unmount());
  s.setHeaderHeight(163);
  assert.equal(s.motion.waveHeight, 80);
  assert.equal(s.motion.overlayHeight, 80);
  for (let i = 0; i < 40; i++) s.tick(50);
  close(s.motion.fit.get()[3].scaleY, 80 / 210);
  close(s.motion.fit.get()[1].translateY, 80);
  close(s.motion.frontDrift.get()[0].translateX, 40);
  close(s.motion.backDrift.get()[0].translateX, -50);
  assert.equal(s.parses, 2);
  assert.ok(s.motion.frontWave.get().svg.startsWith('M0-204'));
  assert.deepEqual(s.motion.detailWave.get().commands, []);
});

test('switching among all shapes retains the clock; clearing an override restores the shared default', (t) => {
  const s = setup('ltr', { overlay: true });
  const direct = setup();
  t.after(() => {
    s.unmount();
    direct.unmount();
  });
  assert.equal(svg(s), svg(direct));
  for (let i = 0; i < 20; i++) s.tick(50);
  const contours = new Set();
  for (const shape of shapes) {
    s.update({ shape });
    assert.equal(svg(s), expected(s, shape, 1));
    contours.add(svg(s));
  }
  assert.equal(contours.size, 6);
  s.update({ shape: undefined });
  assert.equal(svg(s), expected(s, 'smoke', 1));
});
