import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h, useRef, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

function setup(platform) {
  const native = (name) => (props) => h(name, props, props.children);
  const modifiers = Object.fromEntries(
    [
      'accessibilityLabel',
      'background',
      'clipShape',
      'frame',
      'strokeBorder',
      'textFieldStyle',
      'defaultMinSize',
      'fillMaxWidth',
      'semantics',
      'weight',
    ].map((name) => [name, (...args) => ({ $type: name, args })]),
  );
  const mocks = {
    '@expo/ui': {
      ...Object.fromEntries(
        ['Column', 'Row', 'Text', 'Icon', 'TextInput'].map((name) => [name, native(name)]),
      ),
      useNativeState(initial) {
        const state = useRef();
        state.current ??= {
          value: initial,
          get() {
            return this.value;
          },
          set(value) {
            this.value = value;
          },
        };
        return state.current;
      },
    },
    'react-native': { View: native('View') },
    '@/hooks/use-theme': {
      useThemeColors: () => ({
        surface: '#eee',
        text: '#111',
        muted: '#666',
        border: '#aaa',
        tint: '#080',
      }),
    },
    '@/components/ui/host/universal-host': {
      UniversalHost: native('Host'),
      useHostColorScheme: () => 'light',
    },
    '@/components/ui/native/native-fill-width': { nativeFillWidth: [] },
    '@/components/ui/text-input/text-input-icon-button': {
      TextInputIconButton: native('IconButton'),
    },
    '@expo/ui/swift-ui/modifiers': modifiers,
    '@expo/ui/jetpack-compose/modifiers': modifiers,
  };
  const load = createSourceLoader(mocks);
  mocks['@/components/ui/text-input/text-input-modifiers'] = load(
    `components/ui/text-input/text-input-modifiers.${platform}.ts`,
  );
  return load('components/ui/text-input/text-input.tsx');
}

for (const platform of ['ios', 'android']) {
  test(`${platform}: controlled strings edit and reset without replacing the native field`, () => {
    const { TextInput } = setup(platform);
    let update;
    const changes = [];
    const inputRef = { current: null };
    function Screen() {
      const [value, setValue] = useState('Saved draft');
      update = setValue;
      return h(TextInput, {
        value,
        ref: inputRef,
        keyboardType: 'decimal-pad',
        onChangeText(text) {
          changes.push(text);
          setValue(text);
        },
      });
    }
    const view = renderFixture(h(Screen));
    try {
      const field = view.findAll('TextInput')[0];
      const nativeValue = field.props.value;
      assert.equal(nativeValue.get(), 'Saved draft');
      assert.equal(field.props.ref, inputRef);
      assert.equal(field.props.keyboardType, 'decimal-pad');
      view.flush(() => {
        nativeValue.set('Edited draft');
        field.props.onChangeText('Edited draft');
      });
      assert.deepEqual(changes, ['Edited draft']);
      for (const reset of ['External update', '']) {
        view.flush(() => update(reset));
        assert.equal(view.findAll('TextInput')[0], field);
        assert.equal(field.props.value, nativeValue);
        assert.equal(nativeValue.get(), reset);
      }
      assert.deepEqual(changes, ['Edited draft']);
    } finally {
      view.unmount();
    }
  });

  test(`${platform}: uncontrolled input keeps native edits when defaultValue changes`, () => {
    const { TextInput } = setup(platform);
    let update;
    function Screen() {
      const [defaultValue, setDefaultValue] = useState('Initial');
      update = setDefaultValue;
      return h(TextInput, { defaultValue });
    }
    const view = renderFixture(h(Screen));
    try {
      const field = view.findAll('TextInput')[0];
      assert.equal(field.props.value.get(), 'Initial');
      field.props.value.set('Native edit');
      view.flush(() => update('Another default'));
      assert.equal(view.findAll('TextInput')[0], field);
      assert.equal(field.props.value.get(), 'Native edit');
    } finally {
      view.unmount();
    }
  });

  test(`${platform}: eye actions retain the observable value, field instance and surface sizing`, () => {
    const { TextInput } = setup(platform);
    const value = 'DemoOnly123!';
    let disable;
    let changes = 0;
    function Screen() {
      const [shown, setShown] = useState(false);
      const [disabled, setDisabled] = useState(false);
      disable = setDisabled;
      return h(TextInput, {
        testID: 'password',
        value,
        disabled,
        secureTextEntry: !shown,
        rightIcon: shown ? 'eye.slash' : 'eye',
        rightIconAccessibilityLabel: shown ? 'Hide password' : 'Show password',
        onRightIconPress: () => {
          changes++;
          setShown((current) => !current);
        },
      });
    }
    const view = renderFixture(h(Screen));
    const field = view.findAll('TextInput')[0];
    const nativeValue = field.props.value;
    const surface = view.findAll('Row')[0];
    const initialModifiers = surface.props.modifiers;
    for (let index = 1; index <= 6; index++) {
      view.flush(() => view.findAll('IconButton')[0].props.onPress());
      assert.equal(view.findAll('TextInput')[0], field);
      assert.equal(field.props.value, nativeValue);
      assert.equal(nativeValue.get(), value);
      assert.equal(field.props.secureTextEntry, index % 2 === 0);
      assert.deepEqual(surface.props.modifiers, initialModifiers);
      assert.equal(field.props.style.paddingTop, undefined);
      assert.equal(field.props.style.paddingBottom, undefined);
      assert.equal(field.props.testID, 'password');
    }
    assert.equal(changes, 6);
    view.flush(() => disable(true));
    assert.equal(view.findAll('IconButton')[0].props.onPress, undefined);
    assert.equal(field.props.editable, false);
    assert.equal(field.props.value, nativeValue);
    assert.equal(nativeValue.get(), value);
    view.unmount();
  });

  test(`${platform}: focus updates the border without remounting and preserves native colors and callbacks`, () => {
    const { TextInput } = setup(platform);
    let focused = 0,
      blurred = 0;
    const view = renderFixture(
      h(TextInput, {
        readOnly: true,
        cursorColor: '#123',
        selectionColor: '#456',
        selectionHandleColor: '#789',
        textStyle: { fontSize: 24 },
        onFocus: () => focused++,
        onBlur: () => blurred++,
      }),
    );
    const field = view.findAll('TextInput')[0];
    const surface = view.findAll('Row')[0];
    const borderColor = () =>
      platform === 'ios'
        ? surface.props.modifiers.find((modifier) => modifier.$type === 'strokeBorder').args[0]
            .content
        : surface.props.style.borderColor;
    const restingModifiers = surface.props.modifiers;
    assert.equal(borderColor(), '#aaa');
    assert.equal(field.props.readOnly, true);
    assert.equal(field.props.cursorColor, '#123');
    assert.equal(field.props.selectionColor, '#456');
    assert.equal(field.props.selectionHandleColor, '#789');
    assert.equal(field.props.textStyle.fontSize, 24);
    view.flush(() => {
      field.props.onBlur();
      field.props.onFocus();
      field.props.onFocus();
    });
    assert.equal(borderColor(), '#080');
    assert.equal(view.findAll('TextInput')[0], field);
    view.flush(() => {
      field.props.onBlur();
      field.props.onBlur();
    });
    assert.equal(borderColor(), '#aaa');
    assert.deepEqual(surface.props.modifiers, restingModifiers);
    assert.equal(focused, 1);
    assert.equal(blurred, 1);
    view.unmount();
  });
}
