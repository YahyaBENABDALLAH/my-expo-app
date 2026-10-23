# Component previews

The ordinary application component browser is `/ui`, with individual examples under
`/ui-component/[name]`. Enable it with `EXPO_PUBLIC_ENABLE_DEV_SCREENS=true` before
starting Metro or exporting a preview bundle. The default is false. The Home link,
Settings section and both route entries share `src/config/developer-tools.ts`.
Disabled direct URLs are protected by the root Stack and fall back to Home.
This is client-side navigation control, not a security or bundle-removal boundary.
The Bottom Sheet page includes the retained local OTP demo;
the Buttons page includes counted floating actions. `/ui-component/loading`
contains two independently retryable local query sections. Demo data stays in showcase
code and does not replace production auth requests.

## Launch the maintained examples

Use a matching iOS/Android development build; the configured native modules need
that build. The local default brand is the unlinked template. For an existing
Likan build, set `APP_BRAND=likan` and `APP_VARIANT=development` first. See
[development setup](development.md#brand-and-environment-configuration).

Catalog only, in PowerShell:

```powershell
$env:EXPO_PUBLIC_ENABLE_DEV_SCREENS = 'true'
$env:EXPO_PUBLIC_STORYBOOK_ENABLED = 'false'
npm start -- --dev-client --clear
```

Open the application, then **Home → Components**, or the Components section in
Settings. For fixture Controls and focused compositions:

```sh
npm run storybook
```

The cross-platform launcher sets `NODE_ENV=development` and both public preview
flags for that child process, then starts Metro with `--dev-client --clear`.
Open **Home → Storybook**. The route
is `/storybook`; `/storybook?storyId=components-button--primary&canvas=true`
selects a fixture without the Storybook browser chrome. Omit `canvas=true` for
the full browser and Controls. Changing the route's mode or requested fixture
recreates its Storybook root; in-browser Controls/story changes follow Storybook's
normal lifecycle. The app PageFrame supplies startup readiness, safe areas and Back.
Optional CLI arguments pass through, for example `npm run storybook -- --port 8093`.
The command never changes `.env`, saved app settings, package versions or EAS state.

`EXPO_PUBLIC_STORYBOOK_ENABLED=true` is an explicit development-server opt-in.
The route also requires `__DEV__`. Metro uses the installed v10
[route integration](https://github.com/storybookjs/react-native/blob/next/docs/docs/intro/getting-started/expo-router.md),
with registration/UI imports isolated in `src/features/storybook/` and
`.rnstorybook/`. Release mode disables the Metro integration and removes the
conditional Storybook require even if the opt-in flag is accidentally true.
Do not import fixtures or Storybook from shared UI or ordinary feature code.

The EAS development and preview profiles enable the catalog and disable Storybook;
production disables both. A development client connected to `npm run storybook`
uses that server's flags. An embedded preview/release bundle uses the flags from
its export, build or update. Restart Metro with `--clear` and fully reload after
changing preview modes, because the Storybook flag also changes Metro resolution.
For a client configuration, leave both flags false and verify Home/Settings,
`/ui`, `/ui-component/buttons` and `/storybook` on the installed app.

## Bundle boundary and verification

Protected routes hide access; they leave catalog modules reachable in Router's
dependency graph. This implementation deliberately retains that ordinary showcase
code, including its locale strings. Do not claim it is stripped from client builds.
Storybook packages, fixtures and generated registration must be absent from
production graphs. Inspect both iOS and Android source maps after changes to Metro,
entry points, preview flags or the Router/Expo UI versions:

```sh
npx expo export --platform all --clear --source-maps --output-dir .expo/preview-boundary --max-workers 2
```

Check `sources` (including indexed map sections) for `.rnstorybook`,
`node_modules/@storybook`, `node_modules/storybook` and `src/features/ui-showcase`.
Expect no Storybook sources in release mode; expect the showcase modules to remain.
Repeat with the catalog enabled for preview builds. A successful bundle proves
module resolution, not native routing, hit targets, keyboard behavior or layout.
No automated suite or comparison runner is part of this workflow.

Use `--clear` when exporting after a flag change. In this SDK 57 checkout,
back-to-back exports with opposite catalog flags reused the earlier transformed
flag module until the cache was cleared. Source-map source text is the original
TypeScript and cannot establish the compiled flag values. Inspect the emitted JS
or Hermes bytecode as well as the dependency graph: client catalog/Storybook must
be false/false; an enabled preview must be true/false.

## Fixture maintenance

Update native stories for shared UI changes and run `npm run storybook:generate`.
Launch Screen has Ready, Waiting and ReducedMotion fixtures. Floating Action has
Interactive, Disabled and RepeatedActions fixtures. Typechecking includes stories,
but fixture registration does not prove native behavior.

Launch Screen also retains MinimalReady and MinimalWaiting, with an explicit
mode Control; the existing stories remain branded. Page Header adds PlainHeader
and ChangeHeaderStyle. In the latter, type a draft and press Back to alternate
Dunes/Default: draft, content count and scroll position should survive. The
normal Settings header picker exposes all four styles in the running app.
Verify branded hold/exit, background/resume, live Reduce Motion, actual login
and recovery readiness on matching native builds. These observations remain
pending; source/fixture registration is not a startup or frame-rate measurement.

Launch and auth fixtures use the configured build's name, artwork and heading
font. The launch Replay control retains a stable selector. To inspect the other
brand, restart Metro with its selectors and use a matching native build; these
fixtures do not provide runtime tenant switching. Both brands' font rendering,
Arabic fallback and artwork need native verification. See [bundled assets](assets.md).

`/ui-component/text` now has local UX/Instagram and appearance controls, samples
on three page surfaces, explicit text-color overrides and a counted primary
button. The retained `Components/Text/ThemeComparison` story uses that same
composition. Its provider stays in memory; app appearance persistence belongs
only to the root. Check that scheme/palette changes retain the action count and
that returning to Settings leaves the configured palette and saved appearance
intact. See [appearance verification](appearance-themes.md).

The Buttons page's standalone section and retained `Components/Button/StandaloneHostLight`
and `StandaloneHostDark` compositions share the same preview implementation.
They compare forced light/dark appearance, inherited intrinsic width, diagonal
physical corners and disabled activation. Custom labels report their own Host's
scheme and direction. The retained fixtures add a local RTL toggle and counted
actions; check that direction changes preserve the count, edge taps count once
and disabled taps leave it unchanged. Native width, clipping, icon/text order and
touch behavior still require iOS/Android checks. Retained story registration alone
does not prove native behavior; use the opt-in route above.

For selector checks, the Loading and retry page uses explicit instance prefixes
and independent counts; retrying/resetting one section leaves the other intact.
Its retained `RepeatedQueries` story shares the same screen. Existing Loading
State stories keep the legacy default selectors. The Buttons page keeps the
standalone floating action's default selector and adds explicitly identified
enabled/disabled content actions. `RepeatedActions` covers two standalone actions
with separate counts; `WithoutFieldSelectors` in Login Form omits optional field
IDs. The Collapsible fixture's Host ID identifies layout, not its disclosure
header. Read each component's skill for its selector contract and remaining
upstream gaps. Native identifier lookup, activation, spoken names, focus order,
large text and RTL still require iOS/Android execution.
