# Native Storybook

All 38 story files (193 stories) share the app's theme through `preview.tsx` and
`components/story-theme.tsx`. Use **themeId** and **colorScheme** in Controls;
individual stories retain their explicit light/dark starting appearance.
The default brand is WhatsApp. Theme Tokens, App Settings and Wireframe Button
fixtures start with UX Template. Preference stories also offer System mode.

The shared decorator owns the only story theme provider, canvas background and
native presentation appearance. It removes `themeId` before rendering component
props. Selecting another story or changing theme Controls resets the fixture.
Changing preferences inside a story keeps its local draft and never changes the
app's theme preferences. Leaving the Storybook tab restores the app's native
appearance while preserving the mounted story's state.

Use `useThemeColors()` for colored fixtures and `UniversalTextContent` inside a
Host. Native controls keep their platform appearance and shared tint. Leave
illustrative image colors in the artwork. The Theme Tokens story shows 13 core
semantic roles; the production tokens page remains the complete inventory.

`NativeStoryFrame` keeps its measured RN bridge because standalone hosted
components need a finite width. Full-page, keyboard and artwork stories retain
their dedicated layouts. Interaction harnesses, story IDs and native selectors
remain available to the existing Maestro flows.

After story changes, run `npm run storybook:generate`, `npm run typecheck` and
`npm run lint`. `tests/layout/storybook-theme.test.mjs` checks the real shared
decorator's theme selection, isolation, resets and native appearance cleanup.
These JS checks do not establish SwiftUI/Compose rendering or touch behavior.

On 2026-10-16, the iOS Maestro Wireframe Buttons flow could not reach Storybook:
the development client stopped during startup with `PlatformConstants` missing
from the native binary. Native light/dark appearance and activation remain
unverified; no Android device was available.

Guidance checked with Context7 and the installed package types:

- [Native Storybook decorators](https://storybookjs.github.io/react-native/docs/intro/configuration/)
- [Expo SDK 57 Host](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/host/)
- [React Native 0.86 Appearance](https://reactnative.dev/docs/0.86/appearance)
