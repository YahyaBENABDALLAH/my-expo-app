import assert from 'node:assert/strict';
import test from 'node:test';
import * as React from 'react';
import { createContext, createElement as h, useContext, useRef, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

function setup(platform = 'ios') {
  const native = (name) => (props) => h(name, props, props.children);
  const dimensions = createContext({ width: 390, height: 844, fontScale: 1 });
  const colors = {
    background: '#fff',
    surface: '#eee',
    surfaceRaised: '#ddd',
    primary: '#008',
    secondary: '#080',
    tint: '#008',
    text: '#111',
    muted: '#666',
    border: '#aaa',
    error: '#a00',
    success: '#080',
    warning: '#a60',
    tabIconSelected: '#008',
  };
  const calls = { geometryFactories: 0, stateHooks: 0, canvases: 0, pathParses: 0, writes: [] };
  const useSharedFixture = (initial) => {
    const ref = useRef(null);
    if (!ref.current) {
      let value = initial;
      ref.current = {
        get: () => value,
        set: (next) => {
          value = typeof next === 'function' ? next(value) : next;
          calls.writes.push(value);
        },
      };
    }
    return ref.current;
  };
  const geometry = (handler) => {
    calls.geometryFactories++;
    return { geometry: handler };
  };
  const frames = { callback: undefined, active: false };
  const frameCallback = { setActive: (active) => (frames.active = active) };
  const mocks = {
    react: {
      ...React,
      useState: (...args) => {
        calls.stateHooks++;
        return useState(...args);
      },
    },
    'react-native': {
      Platform: { OS: platform },
      View: native('View'),
      StyleSheet: { absoluteFill: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 } },
      AccessibilityInfo: {
        isReduceTransparencyEnabled: async () => false,
        addEventListener: () => ({ remove() {} }),
      },
      useWindowDimensions: () => useContext(dimensions),
    },
    '@/hooks/use-color-scheme': { useColorScheme: (scheme) => scheme ?? 'light' },
    '@/hooks/use-theme': { useThemeColors: () => colors, useAppTheme: () => ({ themeId: 'test' }) },
    '@/hooks/use-motion-enabled': { useMotionEnabled: () => false },
    '@/constants/themes/index': {
      themeIds: ['test'],
      themes: { test: { colors: { light: colors, dark: colors } } },
    },
    '@/components/ui/host/universal-host': {
      UniversalHost: native('Host'),
      useHostColorScheme: () => 'light',
      useHostLayoutDirection: () => 'leftToRight',
    },
    '@/components/ui/native/native-fill-width': { nativeFillWidth: [], nativeFillWidthCenter: [] },
    '@/components/ui/text-input/text-input-modifiers': {
      inputFieldAppearance: (style) => ({ style }),
      inputRowFlex: [],
    },
    '@/components/ui/text-input/text-input-icon-button': {
      TextInputIconButton: native('IconButton'),
    },
    '@expo/ui': {
      Column: native('Column'),
      Row: native('Row'),
      RNHostView: native('RNHostView'),
      BottomSheet: native('Sheet'),
      Text: native('Text'),
      TextInput: native('Input'),
      Icon: native('Icon'),
    },
    'expo-blur': { BlurView: native('BlurView') },
    '@expo/ui/community/masked-view': {
      MaskedView: ({ maskElement, children, ...props }) =>
        h('MaskedView', props, h('Mask', null, maskElement), children),
    },
    '@expo/ui/swift-ui': {
      HStack: native('Stack'),
      VStack: native('Column'),
      ZStack: native('Box'),
    },
    '@expo/ui/swift-ui/modifiers': {
      frame: (value) => ({ frame: value }),
      presentationCornerRadius: (value) => ({ presentationCornerRadius: value }),
      onGeometryChange: geometry,
      accessibilityElement: () => ({}),
      accessibilityLabel: () => ({}),
    },
    '@expo/ui/jetpack-compose': {
      Box: native('Box'),
      Column: native('Column'),
      Row: native('Stack'),
    },
    '@expo/ui/jetpack-compose/modifiers': {
      fillMaxWidth: () => ({}),
      height: () => ({}),
      weight: () => ({}),
      semantics: () => ({}),
      testID: () => ({}),
      onSizeChanged: geometry,
    },
    '@shopify/react-native-skia': {
      Canvas: (props) => {
        calls.canvases++;
        return h('Canvas', props, props.children);
      },
      Fill: native('Fill'),
      Shader: native('Shader'),
      Group: native('Group'),
      Path: native('Path'),
      LinearGradient: native('Gradient'),
      vec: (x, y) => ({ x, y }),
      Skia: {
        Color: () => [0, 0, 0, 1],
        RuntimeEffect: { Make: (source) => ({ source }) },
        Path: {
          MakeFromSVGString: (svg) => {
            calls.pathParses++;
            return { svg };
          },
        },
      },
    },
    'react-native-reanimated': {
      useSharedValue: useSharedFixture,
      useDerivedValue: (get) => ({ get }),
      useFrameCallback: (callback) => {
        frames.callback = callback;
        return frameCallback;
      },
      cancelAnimation() {},
      withTiming: (value) => value,
      withRepeat: (value) => value,
      Easing: { linear() {}, cubic() {}, inOut: (easing) => easing },
      ReduceMotion: { Never: 'never' },
    },
    'react-native-worklets': { scheduleOnRN: (callback) => callback() },
    '../../../skia/types': { isPath: (value) => typeof value === 'object' },
  };
  return { load: createSourceLoader(mocks), mocks, dimensions, calls, native, frames };
}

