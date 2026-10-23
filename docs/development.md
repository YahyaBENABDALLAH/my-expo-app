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

## Brand and environment configuration

`app.json` owns shared native settings. `config/brands/*.json` owns each brand's
name, slug, URL scheme, bundle/application IDs, app/adaptive icons, native splash
and optional integration references. Its presentation IDs select the fixed
palette, heading fonts, in-app launch artwork, initial header style and launch
mode. `config/brand.js` validates and resolves the
selected manifest for `app.config.js`. Register a new manifest in its small
registry; do not copy identity fields into screens or the shared app config.

`presentation.header` accepts `default`, `dunes`, `ribbon` or `rain`. Both current
brands retain Dunes; a saved Settings choice overrides the configured initial
style. Default uses the rectangular native header, and all three animated choices
remain available. `presentation.launch` accepts `minimal` (the neutral template)
or `branded` (Likan). Minimal adds no artificial startup wait; branded keeps its
artwork and exit. Restart Metro after changing these public metadata fields.
See the [page](../.agents/skills/foodiya-ui-page/references/page-guide.md) and
[launch](../.agents/skills/foodiya-ui-launch-screen/SKILL.md) contracts for native
behavior and readiness. Saved header choices use the existing storage key.

Set these selectors in `.env.local` for local Expo commands:

```dotenv
APP_BRAND=template
APP_VARIANT=development
```

| Setting                          | Values and behavior                                                                        |
| -------------------------------- | ------------------------------------------------------------------------------------------ |
| `APP_BRAND`                      | `template` (local default) or `likan`; unknown IDs fail configuration                      |
| `APP_VARIANT`                    | `development` (default), `preview` or `production`; independent of brand and `NODE_ENV`    |
| `EXPO_PUBLIC_API_URL`            | Absolute HTTP(S) backend base URL; omit locally to browse public screens without a backend |
| `GOOGLE_MAPS_ANDROID_API_KEY`    | Optional key restricted to the selected brand's Android package                            |
| `EXPO_PUBLIC_ENABLE_DEV_SCREENS` | Exact `true` enables catalog links/routes; absent or other values disable them             |
| `EXPO_PUBLIC_STORYBOOK_ENABLED`  | Exact `true` opts into the Storybook route in development mode only                        |

`template` uses `com.example.mobiletemplate` / `expomobiletemplate`, generic
existing Expo artwork, and no EAS owner/project or Firebase file. `likan` retains
`com.hyrkul.likan`, `myappexpo`, its existing EAS link and Android Firebase file.
Its native display name is now `Likan`. These brands have different installation
identities. Variants within a brand deliberately share its identity, preserving
the installed Likan development clients and Firebase package mapping; they replace
one another rather than installing side by side. Add a separately registered
identity and matching integrations if side-by-side installation is required.

The existing EAS build profiles explicitly select `likan` and their matching
variant. For a new client, add its manifest and set the intended brand in the
relevant profile. Production requires an explicit brand, its own EAS owner and
project ID, and a configured API URL. The production variant of the unlinked
template is rejected. Asset existence and Android Firebase package matching
are checked during config resolution. These checks do not verify cloud access or
whether the backend is reachable.

Select the same brand/variant for Metro, configuration, builds and any later
submission/update command. EAS build-profile variables do not automatically apply
to an independent local command. Keep API values in the selected EAS environment;
do not use `NODE_ENV` as an environment selector. For example, in PowerShell:

```powershell
$env:APP_BRAND = 'likan'
$env:APP_VARIANT = 'development'
npm start
```

Changing native identity, icons, native splash or embedded fonts requires a matching
native build. To use a previously installed Likan client, select `likan` before
starting Metro. The local template can resolve and export without API credentials;
auth actions require a real backend and show safe configuration feedback otherwise.

Only `{ id, name, variant, presentation }` is projected to `extra.brand` for native consumers.
Read it through `src/config/brand.ts`; do not import Node config/manifests into
native application modules. Do not put credentials into this public metadata or
`EXPO_PUBLIC_` values. The common API normalizer is intentionally native-safe.

