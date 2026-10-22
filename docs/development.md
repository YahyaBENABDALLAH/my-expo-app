# Development

This iOS/Android starter uses Expo SDK 57 and native Expo UI. Keep non-route code
outside `src/app/`; read the [architecture](architecture.md) and [UI guide](ui.md).

## Run and check

Use Node 22.18+ and `npm ci`, then `npm start`. Configure `EXPO_PUBLIC_API_URL`
in `.env.local` for your backend. Retain the npm lockfile and use `npx expo install`
when explicitly adding a dependency. Installed packages are intentionally retained,
including packages for future features; unused packages are not a reason to remove them.

- `npm run typecheck` checks application and retained native story sources.
- `npm run lint` checks with zero warnings allowed.
- `npm run check` additionally checks formatting.
- `npm run format:check` checks maintained source, docs, skills, configuration and
  native stories. `npm run format` writes formatting to the same scopes. Both
  avoid traversing generated folders such as `.expo/`; keep their scopes aligned
  when adding a new source root. New files inside these scopes are included even
  before they are tracked by Git. Existing `.prettierignore` exclusions still apply.
- `npm run storybook:generate` updates native story registration.

The GitHub quality workflow runs the same `npm run check` after installing locked
dependencies and generating native story registration. Automated suites and
Maestro flows are absent. Keep stable native selectors and verify changed
interactions through the existing native examples; do not restore historical
test commands as part of normal feature work.

## SDK and native verification baseline

Keep the current Expo SDK 57, `@expo/ui` 57.0.21 and Expo Router 57.0.24 pins while
implementing the white-label changes. The UI/Router pairing and install exclusions
are intentional native compatibility choices; the original evidence is in
[build verification](build-verification.md#expo-ui-version). Reassess them together
in a dedicated upgrade with current SDK documentation and native verification.

Before changing startup or header motion, record the existing behavior on the
same release-like native builds/devices used for the comparison. Record device,
OS, configuration and sample count. Static checks and exports establish neither
frame rates nor native interaction. If devices are unavailable, leave that
comparison pending in the [implementation plan](white-label-template-plan.md).

## Starter screens

Home (`/`), UI showcase (`/ui` and `/ui-component/[name]`) and Settings (`/settings`)
are public. Account (`/account`) requires a real authenticated session. Login,
registration, verification and password recovery retain their real backend flows.
The admin/admin shortcut and development guest authentication have been removed.

Home links to the showcase, Settings and Account/sign-in. Settings exposes working
preferences and the app version. There are no recipe, onboarding, map, Skia,
device-information, health-check or development-directory screens.

The routed Storybook screen and Metro integration are removed. Its packages,
scripts and native source fixtures remain available for component maintenance;
`npm run storybook` currently starts Metro without a routed Storybook UI. The
in-app component catalog is the template's interactive component browser.

## Source layout

`src/features/home`, `auth`, `settings`, `ui-showcase` and `pages` own screen
presentation. Shared controls live in `src/components/ui`. `src/services/auth`
owns authentication; generic HTTP, query, pagination and mutation helpers remain
for future backend features. Recipe-specific services, DTOs and workflows are gone.

Before native testing, use an SDK-compatible development build. Static checks and
JavaScript exports do not establish native interaction, timing or live backend behavior.
