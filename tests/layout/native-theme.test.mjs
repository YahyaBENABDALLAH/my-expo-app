import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createSourceLoader } from '../helpers/load-source.mjs';

// Capture native props from real compositions; device layout/tint still needs
// native verification. The mocked device is light so forced-dark inheritance is exercised.
function setup(platform) {
  const captured = {
    hosts: [],
    fields: [],
    rows: [],
    texts: [],
    scrolls: [],
    refresh: [],
    switches: [],
  };
  const native = (collection) =>
    function NativeFixture(props) {
      collection?.push(props);
      return createElement('div', null, props.children);
    };
  const modifier =
    (kind) =>
    (...args) => ({ kind, args });
  const load = createSourceLoader({
    '@expo/ui': {
      Host: native(captured.hosts),
      Column: native(),
      Row: native(captured.rows),
      Text: native(captured.texts),
      TextInput: native(captured.fields),
      Icon: native(),
      ScrollView: native(captured.scrolls),
      Switch: native(captured.switches),
    },
    '@/hooks/use-color-scheme': { useColorScheme: (scheme) => scheme ?? 'light' },
    '@/context/layout-direction.context': { useLayoutDirection: () => 'ltr' },
    'react-native': { View: native() },
    '@/components/ui/native/native-fill-width': { nativeFillWidth: [] },
    '@/components/ui/text-input/text-input-modifiers': {
      inputRowFlex: [],
      inputFieldAppearance: (style) => ({ style }),
    },
    '@/components/ui/text-input/text-input-icon-button': { TextInputIconButton: native() },
    '@expo/ui/jetpack-compose': {
      PullToRefreshBox: native(captured.refresh),
      Switch: native(captured.switches),
      Row: native(captured.rows),
      Text: native(captured.texts),
    },
    '@expo/ui/jetpack-compose/modifiers': {
      fillMaxSize: modifier('fillMaxSize'),
      testID: modifier('testID'),
      weight: modifier('weight'),
    },
    '@expo/ui/swift-ui/modifiers': {
      tint: modifier('tint'),
      refreshable: modifier('refreshable'),
      foregroundStyle: modifier('foregroundStyle'),
    },
  });
  const { UniversalHost } = load('components/ui/host/universal-host.tsx');
  const { UniversalTextInputContent } = load('components/ui/text-input/universal-text-input.tsx');
  const { RefreshableScrollView } = load(
    `components/ui/refreshable-scroll-view/refreshable-scroll-view.${platform}.tsx`,
  );
  const colors = load('constants/colors.ts').default;
  const { Switch } = load(`components/ui/switch/switch.${platform}.tsx`);
  const render = (component, props, host = {}) =>
    renderToStaticMarkup(createElement(UniversalHost, host, createElement(component, props)));
  return { captured, colors, render, UniversalTextInputContent, RefreshableScrollView, Switch };
}

for (const scheme of ['light', 'dark']) {
  test(`native Host seeds ${scheme} controls from the brand and preserves explicit seeds`, () => {
    const s = setup('android');
    s.render(s.RefreshableScrollView, {}, { colorScheme: scheme });
    assert.equal(s.captured.hosts[0].seedColor, s.colors[scheme].tint);
    s.render(s.RefreshableScrollView, {}, { colorScheme: scheme, seedColor: '#987654' });
    assert.equal(s.captured.hosts[1].seedColor, '#987654');
  });

  test(`field content inherits ${scheme} Host text, surface and semantic feedback`, () => {
    const s = setup('android');
    s.render(
      s.UniversalTextInputContent,
      { label: 'Email', helperText: 'Invalid email', status: 'error' },
      { colorScheme: scheme },
    );
    assert.equal(s.captured.fields[0].textStyle.color, s.colors[scheme].text);
    assert.equal(s.captured.fields[0].cursorColor, s.colors[scheme].tint);
    assert.equal(s.captured.fields[0].selectionColor, s.colors[scheme].selection);
    assert.equal(s.captured.fields[0].selectionHandleColor, s.colors[scheme].tint);
    assert.equal(s.captured.rows[0].style.backgroundColor, s.colors[scheme].surface);
    assert.equal(s.captured.rows[0].style.borderColor, s.colors[scheme].error);
    assert.equal(s.captured.texts.at(-1).textStyle.color, s.colors[scheme].error);
  });

  for (const platform of ['android', 'ios']) {
    test(`${platform}: switch inherits ${scheme} tokens and forwards one native change`, () => {
      const s = setup(platform);
      const changes = [];
      const customModifier = { kind: 'custom', args: [] };
      s.render(
        s.Switch,
        {
          value: false,
          label: 'Notifications',
          testID: 'theme-switch',
          modifiers: [customModifier],
          onValueChange: (value) => changes.push(value),
        },
        { colorScheme: scheme },
      );
      const toggle = s.captured.switches[0];
      assert.equal(toggle.value, false);
      assert.ok(toggle.modifiers.includes(customModifier));
      if (platform === 'android') {
        assert.equal(toggle.colors.checkedTrackColor, s.colors[scheme].switchTrackOn);
        assert.equal(toggle.colors.uncheckedTrackColor, s.colors[scheme].switchTrackOff);
        assert.equal(toggle.colors.checkedThumbColor, s.colors[scheme].switchThumbOn);
        assert.equal(toggle.colors.uncheckedThumbColor, s.colors[scheme].switchThumbOff);
        assert.equal(toggle.colors.uncheckedBorderColor, s.colors[scheme].switchBorderOff);
        assert.equal(s.captured.texts[0].color, s.colors[scheme].text);
        assert.equal(
          toggle.modifiers.find(({ kind }) => kind === 'testID').args[0],
          'theme-switch',
        );
        toggle.onCheckedChange(true);
      } else {
        assert.equal(
          toggle.modifiers.find(({ kind }) => kind === 'tint').args[0],
          s.colors[scheme].switchTrackOn,
        );
        assert.equal(toggle.testID, 'theme-switch');
        toggle.onValueChange(true);
      }
      assert.deepEqual(changes, [true]);
    });

    test(`${platform}: refresh inherits ${scheme} tokens; Android indicator aligns to viewport center`, () => {
      const s = setup(platform);
      s.render(s.RefreshableScrollView, { onRefresh: async () => {} }, { colorScheme: scheme });
      if (platform === 'android') {
        const indicator = s.captured.refresh[0].indicator;
        assert.equal(indicator.color, s.colors[scheme].tint);
        assert.equal(indicator.containerColor, s.colors[scheme].surface);
        assert.equal(s.captured.refresh[0].contentAlignment, 'topCenter');
        assert.deepEqual(s.captured.refresh[0].modifiers, [{ kind: 'fillMaxSize', args: [] }]);
      } else {
        assert.equal(
          s.captured.scrolls[0].modifiers.find(({ kind }) => kind === 'tint').args[0],
          s.colors[scheme].tint,
        );
      }
    });
  }
}