App-owned translated messages interpolate the public name; auth and launch use
the selected heading font and artwork. Public asset metadata and literal native
imports have separate small owners described in [bundled assets](assets.md).
Restart Metro after selecting a brand, and use a native build with the matching
embedded fonts. Arabic retains native fallback. The configured palette stays
fixed; user System/Light/Dark appearance is saved by the existing provider.
Component previews can select palettes locally without changing app preferences.
See [appearance setup and verification](appearance-themes.md), the
[launch contract](../.agents/skills/foodiya-ui-launch-screen/SKILL.md) and
[preview capabilities](storybook.md). These preview flags are build/update choices,
not persisted user settings. EAS development/preview enable the catalog; production
disables it. All profiles disable Storybook in their embedded bundles.

References: [Expo dynamic configuration](https://docs.expo.dev/workflow/configuration/)
and [app variants](https://docs.expo.dev/tutorial/eas/multiple-app-variants/).

## Starter screens

Home (`/`) and Settings (`/settings`) are public. UI showcase (`/ui` and
`/ui-component/[name]`) requires the catalog flag; disabled direct URLs fall back
to Home. Account (`/account`) requires a real authenticated session. Login,
registration, verification and password recovery retain their real backend flows.
The admin/admin shortcut and development guest authentication have been removed.

Home links to the enabled previews, Settings and Account/sign-in. Settings exposes working
preferences and the app version. There are no recipe, onboarding, map, Skia,
device-information, health-check or development-directory screens.

The in-app catalog is the ordinary component browser. `npm run storybook` starts
Metro with an explicit development-only `/storybook` entry and Home link for the
retained Controls/fixtures. See [component previews](storybook.md) for exact launch
commands and native verification. Protected catalog routes retain their source
modules in client bundles; Storybook integration is excluded from release graphs.

## Source layout

`src/features/home`, `auth`, `settings`, `ui-showcase` and `pages` own screen
presentation. Shared controls live in `src/components/ui`. `src/services/auth`
owns authentication; generic HTTP, query, pagination and mutation helpers remain
for future backend features. Recipe-specific services, DTOs and workflows are gone.

Before native testing, use an SDK-compatible development build. Static checks and
JavaScript exports do not establish native interaction, timing or live backend behavior.

## Client setup checklist

1. Add and register the client's manifest through the existing
   [brand configuration](#brand-and-environment-configuration). Set its own native
   identifiers, scheme, assets and integration references; keep existing client
   identities intact. Select that brand/variant consistently in local commands
   and the intended EAS profile/environment.
2. Register required palette/font/artwork IDs with their existing owners. Follow
   [asset setup](assets.md) and [appearance policy](appearance-themes.md); verify
   Arabic fallback and saved System/Light/Dark preferences. Native asset/font or
   identity changes require a matching native build.
3. Copy `.env.example` to `.env.local`, select the brand/variant and configure the
   device-reachable API origin and any required integration key. Keep secrets out
   of public environment values/metadata. Use your client's EAS owner/project and
   environment for production; the default template is deliberately unlinked.
4. Resolve `npx expo config --type public` with the intended selectors. Review
   identity, assets and public metadata before building; this read-only check
   does not prove backend access, signing or installed native behavior.
5. Leave preview flags false for the client bundle, or explicitly enable the
   catalog/Storybook for maintenance using the [preview guide](storybook.md).
   Clear Metro's cache when switching flags and verify release source graphs
   and compiled flag values as documented there.
6. Run `npm run check`, then exercise auth, preferences, keyboard/RTL,
   accessibility and retained animations on matching iOS/Android builds. Keep
   native and live-backend results separate from static/export checks. For any
   SDK/Expo UI change, follow the [adapter upgrade checklist](ui.md#adapter-responsibilities-and-upgrade-review)
   and review the UI/Router pins together.