for (const platform of ['ios', 'android']) {
  test(`${platform}: known sheet height is native before measurement and survives presentation changes`, () => {
    const s = setup(platform);
    const { BottomSheet } = s.load('components/ui/bottom-sheet/bottom-sheet.tsx');
    let update;
    function Fixture() {
      const [state, setState] = useState({ isPresented: false, contentHeight: 420 });
      update = setState;
      return h(BottomSheet, { ...state, onDismiss() {} }, h('Content'));
    }
    const view = renderFixture(h(Fixture));
    try {
      const sheet = view.findAll('Sheet')[0];
      const content = view.findAll('Content')[0];
      assert.equal(view.findAll('Column')[0].props.style.height, 420);
      assert.equal(view.findAll('RNHostView').length, 0);
      assert.equal(sheet.props.contentHeight, undefined);
      for (const isPresented of [true, false, true]) {
        view.flush(() => update({ isPresented, contentHeight: 320 }));
        assert.equal(view.findAll('Sheet')[0], sheet);
        assert.equal(view.findAll('Content')[0], content);
        assert.equal(view.findAll('Column')[0].props.style.height, 320);
      }
    } finally {
      view.unmount();
    }
  });
}

for (const platform of ['ios', 'android']) {
  test(`${platform}: repeated stepper geometry does not re-run layout composition and real width changes still resize`, () => {
    const s = setup(platform);
    const { RecipeStepperLayout } = s.load(
      `components/ui/recipe-stepper/recipe-stepper-layout.${platform}.tsx`,
    );
    const view = renderFixture(
      h(RecipeStepperLayout, {
        indicatorHeight: 80,
        steps: [],
        renderArtwork: (width) => h('Artwork', { width }),
      }),
    );
    const report = (width) =>
      view.flush(() =>
        view
          .findAll('Stack')[0]
          .props.modifiers.find((value) => value.geometry)
          .geometry({ width, height: 80 }),
      );
    try {
      report(320);
      assert.equal(view.findAll('Artwork')[0].props.width, 320);
      const before = s.calls.geometryFactories;
      report(320);
      report(320);
      assert.equal(s.calls.geometryFactories, before);
      report(480.5);
      assert.equal(view.findAll('Artwork')[0].props.width, 480.5);
      const resized = s.calls.geometryFactories;
      for (const invalid of [NaN, Infinity, -1]) report(invalid);
      assert.equal(s.calls.geometryFactories, resized);
      report(0);
      assert.equal(view.findAll('Artwork').length, 0);
    } finally {
      view.unmount();
    }
  });
}

