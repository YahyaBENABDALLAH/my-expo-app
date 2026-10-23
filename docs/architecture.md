# Application architecture

The starter keeps thin Expo Router files and native shared presentation. Home and
Settings are public; the component catalog requires its build-time flag. Account is protected by the real
session predicate; unauthenticated routes contain the existing auth workflow.
There is no development guest session or local credential bypass.

| Responsibility                           | Owner                                                                        |
| ---------------------------------------- | ---------------------------------------------------------------------------- |
| Routes and access                        | `src/app/`, `src/guards/auth-guards.ts`                                      |
| Auth workflow and forms                  | `src/features/auth/`                                                         |
| Starter presentation                     | `src/features/home/`, `settings/`, `ui-showcase/`, `pages/`                  |
| HTTP and session lifecycle               | `src/services/api.ts`, `src/services/auth/`                                  |
| Response validation                      | `src/validation/schemas/api/`                                                |
| Frontend session validation/mapping      | `src/validation/schemas/auth-session.ts`, `src/services/auth/auth.mapper.ts` |
| Query/cache helpers                      | `src/services/query-*.ts`, `src/lib/api-query-keys.ts`                       |
| Shared native presentation               | `src/components/ui/`                                                         |
| Preferences                              | Existing theme, language and layout-direction contexts                       |
| Build-time brand identity                | `config/brand.js`, `config/brands/`, `app.config.js`                         |
| Native public brand metadata             | `src/config/brand.ts`                                                        |
| Preview flags and fixture entry          | `src/config/developer-tools.ts`, `src/features/storybook/`, `.rnstorybook/`  |
| Public asset metadata and native sources | `config/brand-assets.json`, `src/config/brand-assets.ts`                     |
| Shared API configuration                 | `config/api.js`, `src/services/api.config.ts`                                |

Routes compose screens; screen workflows call services and query options. Services
never import UI or feature modules. Screens use the public `@components/ui` API;
UI implementations import concrete siblings to avoid barrel cycles. Retain
cancellation, validated responses, serialized secure storage, session generations,
token rotation, cache clearing and duplicate-submission safeguards.

Recipe flows, product-specific entity services, their schemas/DTOs, onboarding,
Aurora and development routes have been removed. Generic backend helpers remain
without adding another transport, repository or dependency-injection layer.
All installed packages are retained. Native fixtures have an explicit development
entry, isolated from ordinary feature and shared UI imports. Metro disables
Storybook in release mode; its sources are absent from the inspected native
release graphs. Catalog route guards control access while retaining showcase
modules. See [preview launch and bundle boundaries](storybook.md).

Brand manifests are selected at build/config time. The Node resolver validates
native assets and integration references; application modules read only the
selected public projection through the native configuration accessor. Public
asset metadata and the literal Metro registry supply heading fonts and launch
artwork without importing full manifests. The shared
API configuration module has no filesystem/native imports, so both Node validation
and native transports use the same URL normalization and timeout. Refresh retains
its independent interceptor-free transport. See
[brand setup](development.md#brand-and-environment-configuration).

The root palette comes from the selected brand and stays fixed. The existing
theme provider restores user appearance independently from header/motion, queues
scalar preference writes and exposes reveal readiness. Component previews use
the same provider with persistence disabled. See [appearance policy](appearance-themes.md).

## Enforced import boundaries

`eslint.config.js` composes each scoped import policy with the shared native-control,
route-file and Storybook restrictions. ESLint flat-config rule options replace
earlier options, so new scopes must use the existing `restrictImports` helper.
The narrow Storybook exception keeps native-control and route restrictions.

| Scope                                                                        | Enforced responsibility                                                                                                                         |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Application routes and feature screens                                       | No low-level HTTP/configuration, session storage, Axios, SecureStore or AsyncStorage imports; no showcase fixtures in product presentation      |
| All services                                                                 | No feature presentation, shared UI or UI context dependencies                                                                                   |
| Service `.api.ts` / `.service.ts` modules                                    | No React/native rendering, navigation or query/cache policy imports; use the shared transport and contracts                                     |
| Schemas, DTOs, `.mapper.ts` modules, API query keys and native preview flags | No rendering, cache, transport, initialized feedback/translation, native brand accessors or storage imports                                     |
| Shared UI implementations                                                    | No feature workflows, service/HTTP/storage imports, route files or their own public barrel; import concrete siblings and receive callbacks/data |
| Raw auth refresh                                                             | No authenticated `api.ts`, auth endpoint or lifecycle import; preserve its independent transport                                                |

Screen scopes cover `src/app/`, feature filenames containing `screen`, and feature
`screens/` folders. Catalog routes, showcase compositions, the catalog page and the
Storybook entry deliberately compose examples and have explicit exceptions. They
retain the shared native-control and route-file policies. The Storybook feature
alone may import Storybook packages/registration; its thin route imports that
feature. These exceptions do not grant access to client builds; the
[preview capability guards](storybook.md) own navigation access.

Endpoint functions and query options are valid screen dependencies. A small
form can pass a documented endpoint call to `useAuthForm` and keep its local
confirmation state beside the view. Recovery already does this; reset keeps its
challenge-keyed form and mounted completion guard. Do not add another hook that
only forwards that call. Put multi-step session/challenge coordination in the
existing auth flow or a real feature workflow. Screens must not create clients,
write credentials or reproduce transport/cache policy.

Native `src/config/brand.ts` and `brand-assets.ts` intentionally use Expo/native
APIs; they are not pure configuration. The Node brand resolver intentionally reads
files. `config/api.js` remains a small native-safe URL/timeout helper, reviewed
separately from those native and Node owners. Do not apply one blanket purity
rule to every configuration file.

These are static import/re-export checks using explicit source scopes and module
names, not a complete dependency-cycle, dynamic-import or side-effect analyzer.
Review indirect dependencies and extend the relevant scope when adding a new
module category. Verify config changes with allowed and forbidden import probes;
do not persist a new architecture test runner as part of ordinary feature work.

## Add a feature

Follow the existing responsibility chain:

```text
route → feature screen → workflow when needed → query/mutation options → endpoint
                   ↓                 ↓
               shared UI        pure rules/schema
```

Start with the real request/response contract, validate it at transport, then add
only the query/mutation policy the feature needs. Keep transient form state local,
render through `@components/ui`, and preserve stable actionable `testID` values.
The [implementation pattern](../.agents/skills/foodiya-implementation/references/implementation-pattern.md)
and [API skill](../.agents/skills/expo-api-services/SKILL.md) own detailed conventions.
No repository, DI container or base-component hierarchy is required by this path.

For component contracts use the [UI guide](ui.md); for adding real endpoints use
[API services](api-services.md). Current checks are lint, typecheck, formatting and
native JavaScript exports. Older reports that mention test scripts or entity
inventories describe historical versions of the app.
