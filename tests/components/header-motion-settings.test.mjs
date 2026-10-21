import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

const turn = () => new Promise((resolve) => setImmediate(resolve));
function setup({ stored = 'water', failRead = false, failWrite = false, persist = true } = {}) {
  let finishRead;
  const writes = [];
  const storage = {
    getItem: () =>
      new Promise((resolve, reject) => {
        finishRead = () => (failRead ? reject(new Error('Storage unavailable')) : resolve(stored));
      }),
    setItem: async (key, value) => {
      writes.push([key, value]);
      if (failWrite) throw new Error('Storage unavailable');
      stored = value;
    },
  };
  const Picker = (props) => h('Picker', props, props.children);
  Picker.Item = (props) => h('Item', props);
  const load = createSourceLoader({
    '@react-native-async-storage/async-storage': storage,
    '@/components/ui/picker/picker': { Picker },
  });
  const { ThemePreferencesProvider, useThemeSettings } = load('context/theme.context.tsx');
  const { HeaderMotionPicker } = load('components/ui/appearance/header-motion-picker.tsx');
  function Probe() {
    return h('Preferences', useThemeSettings(), h(HeaderMotionPicker));
  }
  const mount = () =>
    renderFixture(h(ThemePreferencesProvider, { persistHeaderMotion: persist }, h(Probe)));
  let view = mount();
  return {
    get view() {
      return view;
    },
    get settings() {
      return view.findAll('Preferences')[0].props;
    },
    get picker() {
      return view.findAll('Picker')[0].props;
    },
    writes,
    choose: (shape) => view.flush(() => view.findAll('Picker')[0].props.onValueChange(shape)),
    async restore() {
      finishRead();
      await turn();
      view.flush(() => {});
    },
    remount() {
      view.unmount();
      view = mount();
    },
  };
}

test('Settings restores the saved effect, switches immediately, serializes rapid changes and retains the last choice on reopening', async (t) => {
  const s = setup();
  t.after(() => s.view.unmount());
  assert.equal(s.picker.enabled, false);
  s.choose('rain');
  assert.equal(
    s.settings.headerShape,
    'smoke',
    'A late restoration cannot overwrite an early selection.',
  );
  await s.restore();
  assert.equal(s.picker.selectedValue, 'water');
  assert.equal(s.picker.enabled, true);
  assert.deepEqual(
    s.view.findAll('Item').map((item) => item.props.label),
    ['Waves', 'Ribbon', 'Dunes', 'Smoke', 'Water', 'Rain'],
  );
  for (const shape of ['rain', 'smoke', 'waves']) {
    s.choose(shape);
    assert.equal(s.settings.headerShape, shape);
    assert.equal(s.picker.selectedValue, shape);
  }
  s.choose('invalid');
  assert.equal(s.settings.headerShape, 'waves');
  await turn();
  assert.deepEqual(s.writes, [
    ['appHeaderMotion', 'rain'],
    ['appHeaderMotion', 'smoke'],
    ['appHeaderMotion', 'waves'],
  ]);
  s.remount();
  await s.restore();
  assert.equal(s.picker.selectedValue, 'waves');
});

test('invalid stored values and read/write failures leave a usable picker', async (t) => {
  for (const options of [{ stored: 'invalid' }, { failRead: true, failWrite: true }]) {
    const s = setup(options);
    t.after(() => s.view.unmount());
    await s.restore();
    assert.equal(s.picker.selectedValue, 'smoke');
    assert.equal(s.picker.enabled, true);
    s.choose('rain');
    await turn();
    assert.equal(s.picker.selectedValue, 'rain');
  }
});

test('Storybook preferences change locally without reading or overwriting the saved app effect', async (t) => {
  const s = setup({ persist: false });
  t.after(() => s.view.unmount());
  assert.equal(s.picker.enabled, true);
  s.choose('water');
  assert.equal(s.picker.selectedValue, 'water');
  await turn();
  assert.deepEqual(s.writes, []);
});
