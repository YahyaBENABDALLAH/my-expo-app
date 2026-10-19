# Project analysis — 2026-10-18

The project has a sound technical foundation, but product completeness and release operations need work before a public launch. Keep the existing architecture. Prioritize complete data flows, recovery after successful writes, production route boundaries, native verification, and OTA configuration.

This review covers the current working tree, including existing uncommitted changes. Application source and configuration were left intact. Historical audit documents were treated as background; findings below were checked against current files. UI/UX conclusions are based on source and portable tests; no current native visual or interaction review was completed.

| Area         | Assessment                                              | Main remaining work                                                                      |
| ------------ | ------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Architecture | Clear responsibilities and useful enforcement           | Complete backend query contracts and recover partial successes                           |
| Components   | Strong shared native foundation                         | Verify platform behavior and keep demonstrations out of release routes                   |
| Performance  | Good safeguards; device performance unmeasured          | Reduce repeated Home content, measure persistent artwork and native hosting              |
| UI/UX        | Consistent primitives; incomplete product behavior      | Replace sample Home, finish settings, persist appearance preferences                     |
| Production   | Local quality checks pass; release readiness incomplete | Resolve functional gaps, dependency exposure, monitoring, and native smoke coverage      |
| OTA          | Package installed; delivery unconfigured                | Configure update URL, runtime compatibility, channels, environments, and rollout process |

**1. Architecture**

