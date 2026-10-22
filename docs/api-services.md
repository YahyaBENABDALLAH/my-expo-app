# Backend services

The starter retains the existing Axios client, response validation, auth lifecycle,
secure session storage and TanStack Query integration. Set `EXPO_PUBLIC_API_URL`
for the real server; authentication and Account call their actual endpoints.
No guest credentials or mocked production API responses are supplied.

`src/services/auth/auth.api.ts` owns login, registration, registration confirmation
and resend, password recovery/reset, current identity and logout endpoints.
`auth.queries.ts` defines the identity query. Consumed auth responses are validated
by `src/validation/schemas/api/auth.ts`; request/form schemas retain their contracts.

Recipe-specific entity services, feature adapters, DTOs and schemas are removed.
Generic request normalization, pagination schemas, query factories, mutation
callbacks, invalidation helpers and `createEntityKeys` remain for new backend
features. Create only the layers required by an actual endpoint. Preserve abort
signals, account ownership, session-generation checks and mandatory cache work
when composing success navigation.

See the [API implementation skill](../.agents/skills/expo-api-services/SKILL.md)
and [architecture](architecture.md). No automated service runner is configured;
use current package scripts and distinguish native/live-backend verification from
static checks. Historical reports listing sixteen entity services no longer
describe the current starter.

## Error notifications

Query and mutation cache failures and imperative auth lifecycle failures call
`reportErrorAlert` from `src/lib/error-alerts.ts`. It preserves auth error
translation and ignores cancellations and stale-session work. The shared
`showAlert` queue coalesces duplicate notifications and retains them until the
root `AlertHost` can present them after launch.

Feedback uses Expo UI's native iOS Alert and Android AlertDialog with an OK
action. Alerts remain until dismissed; there is no timed toast overlay. Keep
persistent failure context and retry controls on the affected screen. See the
[alert skill](../.agents/skills/foodiya-ui-alert/SKILL.md) for native composition.
