# Native Storybook and future testing

## Existing integration

- Native Storybook `10.7.0` with matching on-device actions/controls and Storybook core `10.6.2`. Install with `npm ci`; npm overrides keep native modules shared with the app. The obsolete Yarn Classic lockfile was removed because it ignored those overrides and installed a duplicate safe-area provider.
- `.rnstorybook/main.ts` discovers `.rnstorybook/stories/**/*.stories.?(ts|tsx|js|jsx)`.
- `.rnstorybook/preview.tsx` defines shared parameters.
- `.rnstorybook/components/native-story-frame.tsx` supplies a native canvas and theme controls. Its RN infrastructure boundary measures available width and gives intrinsically sized RNHostView children a finite width; percentage-width Hosts otherwise collapse.
- `src/features/storybook/storybook-screen.tsx` seeds initial selection from Router params; `.maestro/helpers/open-story.yaml` opens the target directly by `STORYBOOK_STORY_ID`. The custom canvas uses the supported `CustomUIComponent` option, omits the built-in accessibility group and preserves the app-owned safe areas/status bar. `.maestro/storybook/direct-links.yaml` covers lazy loading and browser/canvas changes.
- Existing Maestro flows cover switch, checkbox, list, bottom sheet, and several TextInput scenarios. Inspect those flows before extending them; existence does not mean they were executed successfully.
- Button and loading-state stories have focused flows in `.maestro/storybook/button.yaml` and `loading-state.yaml`. Buttons test visible press counts, disabled suppression and reset. `button-corners.yaml` checks upper/lower edge activation on the two diagonal corner fixtures; skeleton playback uses the CSS-driven standalone fixtures. Loading tests persistent retry, completion and offline context. Run them before claiming native verification.

Use native Storybook on iOS and Android. Do not add Vite, a browser Storybook, web renderers, or browser test runners. The Storybook tool's own internal native controls are tooling; application component examples must follow the project's Expo UI constraint.

## Stories for every component

Use typed CSF metadata and story objects from `@storybook/react-native`. Reuse the production component and theme, not a copied demo implementation. Keep controls limited to meaningful supported props and wire callbacks to actions for inspection.

Interactive stories need a small stateful harness so typing, tapping, selection, and reset visibly work. Action logging alone does not demonstrate that the component changed state. Keep fixtures local, deterministic, and independent of auth, network, notifications, or real user data.

Cover default, light/dark, disabled/read-only, relevant variants, and long/empty content where those states apply. Avoid generating irrelevant permutations. Use Controls for brand/seed, spacing, width and minor prop variations; do not add a separate story for every combination. Keep test IDs and callbacks out of the Controls panel. Infrastructure and compound parts can share composition stories, provided their behavior is specifically exercised.

Buttons have no default variant: declare intent in every fixture. Use content components within a Host and standalone hosted wrappers only at RN boundaries. The shared story frame uses Expo UI scrolling with `RNHostView` for standalone RN-root fixtures. Loading fixtures must separate disabled, paused, fetching, initial failure, empty success and cached refresh/failure. Mocked JS render tests establish state selection only; native progress visibility, press bounds and accessibility still require a device.

A Host does not provide stack layout for direct siblings. Group status labels and controls in Row/Column to prevent overlap. The reference-navigation story's state/action labels were corrected after the native flow exposed this problem; use its observable state assertions to verify the actual fixture rather than relying only on a tab selector shared with the app navbar.

Use stable `testID` values on the actual native target, not only its Host or decorative wrapper. Add distinct status/output selectors for assertions. Verify that selectors reach the native accessibility hierarchy on both platforms. Document accessibility semantics only when supported by the installed API; do not invent RN accessibility props on universal controls.

After story additions, run `npm run storybook:generate`; do not hand-edit `storybook.requires.ts`. Inspect story registration and run lint/typecheck. Keep stories development-only through the existing integration; do not add static production imports from story files.

## Meaningful verification

| Layer                       | What it can establish                                        | Limits                                                                      |
| --------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Typecheck and lint          | Valid imports, prop contracts, source checks                 | Cannot establish rendering or native interaction                            |
| Node unit tests             | Pure mapping, validation, or state logic                     | Cannot render SwiftUI or Compose                                            |
| Native Storybook inspection | Real control layout, theme, focus, feedback                  | Requires iOS/Android execution; manual inspection is not automated coverage |
| Maestro flows               | Real typing/tapping/selection/dismissal and resulting output | Needs a running native app and usable selectors                             |
| Native screenshots          | Appearance on a known device/theme/font size                 | Capture alone is not regression comparison                                  |

For interactive components, add or update an affected Maestro flow when implementing behavior. Reuse the existing story-opening helper and read current app IDs/schemes rather than hardcoding values from this snapshot. Assert outcomes: one action per press, no change when disabled, typing and clearing update output, selecting changes value, dismissal closes a sheet, and reset restores state. Prefer readiness conditions to fixed sleeps.

Unit render tests or portable stories may be added when they provide useful coverage and compatible tooling is available. Treat native-view mocks as JS-contract checks, never evidence of native colors, geometry, keyboard, or press behavior. Do not install a new test stack merely for a trivial wrapper.

For visual comparison, pin platform, OS, device dimensions, font scale, locale, theme, and fixtures. Maintain separate native baselines. Add an actual comparison step and review changes before reporting automated visual coverage.

Existing commands include `npm run test:e2e:input` and `npm run test:e2e`; run only applicable flows with the required device/app available. Report precisely which checks ran and which platform remains unverified.

## Official guidance

- [Native Storybook overview](https://storybookjs.github.io/react-native/docs/intro/)
- [Writing native stories](https://storybookjs.github.io/react-native/docs/intro/writing-stories/)
- [Testing and Maestro with native Storybook](https://storybookjs.github.io/react-native/docs/intro/testing/)

Recheck guidance against installed versions before adopting setup examples. Storybook testing documentation includes web-oriented imports and optional dependencies; follow this project's native setup rather than copying those examples indiscriminately.