test('explicit field scheme and palette override the owning Host', () => {
  const s = setup('android');
  s.render(s.UniversalTextInputContent, { colorScheme: 'light' }, { colorScheme: 'dark' });
  assert.equal(s.captured.fields[0].textStyle.color, s.colors.light.text);
  const palette = { ...s.colors.dark, text: '#abcdef', error: '#fedcba' };
  s.render(s.UniversalTextInputContent, { palette, status: 'error' }, { colorScheme: 'light' });
  assert.equal(s.captured.fields[1].textStyle.color, palette.text);
  assert.equal(s.captured.rows[1].style.borderColor, palette.error);
});

for (const platform of ['android', 'ios']) {
  test(`${platform}: disabled on/off switches retain state and suppress changes`, () => {
    const s = setup(platform);
    let changes = 0;
    for (const value of [true, false]) {
      s.render(
        s.Switch,
        {
          value,
          disabled: true,
          label: 'Disabled preference',
          onValueChange: () => changes++,
        },
        { colorScheme: 'dark' },
      );
      const toggle = s.captured.switches.at(-1);
      assert.equal(toggle.value, value);
      if (platform === 'android') {
        assert.equal(toggle.enabled, false);
        assert.equal(toggle.onCheckedChange, undefined);
        assert.equal(toggle.colors.disabledCheckedTrackColor, s.colors.dark.switchTrackDisabledOn);
        assert.equal(
          toggle.colors.disabledUncheckedTrackColor,
          s.colors.dark.switchTrackDisabledOff,
        );
        assert.equal(s.captured.texts.at(-1).color, s.colors.dark.muted);
      } else {
        assert.equal(toggle.disabled, true);
        toggle.onValueChange(!value);
      }
    }
    assert.equal(changes, 0);
  });

  test(`${platform}: disabled and hidden scrolling installs no refresh interaction`, () => {
    const s = setup(platform);
    for (const state of [{ disabled: true }, { hidden: true }, {}]) {
      s.render(s.RefreshableScrollView, {
        ...state,
        ...(Object.keys(state).length ? { onRefresh: async () => {} } : {}),
      });
    }
    assert.equal(s.captured.refresh.length, 0);
    assert.ok(
      s.captured.scrolls.every(
        ({ modifiers = [] }) => !modifiers.some(({ kind }) => kind === 'refreshable'),
      ),
    );
  });

  test(`${platform}: repeated pull gestures share one pending refresh, including failure completion`, async () => {
    const s = setup(platform);
    let requests = 0;
    let reject;
    s.render(s.RefreshableScrollView, {
      onRefresh: () => {
        requests += 1;
        return new Promise((_, fail) => {
          reject = fail;
        });
      },
    });
    const refresh =
      platform === 'android'
        ? s.captured.refresh[0].onRefresh
        : s.captured.scrolls[0].modifiers.find(({ kind }) => kind === 'refreshable').args[0];
    const first = refresh();
    const second = refresh();
    await Promise.resolve();
    assert.equal(requests, 1);
    if (platform === 'ios') assert.equal(first, second);
    reject(new Error('Offline'));
    await new Promise((resolve) => setImmediate(resolve));
    await first;
    refresh();
    await Promise.resolve();
    assert.equal(requests, 2);
    reject(new Error('Still offline'));
    await new Promise((resolve) => setImmediate(resolve));
  });
}