test('RN input renders immediately in a constrained Host and retains its native value across width changes', () => {
  const s = setup();
  const { UniversalTextInput } = s.load('components/ui/text-input/universal-text-input.tsx');
  const nativeValue = { value: 'Draft', get: () => 'Draft' };
  let resize;
  function Frame() {
    const [width, setWidth] = useState(undefined);
    resize = setWidth;
    return h(UniversalTextInput, { testID: 'input', value: nativeValue, style: { width } });
  }
  const view = renderFixture(h(Frame));
  try {
    const input = view.findAll('Input')[0];
    assert.ok(input);
    assert.equal(view.findAll('View')[0].props.onLayout, undefined);
    assert.equal(input.props.value, nativeValue);
    view.flush(() => resize(480));
    assert.equal(view.findAll('Input')[0], input);
    assert.equal(view.findAll('Row')[0].props.style.width, 480);
    assert.equal(input.props.value, nativeValue);
  } finally {
    view.unmount();
  }
});

test('Aurora uses only its actual layout; window events and geometry writes do not render React artwork', () => {
  const s = setup();
  const { AuroraBackground } = s.load('components/ui/aurora-background/aurora-background.tsx');
  const content = h(AuroraBackground, { style: { flex: 1 }, animate: false });
  let resizeWindow;
  function Frame() {
    const [size, setSize] = useState({ width: 390, height: 844, fontScale: 1 });
    resizeWindow = setSize;
    return h(s.dimensions.Provider, { value: size }, content);
  }
  const view = renderFixture(h(Frame));
  const report = (width, height) =>
    view.flush(() =>
      view.findAll('View')[0].props.onLayout({ nativeEvent: { layout: { width, height } } }),
    );
  const resolution = () => view.findAll('Shader')[0].props.uniforms.get().resolution;
  try {
    report(320, 240);
    assert.deepEqual(resolution(), [320, 240]);
    const before = s.calls.writes.length;
    report(320, 240);
    assert.equal(s.calls.writes.length, before);
    view.flush(() => resizeWindow({ width: 844, height: 390, fontScale: 1.5 }));
    assert.equal(s.calls.canvases, 1);
    assert.deepEqual(resolution(), [320, 240]);
    report(480, 260);
    assert.deepEqual(resolution(), [480, 260]);
    assert.equal(s.calls.canvases, 1);
    report(0, 0);
    assert.deepEqual(resolution(), [1, 1]);
    report(NaN, Infinity);
    assert.deepEqual(resolution(), [1, 1]);
  } finally {
    view.unmount();
  }
});

for (const scheme of ['light', 'dark']) {
  test(`${scheme}: UX Template flattens Aurora and pauses animation without replacing the canvas`, () => {
    const s = setup();
    const { uxTheme } = s.load('constants/themes/ux.ts');
    s.mocks['@/constants/themes/index'].themeIds.push('ux');
    s.mocks['@/constants/themes/index'].themes.ux = { colors: uxTheme };
    // Capture the forwarded palette without pretending to render Skia colors.
    s.mocks['@shopify/react-native-skia'].Skia.Color = (color) => [color];
    s.mocks['@/components/ui/host/universal-host'].useHostColorScheme = () => scheme;
    s.mocks['@/hooks/use-motion-enabled'].useMotionEnabled = (animate) => animate;
    let selectedTheme;
    let setTheme;
    s.mocks['@/hooks/use-theme'].useAppTheme = () => ({ themeId: selectedTheme });
    const { AuroraBackground } = s.load('components/ui/aurora-background/aurora-background.tsx');
    function Frame() {
      const [theme, update] = useState('ux');
      selectedTheme = theme;
      setTheme = update;
      return h(AuroraBackground, { style: { flex: 1 } });
    }
    const view = renderFixture(h(Frame));
    try {
      const canvas = view.findAll('Canvas')[0];
      const uniforms = () => view.findAll('Shader')[0].props.uniforms.get();
      assert.equal(s.frames.active, false);
      assert.equal(uniforms().intensity, 0);
      assert.deepEqual(uniforms().baseColor, uniforms().surfaceColor);
      assert.notDeepEqual(uniforms().primaryColor, uniforms().secondaryColor);
      view.flush(() => setTheme('test'));
      assert.equal(s.frames.active, true);
      assert.ok(uniforms().intensity > 0);
      assert.equal(view.findAll('Canvas')[0], canvas);
      view.flush(() => setTheme('ux'));
      assert.equal(s.frames.active, false);
      assert.equal(uniforms().intensity, 0);
      assert.equal(view.findAll('Canvas')[0], canvas);
    } finally {
      view.unmount();
    }
  });
}

