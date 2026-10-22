# Application architecture

The starter keeps thin Expo Router files and native shared presentation. Home,
Settings and the component showcase are public. Account is protected by the real
session predicate; unauthenticated routes contain the existing auth workflow.
There is no development guest session or local credential bypass.

| Responsibility               | Owner                                                       |
| ---------------------------- | ----------------------------------------------------------- |
| Routes and access            | `src/app/`, `src/guards/auth-guards.ts`                     |
| Auth workflow and forms      | `src/features/auth/`                                        |
| Starter presentation         | `src/features/home/`, `settings/`, `ui-showcase/`, `pages/` |
| HTTP and session lifecycle   | `src/services/api.ts`, `src/services/auth/`                 |
| Response validation          | `src/validation/schemas/api/`                               |
| Query/cache helpers          | `src/services/query-*.ts`, `src/lib/api-query-keys.ts`      |
| Shared native presentation   | `src/components/ui/`                                        |
| Preferences                  | Existing theme, language and layout-direction contexts      |
| Build-time brand identity    | `config/brand.js`, `config/brands/`, `app.config.js`        |
| Native public brand metadata | `src/config/brand.ts`                                       |
| Shared API configuration     | `config/api.js`, `src/services/api.config.ts`               |

Routes compose screens; screen workflows call services and query options. Services
never import UI or feature modules. Screens use the public `@components/ui` API;
UI implementations import concrete siblings to avoid barrel cycles. Retain
cancellation, validated responses, serialized secure storage, session generations,
token rotation, cache clearing and duplicate-submission safeguards.

Recipe flows, product-specific entity services, their schemas/DTOs, onboarding,
Aurora and development routes have been removed. Generic backend helpers remain
without adding another transport, repository or dependency-injection layer.
All installed packages are retained. Native component fixtures remain outside
production imports; Metro no longer enables Storybook in normal app builds.

Brand manifests are selected at build/config time. The Node resolver validates
native assets and integration references; application modules read only the
selected public projection through the native configuration accessor. The shared
API configuration module has no filesystem/native imports, so both Node validation
and native transports use the same URL normalization and timeout. Refresh retains
its independent interceptor-free transport. See
[brand setup](development.md#brand-and-environment-configuration).

For component contracts use the [UI guide](ui.md); for adding real endpoints use
[API services](api-services.md). Current checks are lint, typecheck, formatting and
native JavaScript exports. Older reports that mention test scripts or entity
inventories describe historical versions of the app.
