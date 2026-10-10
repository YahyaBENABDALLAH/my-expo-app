# EAS development builds

Requested 2026-10-03 after the global checks passed. Used the existing `development` profile with `developmentClient: true`, internal distribution, and the development environment. EAS login and linked project were verified.

## Android

The first build failed at `:app:processDebugResources`: `drawable/splashscreen_logo` was missing. The installed SDK 57 splash plugin references this drawable in its theme even when no image is configured. Fixed `app.json` by setting the existing `assets/images/splash-icon.png`, width 200, and `contain` resize mode.

Verified a fresh isolated Android prebuild generates the logo in all five density folders. `npm run check` passed (typecheck, lint, formatting, 73 tests). No generated native files were edited by hand.

Replacement submitted with existing remote signing credentials. Verified final EAS state: `FINISHED`, no build error, with build artifact upload completed. Native compilation and APK packaging succeeded; installation and device behavior remain unverified.

- Replacement build ID: `3bb7e03e-5414-49ce-8749-1b76b03791a3`
- [Replacement build status and installation artifact](https://expo.dev/accounts/ybenabdallah/projects/likan/builds/3bb7e03e-5414-49ce-8749-1b76b03791a3)

- Failed build ID: `bb2fb613-9756-47c7-9533-a934b1f9e61c`
- App ID: `com.hyrkul.likan`
- [Build status and installation artifact](https://expo.dev/accounts/ybenabdallah/projects/likan/builds/bb2fb613-9756-47c7-9533-a934b1f9e61c)

## iOS blocker

Not submitted: the installed React Native Firebase config plugin requires `expo.ios.googleServicesFile`, which is absent. No matching plist was found in the app. Reference's `GoogleService-Info.plist` identifies `com.hyrkul.foodiya`, while this app uses `com.hyrkul.likan`; it cannot be reused by changing only the bundle ID. The EAS development environment does not expose a matching iOS Firebase file variable.

Supply the Firebase iOS configuration for `com.hyrkul.likan` as a local file path or an EAS file environment variable. Then configure its path, validate the app configuration, and start the development build. Apple signing/device provisioning has not been verified yet.

The remote development environment has no `EXPO_PUBLIC_API_URL`; the dev client's Metro server loads the project's local development environment when serving JavaScript. Android native build completion is verified; actual device behavior remains unverified.
