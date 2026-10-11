import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h, useImperativeHandle, useRef, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

function setup(t, initial = {}) {
  // Node has no native frame APIs.
  globalThis.requestAnimationFrame ??= () => 0;
  globalThis.cancelAnimationFrame ??= () => {};
  const native = (name) => (props) => h(name, props, props.children);
  const frames = new Map();
  let sequence = 0;
  t.mock.method(globalThis, 'requestAnimationFrame', (fn) => {
    frames.set(++sequence, fn);
    return sequence;
  });
  t.mock.method(globalThis, 'cancelAnimationFrame', (id) => frames.delete(id));
  const calls = { focus: 0, blur: 0, springs: [] };
  const useSharedFixture = (initial) => {
    const ref = useRef(null);
    if (!ref.current) {
      let value = initial;
      ref.current = {
        get: () => value,
        set: (next) => {
          value = next;
        },
      };
    }
    return ref.current;
  };
  const colors = { surface: '#ffffff', border: '#dddddd', muted: '#444444' };
  const Icon = Object.assign(native('Icon'), { select: ({ ios }) => ios });
  const load = createSourceLoader({
    '@expo/ui': {
      Column: native('Column'),
      Row: native('Row'),
      Spacer: native('Spacer'),
      Text: native('Text'),
      Icon,
      useNativeState: useSharedFixture,
    },
    '@expo/material-symbols/search.xml': 'search',
    '@expo/material-symbols/cancel.xml': 'cancel',
    '@/hooks/use-theme': { useThemeColors: () => colors },
    '@/hooks/use-motion-enabled': { useMotionEnabled: (active) => active },
    '@/components/ui/host/universal-host': {
      UniversalHost: native('Host'),
      useHostColorScheme: (scheme) => scheme ?? 'light',
    },
    '@/components/ui/native/native-fill-width': { nativeFillWidth: [], nativeRowWeight: [] },
    '@/components/ui/text-input/text-input-modifiers': {
      inputFieldAppearance: (style) => ({ style }),
    },
    '@/components/ui/search-field/search-field-trigger': { SearchFieldTrigger: native('Trigger') },
    '@/components/ui/text-input/universal-text-input': {
      UniversalTextInputContent: ({ ref, ...props }) => {
        useImperativeHandle(
          ref,
          () => ({ focus: () => calls.focus++, blur: () => calls.blur++ }),
          [],
        );
        return h('Input', props);
      },
    },
    'react-native-reanimated': {
      __esModule: true,
      default: { View: native('AnimatedView') },
      useSharedValue: useSharedFixture,
      useAnimatedStyle: (get) => get(),
      cancelAnimation() {},
      withSpring: (value, config) => {
        calls.springs.push(config);
        return value;
      },
      ReduceMotion: { System: 'system' },
    },
  });
  const { SearchField } = load('components/ui/search-field/search-field.tsx');
  let update;
  function Harness() {
    const [props, setProps] = useState({
      mode: 'edit',
      placeholder: 'Search recipes',
      testID: 'input',
      clearLabel: 'Clear search',
      value: 'tagine',
      onChange() {},
      onSubmit() {},
      ...initial,
    });
    update = (next) => setProps((current) => ({ ...current, ...next }));
    return h(SearchField, props);
  }
  const view = renderFixture(h(Harness));
  return {
    view,
    calls,
    frames,
    update: (next) => view.flush(() => update(next)),
    flushFrames: () =>
      view.flush(() => {
        const pending = [...frames.values()];
        frames.clear();
        pending.forEach((fn) => fn());
      }),
  };
}

test('focus is a one-shot navigation intent; returning to Search retains its field and draft', (t) => {
  const s = setup(t, { focusRequest: 'home-1' });
  try {
    const input = s.view.findAll('Input')[0];
    s.flushFrames();
    assert.equal(s.calls.focus, 1);
    assert.equal(s.calls.springs.length, 1);
    s.update({ value: 'couscous' });
    s.flushFrames();
    assert.equal(s.calls.focus, 1);
    assert.equal(input.props.value.get(), 'couscous');
    s.update({ active: false });
    assert.equal(s.calls.blur, 1);
    s.update({ active: true });
    s.flushFrames();
    assert.equal(s.calls.focus, 1);
    s.update({ focusRequest: 'home-2' });
    s.flushFrames();
    assert.equal(s.calls.focus, 2);
    assert.equal(s.view.findAll('Input')[0], input);
  } finally {
    s.view.unmount();
  }
});

test('static mode keeps native focus and clear; leaving before the next frame cancels focus', (t) => {
  const changes = [];
  const s = setup(t, {
    animate: false,
    focusRequest: 'home',
    onChange: (value) => changes.push(value),
  });
  try {
    s.update({ active: false });
    s.flushFrames();
    assert.equal(s.calls.focus, 0);
    s.update({ active: true });
    s.flushFrames();
    assert.equal(s.calls.focus, 1);
    assert.equal(s.calls.springs.length, 0);
    s.view.flush(() => s.view.findAll('Input')[0].props.onRightIconPress());
    assert.deepEqual(changes, ['']);
    assert.equal(s.calls.focus, 2);
    s.update({ focusRequest: 'later' });
    s.view.unmount();
    s.flushFrames();
    assert.equal(s.calls.focus, 2);
  } finally {
    s.view.unmount();
  }
});
