import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

test('native stories receive a finite bridge width and retain their state during real resizing', () => {
  const native = (name) => (props) => h(name, props, props.children);
  const load = createSourceLoader({
    'react-native': {
      View: native('View'),
      I18nManager: { isRTL: false },
      useColorScheme: () => 'light',
    },
    '@react-native-async-storage/async-storage': {
      getItem: async () => null,
      setItem: async () => {},
    },
    '@components/ui': {
      Column: native('Column'),
      ScrollView: native('ScrollView'),
      UniversalHost: native('Host'),
      RNHostView: native('RNHostView'),
      nativeFillWidth: [],
    },
    '@/hooks/use-theme': { useThemeColors: () => ({ background: '#000000' }) },
  });
  const { NativeStoryFrame } = load('../.rnstorybook/components/native-story-frame.tsx');
  let mounts = 0;
  function Story() {
    const [value, setValue] = useState(() => {
      mounts++;
      return false;
    });
    return h('Control', { value, toggle: () => setValue((current) => !current) });
  }
  const view = renderFixture(h(NativeStoryFrame, null, h(Story)));
  const resize = (width) =>
    view.findAll('View')[0].props.onLayout({ nativeEvent: { layout: { width } } });
  try {
    // Wait for actual available geometry instead of mounting percentage-width
    // native Hosts into an unconstrained, intrinsically sized RN subtree.
    assert.equal(view.findAll('Control').length, 0);
    view.flush(() => resize(390));
    assert.equal(view.findAll('Control').length, 1);
    const bridge = view.findAll('RNHostView')[0];
    assert.equal(bridge.props.matchContents, true);
    assert.equal(bridge.children[0].props.style.width, 342);
    view.flush(() => view.findAll('Control')[0].props.toggle());
    view.flush(() => resize(600));
    assert.equal(view.findAll('RNHostView')[0].children[0].props.style.width, 552);
    assert.equal(view.findAll('Control')[0].props.value, true);
    assert.equal(mounts, 1);
    view.flush(() => resize(Number.NaN));
    assert.equal(view.findAll('Control')[0].props.value, true);
    assert.equal(view.findAll('RNHostView')[0].children[0].props.style.width, 552);
  } finally {
    view.unmount();
  }
});
