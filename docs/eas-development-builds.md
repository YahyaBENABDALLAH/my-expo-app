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

The subsequent simulator build compiled with a placeholder plist, but the user
reported that it closes before the splash screen. The Firebase config plugin
calls `FirebaseApp.configure()` before React Native starts. Firebase iOS SDK
`12.18.0` rejects the placeholder `GOOGLE_APP_ID` with a native exception.

Firebase has no current application consumers, so the startup repair removes
its bootstrap plugins and iOS Google-services reference. `expo.autolinking.ios.exclude`
keeps `@react-native-firebase/app` and `@react-native-firebase/messaging` out of the
iOS binary. Their npm packages remain installed for future features. The obsolete
Firebase framework/linking overrides are also removed. The placeholder file remains
in the repository but is not bundled or used by the new iOS build.

Android keeps its valid `google-services.json` and both Firebase native modules.
Expo's default plugins copy the JSON and configure the Google Services Gradle
plugin from `android.googleServicesFile`; the removed Firebase plugins were
redundant for this project's Android settings. Android native config introspection
is unchanged after this repair.

Replacement [iOS simulator build 1f0c2bdb-b8c6-4b5f-83db-527d05a4baba](https://expo.dev/accounts/ybenabdallah/projects/likan/builds/1f0c2bdb-b8c6-4b5f-83db-527d05a4baba)
finished successfully with the existing `development` profile and cleared cache.
[Download the replacement simulator app](https://expo.dev/artifacts/eas/H-kPam29-3hFRILDdwXnUYNH-zkEyTV8TGtwSQYSM9c.tar.gz).
Install this replacement; the previous iOS artifact contains the
invalid bootstrap and cannot be corrected by a Metro reload.

To enable Firebase on iOS later, obtain the Firebase-generated plist for
`com.hyrkul.likan`, restore its native plugins and framework configuration, remove
the iOS autolinking exclusions and create a new native build. Reference's plist
identifies `com.hyrkul.foodiya` and cannot be reused by changing only the bundle ID.
Apple device signing and provisioning remain unverified.

The remote development environment now provides `EXPO_PUBLIC_API_URL`. The dev
client's Metro server also loads the project's local development environment
when serving JavaScript. See [the 2026-10-10 cleanup verification](build-verification.md)
for fresh builds of the unpatched dependency set and runtime verification limits.
