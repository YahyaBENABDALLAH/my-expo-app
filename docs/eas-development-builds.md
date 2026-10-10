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

## iOS configuration

The iOS simulator development build submitted on 2026-10-10 failed during prebuild because the installed React Native Firebase config plugin requires `expo.ios.googleServicesFile`. Build ID: `64f44088-ab45-4e15-92c1-f79118d58c37`.

`app.json` now points `expo.ios.googleServicesFile` to `./GoogleService-Info.plist`.
The file exists, but its Firebase identifiers and API key are placeholders.
Native compilation can succeed with this file; Firebase initialization and
messaging cannot be considered configured or verified. In the existing Firebase
project, register or select the iOS app with bundle ID `com.hyrkul.likan`, download
its `GoogleService-Info.plist`, and replace the placeholder. Reference's plist
identifies `com.hyrkul.foodiya` and cannot be reused by changing only the bundle ID.

The development profile builds for the iOS simulator. Apple device signing and
provisioning have not been verified. The Firebase plugin uses CocoaPods with
`disableSPM: true`, static frameworks and static linking for `RNFBApp` and
`RNFBMessaging`.

The remote development environment now provides `EXPO_PUBLIC_API_URL`. The dev
client's Metro server also loads the project's local development environment
when serving JavaScript. See [the 2026-10-10 cleanup verification](build-verification.md)
for fresh builds of the unpatched dependency set and runtime verification limits.
