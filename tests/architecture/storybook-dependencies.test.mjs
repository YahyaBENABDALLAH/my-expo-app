import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const appRequire = createRequire(new URL('../../package.json', import.meta.url));
const requesters = [
  'expo-router',
  '@storybook/react-native',
  '@storybook/react-native-ui',
  '@storybook/addon-ondevice-actions',
  '@storybook/addon-ondevice-controls',
];

// A nested safe-area copy previously registered RNCSafeAreaProvider twice and
// crashed Storybook even though the application passed lint and typecheck.
for (const dependency of [
  'react',
  'react-native',
  'react-native-safe-area-context',
  'react-native-gesture-handler',
  'react-native-reanimated',
]) {
  test(`Storybook and the app share one ${dependency} implementation`, () => {
    const expected = appRequire.resolve(dependency);
    for (const requester of requesters) {
      const resolveFromPackage = createRequire(appRequire.resolve(requester));
      assert.equal(
        resolveFromPackage.resolve(dependency),
        expected,
        `${requester} must resolve the app's ${dependency}; reinstall with npm ci`,
      );
    }
  });
}
