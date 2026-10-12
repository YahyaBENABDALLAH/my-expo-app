import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createContext,
  createElement,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

// Real component state/callbacks; native rendering, geometry, keyboard and motion are mocked.
function setup(
  t,
  props = {},
  { platform = 'android', height = 844, fontScale = 1, width = 312 } = {},
) {
  const WindowContext = createContext({ height, fontScale, width });
  let resizeWindow;
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
      Platform: { OS: platform },
      useWindowDimensions: () => useContext(WindowContext),
      AccessibilityInfo: { announceForAccessibility() {} },
    },
    '@expo/ui/swift-ui/modifiers': { onGeometryChange: () => ({}) },
    '@expo/ui/jetpack-compose/modifiers': { onSizeChanged: () => ({}) },
    '@expo/material-symbols/lock.xml': 1,
    '@/hooks/use-theme': { useThemeColors: () => ({}) },
    '@/hooks/use-measured-width': {
      useMeasuredWidth: () => [useContext(WindowContext).width, () => {}],
    },
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
    '@/components/ui/native/native-fill-width': {
      nativeFillWidth: [{ $type: 'frame', maxWidth: Infinity }],
      nativeRowWeight: [{ $type: 'frame', maxWidth: Infinity }],
    },
    '@/components/ui/otp-bottom-sheet/otp-feedback': { OtpFeedback: element('Feedback') },
    '@/components/ui/otp-bottom-sheet/otp-input-layout': {
      OtpInputLayout: ({ input, slots, ...layout }) => {
        useImperativeHandle(input.ref, () => ({ focus() {}, blur() {} }), []);
        const { ref, ...rest } = input;
        return createElement('InputLayout', layout, slots, createElement('Input', rest));
      },
    },
  };
  if (platform === 'ios') {
    // Exercise the installed style translator: a width-only frame escape hatch erases height.
    mocks['@expo/ui/swift-ui/modifiers'] = new Proxy(
      {},
      {
        get: (_, name) => (params) => ({
          $type: name,
          ...(typeof params === 'object' ? params : { value: params }),
        }),
      },
    );
    const { transformToModifiers } = createSourceLoader(mocks)(
      '../node_modules/@expo/ui/src/universal/transformStyle.ios.ts',
    );
    mocks['@expo/ui'].Column = function Column({ children, style, modifiers, ...other }) {
      return createElement(
        'Column',
        { ...other, style, modifiers: transformToModifiers(style, {}, modifiers) },
        children,
      );
    };
    mocks['@expo/ui'].ScrollView = function ScrollView({ children, style, modifiers, ...other }) {
      return createElement(
        'ScrollView',
        { ...other, style, modifiers: transformToModifiers(style, {}, modifiers) },
        children,
      );
    };
  }
  const { OtpBottomSheet } = createSourceLoader(mocks)(
    'components/ui/otp-bottom-sheet/otp-bottom-sheet.tsx',
  );
  function Harness() {
    const [open, setOpen] = useState(true);
    const [window, setWindow] = useState({ height, fontScale, width });
    resizeWindow = (next) => setWindow((previous) => ({ ...previous, ...next }));
    return createElement(
      WindowContext.Provider,
      { value: window },
      createElement(
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
      ),
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
    resize: (next) => fixture.flush(() => resizeWindow(next)),
    status: () => fixture.findAll('Feedback')[0].props.status,
    settle: async () => {
      await new Promise(setImmediate);
      fixture.flush(() => {});
    },
  };
}

for (const platform of ['ios', 'android']) {
  test(`${platform} OTP scrolling has a finite viewport on opening, resizing and reopening`, (t) => {
    const fixture = setup(t, {}, { platform, height: 640 });
    const scrollHeight = () => {
      const scroll = fixture.findAll('ScrollView')[0].props;
      return platform === 'ios'
        ? scroll.modifiers.find((modifier) => modifier.$type === 'frame')?.height
        : scroll.style?.height;
    };
    assert.ok(scrollHeight() > 0 && scrollHeight() < 640);
    fixture.resize({ height: 320 });
    assert.ok(scrollHeight() > 0 && scrollHeight() < 320);
    fixture.close();
    fixture.open();
    assert.ok(scrollHeight() > 0 && scrollHeight() < 320);
  });
}

test('iOS digit boxes keep equal explicit frames, fit narrow widths and grow for large text', (t) => {
  const fixture = setup(t, {}, { platform: 'ios', width: 272 });
  const frames = () =>
    fixture
      .findAll('Column')
      .filter(({ props }) => props.testID?.startsWith('otp-sheet-slot-'))
      .map(({ props }) => props.modifiers.find((modifier) => modifier.$type === 'frame'));
  assert.equal(frames().length, 6);
  assert.ok(frames().every((frame) => frame.height === 64 && frame.width === frames()[0].width));
  assert.ok(Math.abs(frames().reduce((total, frame) => total + frame.width, 40) - 272) < 0.01);
  fixture.resize({ fontScale: 2 });
  assert.ok(frames().every((frame) => frame.height >= 35 * 2 + 24));
  assert.equal(fixture.findAll('InputLayout')[0].props.height, frames()[0].height);
  fixture.type('012345');
  assert.ok(frames().every((frame) => frame.width > 0 && frame.height > 64));
});

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
