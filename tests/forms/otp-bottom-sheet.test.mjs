import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createContext,
  createElement,
  useContext,
  useEffect,
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
  { platform = 'android', height = 844, fontScale = 1, width = 360, initiallyOpen = true } = {},
) {
  const WindowContext = createContext({ height, fontScale, width });
  const calls = { inputMounts: 0, inputRenders: 0, formRenders: 0, resendRenders: 0 };
  let resizeWindow;
  const element = (tag) => {
    function NativeBoundary({ children, ...other }) {
      if (tag === 'ScrollView') calls.formRenders++;
      if (tag === 'Button' && other.testID === 'otp-sheet-resend') calls.resendRenders++;
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
      BottomSheet: element('Sheet'),
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
    '@expo/ui/swift-ui/modifiers': {
      frame: (params) => ({ $type: 'frame', ...params }),
      onGeometryChange: (geometry) => ({ geometry }),
    },
    '@expo/ui/jetpack-compose/modifiers': { onSizeChanged: (geometry) => ({ geometry }) },
    '@expo/material-symbols/lock.xml': 1,
    '@/hooks/use-theme': {
      useThemeColors: () => ({ surface: '#fafafa', surfaceRaised: '#eeeeee', text: '#101010' }),
    },
    '@/components/ui/host/universal-host': {
      UniversalHost: element('Host'),
      useHostColorScheme: () => 'light',
    },
    '@/components/ui/button/universal-button-content': {
      UniversalButtonContent: element('Button'),
    },
    '@/components/ui/loading/loading-state': { LoadingContent: element('Loading') },
    '@/components/ui/text/universal-text': { UniversalTextContent: element('Text') },
    '@/components/ui/native/native-fill-width': {
      nativeFillWidth: [{ $type: 'frame', maxWidth: Infinity }],
      nativeFillWidthCenter: [{ $type: 'frame', maxWidth: Infinity, alignment: 'top' }],
      nativeRowWeight: [{ $type: 'frame', maxWidth: Infinity }],
    },
    '@/components/ui/otp-bottom-sheet/otp-feedback': { OtpFeedback: element('Feedback') },
    '@/components/ui/otp-bottom-sheet/otp-input-layout': {
      OtpInputLayout: ({ input, slots, ...layout }) => {
        calls.inputRenders++;
        useEffect(() => {
          calls.inputMounts++;
        }, []);
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
        get: (_, name) => (params) =>
          name === 'onGeometryChange'
            ? { geometry: params }
            : {
                $type: name,
                ...(typeof params === 'object' ? params : { value: params }),
              },
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
      calls.formRenders++;
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
    const [open, setOpen] = useState(initiallyOpen);
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
  // OTP measures its own input section; this fixture mocks that native boundary.
  fixture.flush(() =>
    fixture
      .findAll('Column')
      .find(({ props }) => props.modifiers?.some((modifier) => modifier.geometry))
      .props.modifiers.find((modifier) => modifier.geometry)
      .geometry({ width: width - 48 }),
  );
  const button = (suffix) =>
    fixture.findAll('Button').find(({ props }) => props.testID === `otp-sheet-${suffix}`).props;
  return {
    ...fixture,
    calls,
    button,
    type: (value) => fixture.flush(() => fixture.findAll('Input')[0].props.onChangeText(value)),
    press: (suffix) => fixture.flush(() => button(suffix).onPress()),
    close: () => fixture.flush(() => fixture.findAll('Sheet')[0].props.onDismiss()),
    open: () => fixture.flush(() => fixture.findAll('Open')[0].props.onPress()),
    resize: (next) => fixture.flush(() => resizeWindow(next)),
    measure: (width) =>
      fixture.flush(() =>
        fixture
          .findAll('Column')
          .find(({ props }) => props.modifiers?.some((modifier) => modifier.geometry))
          .props.modifiers.find((modifier) => modifier.geometry)
          .geometry({ width }),
      ),
    status: () => fixture.findAll('Feedback')[0].props.status,
    settle: async () => {
      await new Promise(setImmediate);
      fixture.flush(() => {});
    },
  };
}

for (const platform of ['ios', 'android']) {
  test(`${platform} OTP input measures its own section and retains its value across resizing`, (t) => {
    const fixture = setup(t, {}, { platform, width: 360, initiallyOpen: false });
    fixture.open();
    assert.equal(fixture.findAll('Sheet')[0].props.containerColor, '#fafafa');
    assert.equal(fixture.findAll('Sheet')[0].props.contentColor, '#101010');
    assert.equal(fixture.findAll('Sheet')[0].props.contentPadding, undefined);
    fixture.measure(312);
    const input = fixture.findAll('Input')[0];
    const slotsWidth = () =>
      fixture
        .findAll('Column')
        .filter(({ props }) => props.testID?.startsWith('otp-sheet-slot-'))
        .reduce((total, { props }) => total + props.style.width, 40);
    assert.ok(input);
    assert.equal(slotsWidth(), 312);
    fixture.type('٠١٢٣٤٥');
    fixture.measure(272);
    assert.ok(Math.abs(slotsWidth() - 272) < 0.01);
    assert.equal(fixture.findAll('Input')[0], input);
    assert.equal(input.props.value.value, '012345');
    const before = fixture.calls.inputRenders;
    for (const width of [272, 0, -1, NaN, Infinity]) fixture.measure(width);
    assert.equal(fixture.calls.inputRenders, before);
    fixture.close();
    fixture.open();
    assert.equal(fixture.findAll('Input')[0], input);
    assert.equal(input.props.value.value, '');
    assert.equal(fixture.calls.inputMounts, 1);
    assert.ok(Math.abs(slotsWidth() - 272) < 0.01);
    assert.equal(fixture.button('verify').disabled, true);
  });

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

test('OTP countdown updates only resend, stops at zero, and restarts after resend or reopening', async (t) => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout', 'setInterval'], now: 1_000_000 });
  let resends = 0;
  const fixture = setup(t, {
    resendCooldownSeconds: 3,
    onResend: () => {
      resends++;
    },
  });
  const before = { ...fixture.calls };
  assert.match(fixture.button('resend').label, /3/);
  for (const seconds of [2, 1]) {
    fixture.flush(() => t.mock.timers.tick(1000));
    assert.match(fixture.button('resend').label, new RegExp(String(seconds)));
    assert.equal(fixture.button('resend').disabled, true);
    fixture.press('resend');
    assert.equal(resends, 0);
  }
  fixture.flush(() => t.mock.timers.tick(1000));
  assert.equal(fixture.button('resend').disabled, false);
  assert.equal(fixture.calls.formRenders, before.formRenders);
  assert.equal(fixture.calls.inputRenders, before.inputRenders);
  assert.equal(fixture.calls.inputMounts, before.inputMounts);
  assert.equal(fixture.calls.resendRenders, before.resendRenders + 3);
  fixture.flush(() => t.mock.timers.tick(60_000));
  assert.equal(fixture.calls.resendRenders, before.resendRenders + 3);
  fixture.press('resend');
  await fixture.settle();
  assert.equal(resends, 1);
  assert.match(fixture.button('resend').label, /3/);
  assert.equal(fixture.button('resend').disabled, true);
  fixture.close();
  const closed = { ...fixture.calls };
  fixture.flush(() => t.mock.timers.tick(60_000));
  assert.deepEqual(fixture.calls, closed);
  fixture.open();
  assert.match(fixture.button('resend').label, /3/);
  assert.equal(fixture.button('resend').disabled, true);
});

test('OTP without a resend action has no countdown updates', (t) => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout', 'setInterval'], now: 1_000_000 });
  const fixture = setup(t, { resendCooldownSeconds: 30 });
  const before = { ...fixture.calls };
  fixture.flush(() => t.mock.timers.tick(60_000));
  assert.deepEqual(fixture.calls, before);
});

test('iOS digit boxes keep equal explicit frames, fit narrow widths and grow for large text', (t) => {
  const fixture = setup(t, {}, { platform: 'ios', width: 320 });
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

test('closing and reopening ignores an earlier resend completion without clearing the new code', async (t) => {
  let finish;
  const fixture = setup(t, {
    onResend: () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  });
  fixture.press('resend');
  fixture.close();
  fixture.open();
  fixture.type('٠١٢٣٤٥');
  finish();
  await fixture.settle();
  assert.equal(fixture.status(), 'idle');
  assert.equal(fixture.findAll('Input')[0].props.value.value, '012345');
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
