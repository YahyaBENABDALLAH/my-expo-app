import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement, useImperativeHandle, useRef, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

// Real component state/callbacks; native rendering, geometry, keyboard and motion are mocked.
function setup(t, props = {}) {
  const element = (tag) => {
    function NativeBoundary({ children, ...other }) {
      return createElement(tag, other, children);
    }
    return NativeBoundary;
  };
  const Icon = element('Icon');
  Icon.select = ({ ios }) => ios;
  const mocks = {
    '@expo/ui': {
      Column: element('Column'),
      Row: element('Row'),
      Spacer: element('Spacer'),
      ScrollView: element('ScrollView'),
      RNHostView: element('RNHostView'),
      Icon,
      useNativeState: (initial) => {
        const state = useRef(null);
        if (!state.current)
          state.current = {
            value: initial,
            set(next) {
              this.value = next;
            },
          };
        return state.current;
      },
    },
    'react-native': {
      Platform: { OS: 'android' },
      AccessibilityInfo: { announceForAccessibility() {} },
    },
    '@expo/ui/swift-ui/modifiers': { onGeometryChange: () => ({}) },
    '@expo/ui/jetpack-compose/modifiers': { onSizeChanged: () => ({}) },
    '@expo/material-symbols/lock.xml': 1,
    '@/hooks/use-theme': { useThemeColors: () => ({}) },
    '@/hooks/use-measured-width': { useMeasuredWidth: () => [312, () => {}] },
    '@/components/ui/host/universal-host': {
      UniversalHost: element('Host'),
      useHostColorScheme: () => 'light',
    },
    '@/components/ui/bottom-sheet/bottom-sheet': { BottomSheet: element('Sheet') },
    '@/components/ui/button/universal-button-content': {
      UniversalButtonContent: element('Button'),
    },
    '@/components/ui/loading/loading-state': { LoadingContent: element('Loading') },
    '@/components/ui/text/universal-text': { UniversalTextContent: element('Text') },
    '@/components/ui/native/native-fill-width': { nativeFillWidth: [], nativeRowWeight: [] },
    '@/components/ui/otp-bottom-sheet/otp-feedback': { OtpFeedback: element('Feedback') },
    '@/components/ui/otp-bottom-sheet/otp-input-layout': {
      OtpInputLayout: ({ input }) => {
        useImperativeHandle(input.ref, () => ({ focus() {}, blur() {} }), []);
        const { ref, ...rest } = input;
        return createElement('Input', rest);
      },
    },
  };
  const { OtpBottomSheet } = createSourceLoader(mocks)(
    'components/ui/otp-bottom-sheet/otp-bottom-sheet.tsx',
  );
  function Harness() {
    const [open, setOpen] = useState(true);
    return createElement(
      'Root',
      null,
      createElement('Open', { onPress: () => setOpen(true) }),
      createElement(OtpBottomSheet, {
        isPresented: open,
        onDismiss: () => setOpen(false),
        recipient: 'preview@example.com',
        resendCooldownSeconds: 0,
        onVerify: () => true,
        ...props,
      }),
    );
  }
  const fixture = renderFixture(createElement(Harness));
  t.after(() => fixture.unmount());
  const button = (suffix) =>
    fixture.findAll('Button').find(({ props }) => props.testID === `otp-sheet-${suffix}`).props;
  return {
    ...fixture,
    button,
    type: (value) => fixture.flush(() => fixture.findAll('Input')[0].props.onChangeText(value)),
    press: (suffix) => fixture.flush(() => button(suffix).onPress()),
    close: () => fixture.flush(() => fixture.findAll('Sheet')[0].props.onDismiss()),
    open: () => fixture.flush(() => fixture.findAll('Open')[0].props.onPress()),
    status: () => fixture.findAll('Feedback')[0].props.status,
    settle: async () => {
      await new Promise(setImmediate);
      fixture.flush(() => {});
    },
  };
}

test('incomplete codes and duplicate taps cannot submit; accepted codes show success', async (t) => {
  let calls = 0;
  let finish;
  let submitted;
  const fixture = setup(t, {
    onVerify: (code) => {
      calls++;
      submitted = code;
      return new Promise((resolve) => {
        finish = resolve;
      });
    },
  });
  fixture.type('123');
  assert.equal(fixture.button('verify').disabled, true);
  fixture.press('verify');
  assert.equal(calls, 0);
  fixture.type('٠١٢٣٤٥');
  fixture.press('verify');
  fixture.press('verify');
  assert.equal(calls, 1);
  assert.equal(submitted, '012345');
  assert.equal(fixture.status(), 'verifying');
  finish(true);
  await fixture.settle();
  assert.equal(fixture.status(), 'success');
});

test('closing and reopening clears code and ignores an earlier verification completion', async (t) => {
  let finish;
  const fixture = setup(t, {
    onVerify: () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  });
  fixture.type('123456');
  fixture.press('verify');
  fixture.close();
  fixture.open();
  assert.equal(fixture.status(), 'idle');
  assert.equal(fixture.button('verify').disabled, true);
  finish(true);
  await fixture.settle();
  assert.equal(fixture.status(), 'idle');
});

test('rejected codes and request failures expose different retry messages', async (t) => {
  let requestFailure = false;
  const fixture = setup(t, {
    onVerify: () => {
      if (requestFailure) throw new Error('offline');
      return false;
    },
  });
  fixture.type('123456');
  fixture.press('verify');
  await fixture.settle();
  assert.equal(fixture.status(), 'error');
  let message = fixture.findAll('Text').find(({ props }) => props.testID === 'otp-sheet-status')
    .props.children;
  assert.match(message, /isn't correct/);
  requestFailure = true;
  fixture.press('verify');
  await fixture.settle();
  message = fixture.findAll('Text').find(({ props }) => props.testID === 'otp-sheet-status')
    .props.children;
  assert.match(message, /couldn't verify/);
  assert.equal(fixture.button('verify').disabled, false);
});

test('resend clears old digits only on success and prevents duplicate requests', async (t) => {
  let calls = 0;
  let finish;
  const fixture = setup(t, {
    onResend: () => {
      calls++;
      return new Promise((resolve) => {
        finish = resolve;
      });
    },
  });
  fixture.type('123456');
  fixture.press('resend');
  fixture.press('resend');
  assert.equal(calls, 1);
  assert.equal(fixture.status(), 'resending');
  finish();
  await fixture.settle();
  assert.equal(fixture.status(), 'idle');
  assert.equal(fixture.button('verify').disabled, true);
  assert.equal(fixture.findAll('Input')[0].props.value.value, '');
});
