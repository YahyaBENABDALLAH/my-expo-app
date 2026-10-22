# Application architecture

The starter keeps thin Expo Router files and native shared presentation. Home,
Settings and the component showcase are public. Account is protected by the real
session predicate; unauthenticated routes contain the existing auth workflow.
There is no development guest session or local credential bypass.

| Responsibility             | Owner                                                       |
| -------------------------- | ----------------------------------------------------------- |
| Routes and access          | `src/app/`, `src/guards/auth-guards.ts`                     |
| Auth workflow and forms    | `src/features/auth/`                                        |
| Starter presentation       | `src/features/home/`, `settings/`, `ui-showcase/`, `pages/` |
| HTTP and session lifecycle | `src/services/api.ts`, `src/services/auth/`                 |
| Response validation        | `src/validation/schemas/api/`                               |
| Query/cache helpers        | `src/services/query-*.ts`, `src/lib/api-query-keys.ts`      |
| Shared native presentation | `src/components/ui/`                                        |
| Preferences                | Existing theme, language and layout-direction contexts      |

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

For component contracts use the [UI guide](ui.md); for adding real endpoints use
[API services](api-services.md). Current checks are lint, typecheck, formatting and
native JavaScript exports. Older reports that mention test scripts or entity
inventories describe historical versions of the app.
