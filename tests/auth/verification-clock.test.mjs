import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

const epoch = Date.parse('2026-10-11T12:00:00Z');
const at = (seconds) => new Date(epoch + seconds * 1000).toISOString();

function setup(challenge) {
  const native = (name) => (props) => h(name, props, props.children);
  let updateChallenge;
  const calls = { renders: 0 };
  const load = createSourceLoader({
    '@components/ui': {
      Column: native('Column'),
      nativeFillWidth: [],
      useAuthTheme: () => ({ colors: {} }),
      UniversalButtonContent: native('Button'),
      AuthText: native('Text'),
      AuthScreenFrame: (props) => {
        calls.renders++;
        return h('Frame', props, props.children);
      },
      FormSubmit: native('Submit'),
      FormTextInput: native('Input'),
    },
    'expo-router': {
      Redirect: (props) => {
        calls.renders++;
        return h('Redirect', props);
      },
      router: { dismissTo() {} },
    },
    '@tanstack/react-query': { useMutation: () => ({ isPending: false, mutate() {} }) },
    '@/features/auth/auth-flow.context': {
      useAuthFlow: () => {
        const [registrationChallenge, update] = useState(challenge);
        updateChallenge = update;
        return {
          registrationChallenge,
          canResendRegistration: true,
          confirmRegistration() {},
          resendRegistration() {},
          clearChallenge() {},
        };
      },
    },
    '@/features/auth/hooks/use-auth-form': {
      useAuthForm: () => ({ form: { control: {}, reset() {} }, submit() {}, pending: false }),
    },
  });
  const { VerifyEmailScreen } = load('features/auth/screens/verify-email-screen.tsx');
  const view = renderFixture(h(VerifyEmailScreen));
  return {
    view,
    calls,
    updateChallenge: (next) => view.flush(() => updateChallenge(next)),
    resend: () => view.findAll('Button').find(({ props }) => props.testID === 'auth-verify-resend'),
  };
}

test('verification countdown stops idle renders and still expires the code at its deadline', (t) => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout', 'setInterval'], now: epoch });
  const s = setup({
    challengeId: 'first',
    otpResendAvailableAtUtc: at(3),
    otpExpiresAtUtc: at(20),
  });
  try {
    assert.equal(s.resend().props.disabled, true);
    assert.match(s.resend().props.label, /3/);
    for (const seconds of [2, 1]) {
      s.view.flush(() => t.mock.timers.tick(1000));
      assert.match(s.resend().props.label, new RegExp(String(seconds)));
    }
    s.view.flush(() => t.mock.timers.tick(1000));
    assert.equal(s.resend().props.disabled, false);
    const before = s.calls.renders;
    s.view.flush(() => t.mock.timers.tick(16_000));
    assert.equal(s.calls.renders, before);
    assert.equal(s.view.findAll('Submit').length, 1);
    s.view.flush(() => t.mock.timers.tick(1000));
    assert.equal(s.calls.renders, before + 1);
    assert.equal(s.view.findAll('Submit').length, 0);
    s.view.flush(() => t.mock.timers.tick(60_000));
    assert.equal(s.calls.renders, before + 1);
  } finally {
    s.view.unmount();
  }
});

test('replaced verification deadlines restart the countdown and expire before a later resend deadline', (t) => {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout', 'setInterval'], now: epoch });
  const s = setup({
    challengeId: 'first',
    otpResendAvailableAtUtc: at(-1),
    otpExpiresAtUtc: at(60),
  });
  try {
    s.view.flush(() => t.mock.timers.tick(10_000));
    s.updateChallenge({
      challengeId: 'second',
      otpResendAvailableAtUtc: at(13),
      otpExpiresAtUtc: at(12),
    });
    s.view.flush(() => {});
    assert.equal(s.resend().props.disabled, true);
    assert.match(s.resend().props.label, /3/);
    s.view.flush(() => t.mock.timers.tick(1000));
    s.view.flush(() => t.mock.timers.tick(1000));
    assert.equal(s.view.findAll('Submit').length, 0);
    assert.equal(s.resend().props.disabled, true);
    s.view.flush(() => t.mock.timers.tick(1000));
    assert.equal(s.resend().props.disabled, false);
  } finally {
    s.view.unmount();
  }
  const before = s.calls.renders;
  t.mock.timers.tick(120_000);
  assert.equal(s.calls.renders, before);
});

for (const [label, challenge] of [
  ['absent', null],
  [
    'invalid',
    { challengeId: 'first', otpResendAvailableAtUtc: 'invalid', otpExpiresAtUtc: 'invalid' },
  ],
  ['elapsed', { challengeId: 'first', otpResendAvailableAtUtc: at(-1), otpExpiresAtUtc: at(-1) }],
]) {
  test(`${label} verification deadlines do not keep rendering an idle screen`, (t) => {
    t.mock.timers.enable({ apis: ['Date', 'setTimeout', 'setInterval'], now: epoch });
    const s = setup(challenge);
    try {
      const before = s.calls.renders;
      s.view.flush(() => t.mock.timers.tick(60_000));
      assert.equal(s.calls.renders, before);
    } finally {
      s.view.unmount();
    }
  });
}
