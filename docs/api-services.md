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

## API configuration

`config/api.js` owns URL validation/normalization and the default ten-second
timeout. `src/services/api.config.ts` is the native transport entry point: it
reads the statically referenced `process.env.EXPO_PUBLIC_API_URL` lazily and maps
configuration failures to `ApiConfigurationError` with safe user feedback.

Ordinary requests, explicit base URL overrides and raw token refresh use this
same policy. Whitespace and trailing slashes are normalized; local HTTP addresses
and ports remain supported. Credentials, query strings, fragments and non-HTTP
protocols are rejected without including the supplied URL in diagnostics.

Keep refresh interceptor-free. Do not import `api.ts` from `auth.refresh.ts` to
reuse its authenticated client: the reverse dependency already exists and refresh
must not recurse. Missing configuration does not prevent the public local starter
from opening; production configuration requires the API URL before distribution.
See [environment selection](development.md#brand-and-environment-configuration).

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