The app uses Expo `57.0.27`, React Native `0.86.3`, React `19.2.3`, Expo Router `57.0.24`, and Expo UI `57.0.21`. The SDK and React Native/React versions agree with the [SDK 57 reference](https://docs.expo.dev/versions/v57.0.0/). There are no `ios/` or `android/` directories; native projects are generated through CNG.

The dependency direction is sensible: routes compose feature screens; feature workflows call query/mutation adapters; entity services own HTTP contracts; schemas validate responses; shared UI owns native presentation. See [architecture](/Users/yahya/Documents/Expo/my-expo-app/docs/architecture.md:3), [query utilities](/Users/yahya/Documents/Expo/my-expo-app/src/services/query-utils.ts:21), and [response validation](/Users/yahya/Documents/Expo/my-expo-app/src/services/api.ts:310).

Strengths include strict TypeScript, enforced import boundaries, separate finite/infinite query keys, abortable reads, targeted invalidation, serialized SecureStore access, one refresh operation per session generation, and checks preventing late responses from affecting a different account. Query focus and connectivity follow native lifecycle events. These safeguards address real races and should be retained.

Three concrete correctness gaps deserve attention:

- **Creations can omit the user's recipes.** [CreationsScreen](/Users/yahya/Documents/Expo/my-expo-app/src/features/recipes/collection-screens.tsx:173) fetches the first 100 public recipes, then filters them by chef locally. A recipe outside that page never appears. The current [recipe list contract](/Users/yahya/Documents/Expo/my-expo-app/src/types/recipe.types.ts:38) has no chef filter. Add a documented server query or account-owned endpoint and paginate it; do not invent a parameter the backend may ignore.
- **Several screens stop after one page.** [CategoryScreen](/Users/yahya/Documents/Expo/my-expo-app/src/features/recipes/browse-screens.tsx:20) has no next-page control. [Liked recipes](/Users/yahya/Documents/Expo/my-expo-app/src/features/recipes/queries.ts:31) request 50 items, with no continuation in the saved screen. Search filters and creation's cuisine/difficulty/unit selectors consume only the first 20 lookup items. Search results themselves already have pagination; ingredient browsing also has pagination.
- **Chef registration can report failure after the server succeeds.** [The mutation](/Users/yahya/Documents/Expo/my-expo-app/src/services/chef-profile/chef-profile.mutations.ts:31) awaits local auth metadata persistence after POST, before cache maintenance and success navigation. If SecureStore fails, the form presents a generic failure and permits another submission. A temporary probe using the actual mutation, Axios client, and TanStack cache with mocked I/O produced two successful mocked POSTs, two error states, and no seeded detail cache after retry. Whether the backend creates a duplicate or rejects the second POST depends on its constraints. Preserve the returned profile, reconcile the account, and offer local recovery without repeating creation; use server idempotency if supported.

An additional scalability concern is [chefProfileService.forUser](/Users/yahya/Documents/Expo/my-expo-app/src/services/chef-profile/chef-profile.service.ts:31): it scans public profile pages in batches of 100 when session metadata lacks the profile UUID. A `/me` read or documented user filter would avoid a directory scan.

**2. Components**

The shared library has one public entry point, component-family folders, native platform adapters, semantic theme colors, and colocated documentation. The repository currently contains 178 files under shared UI and 38 Storybook story files. File counts include adapters, declarations, and guides; they are not counts of distinct components or coverage percentages.

[UniversalHost](/Users/yahya/Documents/Expo/my-expo-app/src/components/ui/host/universal-host.tsx:56) centralizes theme and layout direction. Standalone controls own their Host; content variants compose inside an existing Host. This distinction helps limit native/RN layout boundaries. Loading/error/empty/offline states have shared presentation, and ordinary screens use the public component API.

Keep this structure and avoid a broad rewrite. Verify the current iOS and Android adapters on devices, especially text input focus/autofill, sheet dismissal, custom tab actions, large text, and controls layered over Skia. Portable tests exercise JavaScript behavior with native boundaries replaced, so passing them does not establish touch delivery or native geometry.

The Expo UI and Router pins are intentional: [build verification](/Users/yahya/Documents/Expo/my-expo-app/docs/build-verification.md:27) documents an Android width-conversion crash in a newer Expo UI patch and the matching Router dependency. Do not remove their compatibility exclusions as routine cleanup. Review them when an upstream fix is verified.

**3. Performance**

Good choices include native controls, `expo-image` caching, focus/step-scoped queries, debounced recipe search, cached content during refresh, worklets for motion, and a shared motion store that responds to backgrounding and live Reduce Motion changes. Current hosted skeletons are static; the deleted skeleton pulse timer described in older reports is no longer a current finding.

The largest source-level opportunities are:

- **Home mounts repeated content eagerly.** [HomeCatalogSections](/Users/yahya/Documents/Expo/my-expo-app/src/features/recipes/home-catalog-sections.tsx:46) composes eight sample items into 42 card instances and 49 image views across one vertical scroll and six horizontal rails. These are source-derived composition counts, not measured simultaneously visible views or device memory. Native hosting, layout, and images are more useful profiling targets than blanket memoization. Reduce repeated sections first; use a suitable virtualized architecture when the feed becomes large.
- **Image cache reuse resets on Home remount.** [The sample generator](/Users/yahya/Documents/Expo/my-expo-app/src/features/recipes/home-catalog.data.ts:6) creates Picsum URLs using a new random mount seed. Each item keeps a stable URL within that mount, but a later mount requests different URLs. Production content should use stable recipe image identities and appropriate sizes. Compact thumbnails currently share the same 800×450 source as large artwork.
- **Global artwork runs across routes.** [The root layout](/Users/yahya/Documents/Expo/my-expo-app/src/app/_layout.tsx:103) enables the page wave after launch; [PageMotionOverlay](/Users/yahya/Documents/Expo/my-expo-app/src/components/ui/page/page-motion-overlay.tsx:81) repeats its animation while motion is enabled. Background/Reduce Motion guards are present, but route usefulness does not control this root animation. The floating tab action also animates on iOS. Measure each separately and consider static decoration by default.
- **Demo modules remain in production exports.** Both source maps contain 13 UI showcase modules plus Maps and Skia modules. They contain no `.rnstorybook` sources or Storybook package implementations, although two app integration files remain. Lazy route imports do not remove those demo modules from these native exports.

The current production Hermes bytecode is 5,066,004 bytes for iOS and 5,184,024 bytes for Android, before transport compression. Source maps are approximately 12 MB each. These figures are export artifacts, not installed app size, startup time, RAM use, or OTA bandwidth. Establish cold/warm startup, frame-time, scrolling, and memory baselines on representative release devices before making performance claims.

**4. UI/UX**

The app has coherent native controls, light/dark themes, French/English/Arabic translations, RTL propagation, safe-area handling, keyboard boundaries, validation feedback, onboarding, and restoration recovery. These are useful foundations.

The most visible product gaps are:

- **Home is a demonstration.** It renders local sample data and random stock photos. Details open sample previews, and bookmarks live only in component state. [The Home screen](/Users/yahya/Documents/Expo/my-expo-app/src/features/recipes/home-screen.tsx:9) does not read the real recipe catalog. Connect the selected product layout to live recipes and the existing account-scoped saved collection.
- **Settings contain inactive destinations.** [Support, Privacy Policy, licenses, legal information](/Users/yahya/Documents/Expo/my-expo-app/src/features/settings/settings-screen.tsx:170), account management, and notification options are placeholders. Some rows show external-link or chevron affordances without an action. Finish required destinations and hide deferred options from the release experience.
- **Appearance preferences reset on restart.** [ThemePreferencesProvider](/Users/yahya/Documents/Expo/my-expo-app/src/context/theme.context.tsx:17) stores theme and color scheme only in React state. Language already has persistence; appearance should follow a similarly deliberate preference lifecycle.
- **Development navigation remains part of More.** [MoreScreen](/Users/yahya/Documents/Expo/my-expo-app/src/features/recipes/more-screen.tsx:45) links to Browse All Pages, device information, and a placeholder Health Check in production.

Validate large text, narrow phones, iPad layouts, Arabic text, screen-reader traversal, icon labels, keyboard/autofill, tab action hit areas, and reduced motion on native builds. Fixed metadata widths and mixed native/RN composition are review targets, not confirmed visual defects from this source audit.

**5. Production**

The project is linked to EAS. Development, preview, and production profiles exist; production uses remote versioning and automatic build-number increments. GitHub CI runs a frozen dependency install, Storybook registration, lint/typecheck/formatting, and the portable suite.

Release work still includes:

1. Gate tool routes at the navigator and route-entry level. [The root protected group](/Users/yahya/Documents/Expo/my-expo-app/src/app/_layout.tsx:209) checks authentication but includes UI showcase, component examples, device information, health diagnostics, and development pages without a development-only guard. Hidden tab links do not disable routes. Storybook's production redirect leads to Skia. This is release-scope exposure; it does not demonstrate a server authorization bypass. The development guest and `admin` simulation are gated by `appDevEnabled`, and the production profile sets that flag false.
2. Complete the data and recovery gaps above, and verify real login, recovery, chef creation, publishing, liking/saving, and account switching against the intended backend.
3. Add native smoke testing and production exports to CI. [The current workflow](/Users/yahya/Documents/Expo/my-expo-app/.github/workflows/quality.yml:15) does neither. [The default Maestro selection](/Users/yahya/Documents/Expo/my-expo-app/.maestro/config.yaml:1) excludes `pages/*`; those flows require their separate script. Existing developer-client flows are not proof of release-binary behavior.
4. Activate monitoring. `expo-observe` is installed but absent from both application integration and exported source graphs. SDK 57 guidance uses `ObserveRoot` and a readiness signal; installation alone does not complete startup measurement. No application crash-reporting integration was found. See [Observe setup](https://docs.expo.dev/eas/observe/get-started/).
5. Verify remote environment values, signing, Android Maps configuration, permissions, and store-facing metadata with actual release builds. The local API URL is unset; successful exports do not validate API connectivity or remote EAS values. Firebase is intentionally excluded from iOS autolinking until its configuration is restored; notification functionality should not be inferred from installed packages.

With explicit user permission, both `npm audit --json` and `npm audit --omit=dev --json` were queried on this review date. Each reported **27 affected-package entries: 24 high, three moderate, zero critical**. These entries trace to three underlying advisories rather than 27 independent flaws:

| Installed package            | Advisory                                                                               | Export evidence and follow-up                                                                          |
| ---------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `braces` 3.0.3               | [Deep-pattern denial of service](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)    | Absent from the native JS source maps; review build-tool exposure                                      |
| `node-forge` 1.4.0           | [Signature-verification issue](https://github.com/advisories/GHSA-86w9-cpqp-85rv)      | Absent from the native JS source maps; review certificate/signing tool usage                           |
| `decode-uri-component` 0.2.2 | [Malformed-input denial of service](https://github.com/advisories/GHSA-vcc3-ghjq-m6fr) | Present through `query-string` in both native JS source maps; prioritize URL-input reachability review |

Source-map presence establishes distribution, not exploitability. Absence from a JS map does not certify the entire build toolchain or native binary. Track compatible upstream remediation and documented exposure decisions. npm proposes incompatible changes including Expo 44 and React Native 0.72 for some chains; do not apply `npm audit fix --force` to this SDK 57 project.

**6. OTA — current state and proposed setup**

OTA means delivering compatible JavaScript and bundled-asset changes to an already installed app. Native libraries, SDK changes, native permissions, and native configuration generally require a new binary. Runtime versions keep updates matched to the native code available in that binary. See [runtime compatibility](https://docs.expo.dev/eas-update/runtime-versions/).

The current resolved Expo config has `updates: null` and `runtimeVersion: null`. [eas.json](/Users/yahya/Documents/Expo/my-expo-app/eas.json:6) has no channels. An EAS project ID and the installed `expo-updates` package are present, but this checkout does not configure EAS Update delivery. Remote update history and older installed binaries were not inspected.

A suitable initial configuration is:

```json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/4e66f579-46fa-4b0d-a470-e9c4aa09ae45"
    },
    "runtimeVersion": {
      "policy": "fingerprint"
    }
  }
}
```

Add `channel: "preview"` and `channel: "production"` to their respective EAS build profiles while retaining the existing profile fields. Fingerprint is a useful starting policy for this app's substantial native dependency set. Remote build-number auto-increment alone is not a runtime-compatibility strategy. Expo documents the [setup fields](https://docs.expo.dev/eas-update/getting-started/) and [deployment model](https://docs.expo.dev/eas-update/deployment/).

For a later implementation task, the sequence would be:

1. Run `npx eas-cli@latest update:configure`, review its changes, and select the runtime policy and profile channels.
2. Ensure EAS environments define the intended API origin and `EXPO_PUBLIC_ENABLE_DEV_SCREENS` values for both builds and updates. Values under a build profile's `env` are not a substitute for deliberately selecting the update environment.
3. Create and install fresh preview binaries containing the update URL, channel, and runtime configuration. Existing binaries built without these settings cannot acquire the missing native setup through OTA.
4. Publish a small preview update with `npx eas-cli@latest update --channel preview --environment preview --message "Verify OTA delivery"` and verify its update ID and lifecycle behavior on both platforms.
5. Verify rollback, introduce a staged production rollout, and monitor errors and adoption. Test fresh install, offline launch, upgrade from a previous release, and an update becoming available while a draft is open. Avoid forcing a reload during an active form.

This proposed configuration has not been applied, and no build, submission, or update was published during the analysis.

**Priorities**

| Order | Deliverable                                                             | Acceptance evidence                                                                          |
| ----- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 1     | Correct creations, list continuation, and chef partial-success recovery | Tests with records beyond page one and a successful POST followed by local-storage failure   |
| 2     | Define release routes, connect Home, finish essential settings          | Production deep-link checks and real account-backed content/actions                          |
| 3     | Triage dependency exposure and verify native release flows              | Compatible dependency decisions, iOS/Android smoke results, live API validation              |
| 4     | Configure OTA and monitoring                                            | Fresh preview binaries receive a tested update and rollback; readiness/errors are observable |
| 5     | Profile and simplify rendering                                          | Release-device startup/frame-time/memory comparisons before and after targeted changes       |

**Verification performed**

| Check                              | Result                                                                                                                       |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`                     | Pass, zero warnings                                                                                                          |
| `npm run typecheck`                | Pass                                                                                                                         |
| `npm run format:check`             | Pass before adding this report; report formatted separately                                                                  |
| `npm test`                         | Pass: 522 tests across nine scripted groups                                                                                  |
| `npx expo install --check`         | Local dependency map passes; CLI explicitly reported offline validation as unreliable; Expo UI/Router intentionally excluded |
| Resolved public Expo config        | SDK 57, iOS/Android, EAS linked, no updates/runtime configuration                                                            |
| Production iOS and Android exports | Pass with development screens flag false; Hermes bundles and source maps inspected                                           |
| Chef partial-success probe         | Reproduced using actual application modules with mocked I/O; no live account writes                                          |
| npm advisory audits                | Completed after explicit permission; both returned the affected-package counts above                                         |

No fresh native build, native Maestro run, release-device benchmark, live backend test, signing inspection, remote EAS environment check, or store submission was performed. Simulator inspection was unavailable through the accessible UI/tooling. Local checks ran on Node `24.21.0`; repository CI pins Node `22.18.0`.

Transient export, test, configuration, and advisory evidence is under `/tmp/likan-audit-*`; this report preserves the conclusions and source references.
