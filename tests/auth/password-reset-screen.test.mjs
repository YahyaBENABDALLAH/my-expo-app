import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h, useRef, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

const firstChallenge = '550e8400-e29b-41d4-a716-446655440000';
const secondChallenge = '550e8400-e29b-41d4-a716-446655440001';
function setup() {
  const native = (name) => (props) => h(name, props, props.children);
  let changeChallenge;
  const requests = [];
  const submissions = [];
  const ui = {
    AuthScreenFrame: native('Frame'),
    FormSubmit: native('Submit'),
    UniversalButtonContent: native('Button'),
    Column: native('Column'),
    nativeFillWidth: [],
  };
  const load = createSourceLoader({
    '@components/ui': ui,
    '@expo/ui': {
      Column: ui.Column,
      useNativeState: (value) => {
        const state = useRef(value);
        return {
          get: () => state.current,
          set: (next) => {
            state.current = next;
          },
        };
      },
    },
    'expo-router': {
      useLocalSearchParams: () => {
        const [challengeId, update] = useState(firstChallenge);
        changeChallenge = update;
        return { challengeId };
      },
      router: { push() {}, dismissTo() {} },
    },
    '@/features/auth/hooks/use-auth-form': {
      useAuthForm: (_resolver, defaults, action) => {
        const [values, update] = useState(defaults);
        const control = { values, update };
        const submit = () => action(values);
        submissions.push(submit);
        return { form: { control }, submit, pending: false };
      },
    },
    'react-hook-form': {
      useController: ({ control, name }) => ({
        field: {
          value: control.values[name],
          onChange: (value) => control.update((state) => ({ ...state, [name]: value })),
          ref() {},
          onBlur() {},
        },
        fieldState: {},
      }),
    },
    '@/services/auth/auth.api': {
      resetPassword: (body) => new Promise((resolve) => requests.push({ body, resolve })),
    },
    '@/components/ui/native/native-fill-width': { nativeFillWidth: [], nativeFillWidthEnd: [] },
    '@/components/ui/text-input/universal-text-input': {
      UniversalTextInputContent: native('Input'),
    },
    '@/components/ui/button/universal-button-content': {
      UniversalButtonContent: ui.UniversalButtonContent,
    },
    '@/components/ui/text/universal-text': { UniversalTextContent: native('Text') },
    '@/components/ui/auth/auth-theme': { useAuthTheme: () => ({ colors: {} }) },
    '@/components/ui/auth/auth-input-icons': { authInputIcons: {} },
    '@/lib/validation-feedback': { notifyValidationError() {} },
  });
  ui.FormTextInput = load('components/ui/form/form-text-input.tsx').FormTextInput;
  return {
    Screen: load('features/auth/screens/reset-password-screen.tsx').ResetPasswordScreen,
    changeChallenge: (id) => changeChallenge(id),
    requests,
    submit: () => submissions.at(-1)(),
    input: (view, id) => view.findAll('Input').find((node) => node.props.testID === id),
  };
}

test('both recovery password fields stay masked until their own visibility action is pressed', () => {
  const s = setup();
  const view = renderFixture(h(s.Screen));
  try {
    const password = () => s.input(view, 'auth-reset-password-new-password');
    const confirmation = () => s.input(view, 'auth-reset-password-confirm-password');
    assert.equal(password().props.secureTextEntry, true);
    assert.equal(confirmation().props.secureTextEntry, true);
    view.flush(() =>
      view
        .findAll('Button')
        .find((node) => node.props.testID === 'auth-reset-password-new-password-visibility')
        .props.onPress(),
    );
    assert.equal(password().props.secureTextEntry, false);
    assert.equal(confirmation().props.secureTextEntry, true);
  } finally {
    view.unmount();
  }
});

test('a new recovery challenge clears the draft and ignores an old successful submission', async () => {
  const s = setup();
  const view = renderFixture(h(s.Screen));
  try {
    view.flush(() =>
      s.input(view, 'auth-reset-password-new-password').props.onChangeText('private draft'),
    );
    const pending = s.submit();
    assert.equal(s.requests[0].body.challengeId, firstChallenge);
    view.flush(() => s.changeChallenge(secondChallenge));
    assert.equal(s.input(view, 'auth-reset-password-new-password').props.value.get(), '');
    s.requests[0].resolve();
    await pending;
    view.flush(() => {});
    assert.equal(view.findAll('Frame')[0].props.title, 'Reset password');
    const current = s.submit();
    assert.equal(s.requests[1].body.challengeId, secondChallenge);
    s.requests[1].resolve();
    await current;
    await new Promise((resolve) => setImmediate(resolve));
    view.flush(() => {});
    assert.equal(view.findAll('Frame')[0].props.title, 'Password updated');
    view.flush(() => s.changeChallenge(firstChallenge));
    assert.equal(view.findAll('Frame')[0].props.title, 'Reset password');
  } finally {
    view.unmount();
  }
});
