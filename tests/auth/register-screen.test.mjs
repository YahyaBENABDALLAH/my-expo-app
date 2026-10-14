import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';
import { createElement as h } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

// Match the source loader's CommonJS exports so providers and hooks share a context.
const require = createRequire(import.meta.url);
const { QueryClient, QueryClientProvider } = require('@tanstack/react-query');
const { useController } = require('react-hook-form');

function setup(language = 'fr') {
  const native = (name) => (props) => h(name, props, props.children);
  const requests = [];
  const FieldGroup = native('FieldGroup');
  FieldGroup.Section = native('Section');
  FieldGroup.SectionFooter = native('Footer');
  const Picker = native('Picker');
  Picker.Item = native('PickerItem');
  const load = createSourceLoader({
    'react-native': { KeyboardAvoidingView: native('KeyboardFrame'), Keyboard: { dismiss() {} } },
    'react-native-safe-area-context': {
      useSafeAreaInsets: () => ({ top: 24, bottom: 16, left: 0, right: 0 }),
    },
    'expo-router': { router: { dismissTo() {} } },
    '@/context/language.context': { useLanguage: () => ({ language }) },
    '@/features/auth/auth-flow.context': {
      useAuthFlow: () => ({
        register: (body) =>
          new Promise((resolve, reject) => requests.push({ body, resolve, reject })),
      }),
    },
    '@components/ui': {
      Column: native('Column'),
      FieldGroup,
      ListItem: native('ListItem'),
      Picker,
      PageFrame: native('PageFrame'),
      UniversalHost: native('Host'),
      UniversalTextContent: native('Text'),
      UniversalButtonContent: native('Button'),
      FormSubmit: native('Submit'),
      FormTextInput: ({ control, name, ...props }) => {
        const { field, fieldState } = useController({ control, name });
        return h('Input', {
          ...props,
          value: field.value,
          onChangeText: field.onChange,
          error: fieldState.error?.message,
        });
      },
      useAuthTheme: () => ({ colors: {}, scheme: 'light' }),
      authInputIcons: {},
      nativeFillWidth: [],
      nativeFillSize: [],
    },
  });
  const { RegisterScreen } = load('features/auth/screens/register-screen.tsx');
  const client = new QueryClient({ defaultOptions: { mutations: { gcTime: 0 } } });
  const view = renderFixture(h(QueryClientProvider, { client }, h(RegisterScreen)));
  const input = (id) =>
    view.findAll('Input').find((node) => node.props.testID === `auth-register-${id}`).props;
  const picker = () => view.findAll('Picker')[0].props;
  const edit = (id, value) => view.flush(() => input(id).onChangeText(value));
  const submit = () => view.flush(() => view.findAll('Submit')[0].props.onPress());
  const settle = async () => {
    await new Promise((resolve) => setImmediate(resolve));
    await new Promise((resolve) => setTimeout(resolve, 0));
    view.flush(() => {});
  };
  const fill = () => {
    edit('username', '  alex  ');
    edit('email', ' ALEX@Example.COM ');
    edit('password', 'password ');
    edit('confirm-password', 'password ');
  };
  return {
    view,
    requests,
    input,
    picker,
    edit,
    fill,
    submit,
    settle,
    close: () => {
      view.unmount();
      client.clear();
    },
  };
}

test('registration sends the selected language and normalized credentials, suppresses duplicate requests and preserves failed drafts', async () => {
  const s = setup();
  try {
    assert.equal(s.picker().selectedValue, 'fr', 'Defaults to the current app language');
    assert.deepEqual(
      s.view.findAll('PickerItem').map((item) => [item.props.value, item.props.label]),
      [
        ['fr', 'Français'],
        ['en', 'English'],
        ['ar', 'العربية'],
      ],
    );
    s.fill();
    s.view.flush(() => s.picker().onValueChange('ar'));
    s.submit();
    s.submit();
    await s.settle();
    assert.equal(s.requests.length, 1);
    assert.deepEqual(s.requests[0].body, {
      userName: 'alex',
      firstName: '',
      lastName: '',
      email: 'alex@example.com',
      password: 'password ',
      preferredLanguage: 'ar',
    });
    assert.equal(s.picker().enabled, false);
    assert.ok(s.view.findAll('Input').every((input) => input.props.disabled));
    assert.equal(s.view.findAll('Submit')[0].props.pending, true);
    assert.equal(s.view.findAll('Button')[0].props.disabled, true);
    s.requests[0].reject(new Error('Service unavailable'));
    await s.settle();
    assert.equal(s.picker().enabled, true);
    assert.equal(s.picker().selectedValue, 'ar');
    assert.equal(s.input('password').value, 'password ');
    assert.equal(s.input('email').value, ' ALEX@Example.COM ');
    s.submit();
    await s.settle();
    assert.equal(s.requests.length, 2);
    assert.deepEqual(s.requests[1].body, s.requests[0].body);
    s.requests[1].resolve();
    await s.settle();
  } finally {
    s.close();
  }
});

test('a password mismatch blocks registration and can be corrected without losing the selected language', async () => {
  const s = setup('en');
  try {
    s.fill();
    s.edit('confirm-password', 'different password');
    s.view.flush(() => s.picker().onValueChange('fr'));
    s.submit();
    await s.settle();
    assert.equal(s.requests.length, 0);
    assert.equal(s.input('confirm-password').error, 'auth.passwordMismatch');
    assert.equal(s.picker().enabled, true);
    s.edit('confirm-password', 'password ');
    s.submit();
    await s.settle();
    assert.equal(s.requests.length, 1);
    assert.equal(s.requests[0].body.preferredLanguage, 'fr');
    assert.equal(s.input('confirm-password').error, undefined);
    s.requests[0].resolve();
    await s.settle();
  } finally {
    s.close();
  }
});
