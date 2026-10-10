# Expo UI native-state lifecycle workaround

SDK 57 uses `@expo/ui` 57.0.21. Its `useNativeState` passes the observable through
`useReleasingSharedObject`, whose effect cleanup explicitly releases the native
object. React can clean up effects while retaining hook state. A later read or
native `value` prop then refers to an already released shared object. This is a
candidate for the Android login-screen error reported during startup; native
reproduction is still required to confirm that trigger.

`scripts/patch-expo-ui-native-state.js` replaces only that hook's allocation and
lifetime management with lazy React state. ObservableState remains alive while
React or another JS consumer holds it. Expo's ordinary SharedObject garbage
collection releases it once those references disappear. No module-level cache or
timed release is introduced. Native getter/setter and worklet listener behavior
are preserved. Components keep the supported observable `value` API, including
form resets, password visibility and uncontrolled input fallback values.

The patch applies during `npm install`/`npm ci` through `postinstall`. It is
idempotent and rejects unexpected versions/source layouts. Review and remove it
when updating `@expo/ui` or when upstream supplies a lifecycle fix. It does not
change the lifecycle of other Expo modules or require a native rebuild.

`node --test tests/layout/native-state-lifecycle.test.mjs` loads the installed
hook with mocked native objects and React lifecycle scheduling. Before the patch,
initial effect replay and hide/restore tests fail with the reported released-object
exception. The checks also cover edits, external resets and independent remounts;
they do not establish native rendering or garbage collection timing.

Native verification: cold-start login, type in both fields, toggle password
visibility, open another auth screen and return, then reload/Fast Refresh. Run
`.maestro/auth/login.yaml` on a connected Android device. iOS needs the equivalent
typing, reset and navigation checks. Neither platform was available during this fix.

References: [SDK 57 TextInput](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/textinput/),
[Expo shared objects](https://docs.expo.dev/modules/shared-objects/),
[React effect replay](https://react.dev/reference/react/StrictMode).