for (const platform of ['android', 'ios']) {
  for (const refreshRate of [60, 120]) {
    test(`${platform}: Aurora preserves elapsed time at ${refreshRate} Hz and resumes without counting paused time`, () => {
      const s = setup(platform);
      s.mocks['@/hooks/use-motion-enabled'].useMotionEnabled = (animate) => animate;
      const { AuroraBackground } = s.load('components/ui/aurora-background/aurora-background.tsx');
      let setPlaying;
      function Frame() {
        const [playing, update] = useState(true);
        setPlaying = update;
        return h(AuroraBackground, { style: { flex: 1 }, animate: playing });
      }
      const view = renderFixture(h(Frame));
      const time = () => view.findAll('Shader')[0].props.uniforms.get().time;
      const frame = (timestamp, timeSincePreviousFrame) => {
        if (s.frames.active) s.frames.callback({ timestamp, timeSincePreviousFrame });
      };
      try {
        assert.equal(s.frames.active, true);
        frame(0, null);
        let updates = 0;
        for (let index = 1; index <= refreshRate; index++) {
          const before = time();
          frame((index * 1000) / refreshRate, 1000 / refreshRate);
          if (time() !== before) updates++;
        }
        assert.ok(Math.abs(time() - 1) < 0.000001, 'Throttling must preserve motion speed.');
        assert.equal(updates, platform === 'android' ? 30 : refreshRate);
        assert.equal(s.calls.canvases, 1, 'Animation must not render the React artwork per frame.');
        view.flush(() => setPlaying(false));
        assert.equal(s.frames.active, false);
        const paused = time();
        frame(5000, 4000);
        assert.equal(time(), paused);
        view.flush(() => setPlaying(true));
        assert.equal(s.frames.active, true);
        frame(10000, null);
        assert.equal(time(), paused, 'Resuming must not jump through time spent paused.');
        frame(10000 + 1000 / 30, 1000 / 30);
        assert.ok(Math.abs(time() - paused - 1 / 30) < 0.000001);
      } finally {
        view.unmount();
      }
      assert.equal(s.frames.active, false, 'Unmounting must stop the frame callback.');
    });
  }
}

test('page wave reuses parsed path objects through resizes, parent updates and repeated draw processing', () => {
  const s = setup();
  const { PageMotionOverlay } = s.load('components/ui/page/page-motion-overlay.tsx');
  const { processPath } = s.load(
    '../node_modules/@shopify/react-native-skia/src/dom/nodes/datatypes/Path.ts',
  );
  let update;
  function Frame() {
    const [value, setValue] = useState(0);
    update = () => setValue(value + 1);
    return h(PageMotionOverlay, { variant: value % 2 ? 'splash' : 'overlay', animate: false });
  }
  const view = renderFixture(h(Frame));
  try {
    const processDraws = () =>
      view
        .findAll('Path')
        .map(({ props }) => processPath(s.mocks['@shopify/react-native-skia'].Skia, props.path));
    processDraws();
    const before = s.calls.pathParses;
    for (let frame = 0; frame < 20; frame++) processDraws();
    assert.equal(s.calls.pathParses, before);
    view.flush(update);
    assert.equal(view.findAll('Path').length, 4);
    processDraws();
    view.flush(() =>
      view.findAll('View')[0].props.onLayout({ nativeEvent: { layout: { width: 260 } } }),
    );
    processDraws();
    assert.equal(s.calls.pathParses, 2);
  } finally {
    view.unmount();
  }
});

