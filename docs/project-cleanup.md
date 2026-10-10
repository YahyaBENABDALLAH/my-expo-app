# Project cleanup

Reviewed Expo SDK 57 configuration, native routes, shared UI wrappers, feature screens, Storybook stories, validation, dependencies, and test workflows.

## Changes

- Removed the unused template modal and its developer-instruction/link helpers.
- Kept routes under `src/app`, app UI under `src/components`, screen implementations under `src/features`, validation under `src/validation`, and story canvases under `.rnstorybook`.
- Consolidated hosted native UI sizing, theme selection, and container selector behavior in `UniversalHost`. Existing component test IDs and bounded List/FieldGroup/ScrollView viewports are retained.
- Extended the existing color palette instead of creating another theme. Controls follow the system appearance when no explicit scheme is supplied; light-theme validation colors have readable contrast.
- Added a development-only lazy Storybook route and disabled Storybook's Metro integration in production. Release source maps contain no Storybook sources.
- Stopped the Skia canvas when its tab loses focus. Status-bar settings now follow the active screen.
- Added route error boundaries for Maps, Skia, and Storybook so JavaScript rendering/loading failures retain the tab navigator. A missing or incompatible native module still requires the correct development build; error boundaries cannot repair native crashes.
- Preserved the Account tab when returning from registration/password reset.
- Added Prettier, EditorConfig, shared line-ending rules, unused TypeScript checks, import-boundary lint rules, and zero-warning linting for project source, scripts, and configuration.
- Expanded validation coverage to include name/password boundaries, confirmation requirements, and excessive email length.

## Dependencies

Retained all existing dependencies for planned features, including `@stepperize/react`, `@tanstack/react-query`, `axios`, `i18next`, `react-i18next`, `expo-blur`, `expo-camera`, `expo-device`, `expo-haptics`, `expo-image-picker`, `expo-linear-gradient`, `expo-location`, `expo-network`, `expo-notifications`, `expo-observe`, and `expo-web-browser`. These 16 packages were restored after the initial cleanup at the user's request. Do not remove dependencies solely because they are not yet imported by app source.

Image, Secure Store, Sharing, Updates, and framework infrastructure remain available.
Firebase packages remain installed; Android retains its configured native modules,
while iOS excludes them until a valid Firebase plist is supplied. The placeholder
iOS bootstrap was removed after a startup crash was reported. Storybook controls
require the community slider, date picker, bottom sheet, and SVG peers even though
app screens use Expo UI.

The selected redundancy cleanup on 2026-10-05 removed the web-only CanvasKit copy
script, generated WASM and unused favicon. The 2026-10-10 cleanup removes the
Expo UI postinstall patch and its workaround-specific tests and notes. Expo SDK
57 packages now use the compatible patch releases selected by `expo install
--fix`, including Expo `57.0.27`. Expo UI stays pinned to the unmodified `57.0.21`
release because native testing found a numeric-width crash in `57.0.22`; see
[the version decision](build-verification.md#expo-ui-version). Navigation now waits
for session/language restoration before allocating native screen state. The lockfile
is synchronized; application controls use the supported Expo UI observable API.

The package lock is synchronized. The original dependency set remains available alongside the project cleanup and security fixes.

### Security overrides

The audit initially reported 26 findings, including six high-severity findings. Narrow overrides address vulnerable transitive dependencies while retaining the Expo SDK:

| Dependency                  | Decision                                                                           | Verification                                  |
| --------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------- |
| Firestore's `@grpc/grpc-js` | Use `^1.14.5`, within the same major version                                       | Dependency resolution and audit               |
| Storybook MCP's `valibot`   | Use `^1.5.0`, within the same major version                                        | Story discovery and audit                     |
| Xcode parser's `uuid`       | Use `^11.1.1`, which retains the CommonJS `v4` API consumed by `xcode`             | Xcode project UUID generation                 |
| `esbuild`                   | Use `~0.26.0`, a nonaffected version supported by Storybook and `esbuild-register` | TypeScript transform and Storybook generation |

Review these overrides during dependency updates and remove them once upstream packages resolve patched versions themselves.

The 2026-10-10 audit reports 27 findings (24 high and three moderate), including
dependency chains through `braces`, `node-forge` and `decode-uri-component`.
The registry has no patched `braces` or `node-forge` release at this review date.
The patched decoder changes from CommonJS to ESM, while the installed query
parser expects a callable CommonJS export. Forcing the replacement would break
query parsing. Do not use `npm audit fix --force`, which also proposes incompatible
Expo downgrades; these findings require compatible upstream updates. Track
[the decoder advisory](https://github.com/advisories/GHSA-vcc3-ghjq-m6fr),
[the braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) and
[the node-forge advisory](https://github.com/advisories/GHSA-86w9-cpqp-85rv).

## Verification

- `npm run check`: strict TypeScript, zero-warning lint, formatting, and 290 tests.
- `npx expo-doctor`: all 21 checks pass.
- Android and iOS production JavaScript exports pass; source-map inspection confirms Storybook is excluded.
- Android and iOS development JavaScript exports also pass, including the Storybook stories and controls.
- Development Storybook discovery generation passes.
- The 2026-10-10 cleanup includes successful Android and iOS simulator EAS builds
  and Android emulator checks. See [the build verification report](build-verification.md)
  for artifacts, interaction results and the remaining iOS/Firebase limits.

Run `npm run check` before committing. Use the documented Maestro flows when device automation is resumed.
