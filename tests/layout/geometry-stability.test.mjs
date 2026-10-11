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
  const frameCallback = { setActive() {} };
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
    '@/components/ui/native/native-fill-width': { nativeFillWidth: [] },
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
    '@expo/ui/swift-ui': {
      HStack: native('Stack'),
      VStack: native('Column'),
      ZStack: native('Box'),
    },
    '@expo/ui/swift-ui/modifiers': {
      frame: (value) => ({ frame: value }),
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
      useFrameCallback: () => frameCallback,
      cancelAnimation() {},
      withTiming: (value) => value,
      withRepeat: (value) => value,
      Easing: { linear() {} },
      ReduceMotion: { Never: 'never' },
    },
    '../../../skia/types': { isPath: (value) => typeof value === 'object' },
  };
  return { load: createSourceLoader(mocks), mocks, dimensions, calls, native };
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
        artwork: (width) => h('Artwork', { width }),
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

test('iOS sheet ignores duplicate width and position-only geometry events while retaining real resize', () => {
  const s = setup();
  const { BottomSheet } = s.load('components/ui/bottom-sheet/bottom-sheet.tsx');
  const view = renderFixture(h(BottomSheet, { isPresented: true, onDismiss() {} }, h('Content')));
  const report = (width, y = 0) =>
    view.flush(() =>
      view
        .findAll('Column')[0]
        .props.modifiers.find((value) => value.geometry)
        .geometry({ width, y, height: 250 }),
    );
  try {
    report(342);
    const before = s.calls.geometryFactories;
    report(342, 150);
    report(342, 200);
    assert.equal(s.calls.geometryFactories, before);
    report(492);
    assert.equal(view.findAll('Host')[0].props.style.width, 492);
    const resized = s.calls.geometryFactories;
    for (const invalid of [0, -1, NaN, Infinity]) report(invalid);
    assert.equal(s.calls.geometryFactories, resized);
  } finally {
    view.unmount();
  }
});

test('RN input bridge skips duplicate rounded width updates and preserves the native field across resize', () => {
  const s = setup();
  const { UniversalTextInput } = s.load('components/ui/text-input/universal-text-input.tsx');
  const view = renderFixture(h(UniversalTextInput, { testID: 'input' }));
  const report = (width) =>
    view.flush(() =>
      view.findAll('View')[0].props.onLayout({ nativeEvent: { layout: { width } } }),
    );
  try {
    report(320.1);
    const input = view.findAll('Input')[0];
    const before = s.calls.stateHooks;
    report(320.2);
    report(320.1);
    assert.equal(s.calls.stateHooks, before);
    report(480);
    assert.equal(view.findAll('Input')[0], input);
    assert.equal(view.findAll('Row')[0].props.style.width, 480);
    const resized = s.calls.stateHooks;
    for (const invalid of [NaN, Infinity, -1]) report(invalid);
    assert.equal(s.calls.stateHooks, resized);
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
