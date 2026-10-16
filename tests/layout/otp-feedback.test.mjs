import assert from 'node:assert/strict';
import { createElement as h, useState } from 'react';
import test from 'node:test';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

function setup(initial) {
  let update;
  let motionReads = 0;
  let motion = true;
  const native = (name) => (props) => h(name, props, props.children);
  const Icon = native('Icon');
  Icon.select = ({ ios }) => ios;
  const { OtpFeedback } = createSourceLoader({
    '@expo/ui': { Icon, RNHostView: native('RNHostView') },
    'react-native-reanimated': {
      __esModule: true,
      default: { View: native('AnimatedView') },
      cubicBezier: (...values) => values,
    },
    '@/hooks/use-motion-enabled': {
      useMotionEnabled: () => {
        motionReads++;
        return motion;
      },
    },
    '@/hooks/use-theme': { useThemeColors: () => ({}) },
    '@/components/ui/host/universal-host': {
      UniversalHost: native('Host'),
      useHostColorScheme: () => 'dark',
    },
    '@expo/material-symbols/verified_user.xml': 1,
    '@expo/material-symbols/gpp_maybe.xml': 2,
    '@expo/material-symbols/shield_lock.xml': 3,
  })('components/ui/otp-bottom-sheet/otp-feedback.tsx');
  function Fixture() {
    const [props, setProps] = useState(initial);
    update = (next, enabled = motion) => {
      motion = enabled;
      setProps(next);
    };
    return h(OtpFeedback, props);
  }
  const view = renderFixture(h(Fixture));
  return { view, update, motionReads: () => motionReads };
}

test('hidden feedback allocates no animation; motion settings remove and restore CSS keyframes', () => {
  const s = setup({ visible: false, status: 'success' });
  try {
    assert.equal(s.motionReads(), 0);
    assert.equal(s.view.findAll('AnimatedView').length, 0);
    s.view.flush(() => s.update({ visible: true, status: 'success' }));
    const artwork = () => s.view.findAll('AnimatedView')[0].props;
    assert.equal(artwork().style[1].animationDuration, 180);
    assert.equal(artwork().pointerEvents, 'none');
    s.view.flush(() => s.update({ visible: true, status: 'success' }, false));
    assert.equal(artwork().style[1], undefined);
    s.view.flush(() => s.update({ visible: true, status: 'error' }, true));
    assert.equal(artwork().style[1].animationDuration, 200);
    assert.deepEqual(artwork().style[1].animationName.to.transform, [{ translateX: 0 }]);
  } finally {
    s.view.unmount();
  }
});