for (const platform of ['ios', 'android']) {
  test(`${platform}: the blur mask shares wave geometry, drift and size without reparsing paths`, (t) => {
    const s = setup(platform);
    s.mocks['@/hooks/use-motion-enabled'].useMotionEnabled = (animate) => animate;
    s.mocks['react-native-reanimated'].withRepeat = () => Math.PI / 2;
    const { PageMotionOverlay } = s.load('components/ui/page/page-motion-overlay.tsx');
    const { PageHeaderBackground } = s.load('components/ui/page/page-header-background.tsx');
    const { PageWaveContext } = s.load('components/ui/page/page-wave-context.ts');
    let geometry;
    let toggle;
    function Surface() {
      geometry = useContext(PageWaveContext);
      return h(PageHeaderBackground, { blurTarget: { current: null } });
    }
    function Frame() {
      const [visible, setVisible] = useState(true);
      toggle = setVisible;
      return h(PageMotionOverlay, { visible }, h(Surface));
    }
    const view = renderFixture(h(Frame));
    t.after(() => view.unmount());
    const mask = () => view.findAll('MaskedView')[0];
    const assertGeometry = () => {
      const maskGroup = view.findAll('Mask')[0].props.children.props.children;
      assert.equal(maskGroup.props.transform, geometry.fit);
      const [back, front] = maskGroup.props.children;
      assert.equal(back.props.transform, geometry.backDrift);
      assert.equal(front.props.transform, geometry.frontDrift);
      assert.equal(back.props.children.props.path, geometry.backWave);
      assert.equal(front.props.children.props.path, geometry.frontWave);
      assert.equal(mask().props.style.height, geometry.overlayHeight);
    };
    assertGeometry();
    assert.ok(Math.abs(geometry.frontDrift.get()[0].translateX - 80) < 0.000001);
    assert.ok(Math.abs(geometry.backDrift.get()[0].translateX + 100) < 0.000001);
    const wave = view.findAll('View').find(({ props }) => props.testID === 'page-motion-overlay');
    view.flush(() => wave.props.onLayout({ nativeEvent: { layout: { width: 280 } } }));
    assert.equal(geometry.fit.get()[0].scaleX, 0.28);
    assertGeometry();
    const surface = view.findAll('BlurView')[0];
    view.flush(() => toggle(false));
    assert.equal(view.findAll('MaskedView').length, 0);
    assert.equal(
      view.findAll('View').some(({ props }) => props.testID === 'page-motion-overlay'),
      false,
    );
    view.flush(() => toggle(true));
    assertGeometry();
    assert.notEqual(view.findAll('BlurView')[0], surface);
    assert.equal(s.calls.pathParses, 2);
  });
}

test('login wave fills to the top from 35% and returns to the header with reduced-motion support', () => {
  const s = setup();
  const timings = [];
  let completions = 0;
  let enabled = true;
  s.mocks['@/hooks/use-motion-enabled'].useMotionEnabled = () => enabled;
  s.mocks['react-native-reanimated'].withTiming = (target, config, callback) => {
    timings.push({ target, config, callback });
    return target;
  };
  const { PageMotionOverlay, PAGE_WAVE_HEIGHT } = s.load(
    'components/ui/page/page-motion-overlay.tsx',
  );
  let change;
  function Frame() {
    const [expanded, setExpanded] = useState(true);
    change = setExpanded;
    return h(PageMotionOverlay, { expanded, onCollapseComplete: complete });
  }
  const complete = () => completions++;
  const view = renderFixture(h(Frame));
  const layer = view.findAll('View')[0];
  const offset = () => view.findAll('Group')[0].props.transform.get()[1].translateY;
  try {
    const canvas = view.findAll('Canvas')[0];
    assert.equal(offset() + PAGE_WAVE_HEIGHT / 2, 844 * 0.35);
    assert.equal(layer.props.style.height, offset() + PAGE_WAVE_HEIGHT);
    assert.ok(view.findAll('Path').every(({ props }) => props.path.svg.startsWith('M -500 -844')));
    assert.equal(view.findAll('Gradient')[0].props.start.get().y, -offset());
    assert.equal(layer.props.pointerEvents, 'none');
    view.flush(() => change(false));
    assert.equal(offset(), 0);
    const collapse = timings.find(({ target, config }) => target === 0 && config.duration === 1000);
    assert.ok(collapse);
    assert.equal(completions, 0, 'Navigation waits for the animation callback.');
    view.flush(() => collapse.callback(false));
    assert.equal(completions, 0, 'Cancelled animations cannot release navigation.');
    view.flush(() => collapse.callback(true));
    assert.equal(completions, 1);
    assert.equal(view.findAll('Canvas')[0], canvas);
    const before = timings.length;
    view.flush(() => {
      enabled = false;
      change(true);
    });
    assert.equal(offset() + PAGE_WAVE_HEIGHT / 2, 844 * 0.35);
    assert.equal(timings.length, before);
    view.flush(() => change(false));
    assert.equal(completions, 2, 'Reduced motion releases navigation immediately.');
    assert.equal(s.calls.pathParses, 2);
  } finally {
    view.unmount();
  }
});
