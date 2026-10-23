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

Transport modules may use the existing `.api.ts` or `.service.ts` convention;
both have the same enforced import boundary. Keep React/navigation and cache
effects in consumers or query/mutation modules, and schemas/mappers free of
rendering and I/O. The auth lifecycle, raw refresh, device metadata and session
storage are distinct existing owners, not entity transport modules. See
[enforced boundaries](architecture.md#enforced-import-boundaries).

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

## Session model and logout

Identity wire DTOs and response validation keep their existing fields, endpoints
and backend `roles` in [api/auth.ts](../src/validation/schemas/api/auth.ts).
[auth.mapper.ts](../src/services/auth/auth.mapper.ts) is a pure boundary for fresh
tokens, legacy stored token responses and the canonical frontend storage format.
The frontend [session schema](../src/validation/schemas/auth-session.ts) requires
a nonempty access token and a user with a nonempty `uuid`. It no longer exposes
unused role/chef flags. Older canonical records may retain null refresh-token or
expiry metadata; non-null tokens, dates and display fields are validated.
An older record without a refresh token cannot renew an expired/unknown access
expiry and follows the existing sign-in-again policy when renewal is required.

The `auth.session` storage key and legacy wire-token restoration remain supported.
Old product-only user fields are stripped during normalization and disappear from
disk on the next valid write. A missing/invalid user makes a stored record corrupt;
it is removed before authentication. Failed deletion remains a recovery error.
Invalid new sessions/profile updates are rejected before changing durable state;
session establishment validates before reserving a new generation.

`signOut` captures the departing access-token string and generation, checks
ownership after the read, and awaits the existing serialized SecureStore deletion.
Only durable deletion publishes sign-out and clears that generation's caches.
Repeated logout/clear calls join the matching pending clear, including its temporary
cleared generation. A deletion failure restores the matching local account for
retry; a newer session wins over old completion or failure.

After successful local cleanup, revocation runs in the background through
`authClient` with explicit `Authorization`, no body and the shared ten-second
timeout. This client has authentication attachment and refresh interception
disabled. It cannot read a new account's token, rotate credentials, clear caches
or publish session events. Its rejection is consumed without an old-account alert.
The existing authenticated client continues to own normal identity reads.

Remote revocation is best effort: offline operation, process termination or an
expired/rejected access token can prevent it. The supplied contract exposes no
refresh-token revocation endpoint/body, so the app does not invent one or refresh
solely for logout. Local durable sign-out still completes. This is not proof of
server-side invalidation; verify that behavior with the actual backend.

Refresh remains on its raw transport and shares only API configuration. It keeps
deduplication, generation checks and token-pair persistence, preserves cached
identity during temporary failures, and discards consumed old credentials if
rotation cannot be saved. Generation checks also classify superseded transport
or persistence failures before cleanup. Keep its import independent of `api.ts`.

On native iOS/Android with a real session, check `auth-logout` while offline and
with slow revocation, account switching, cached identity during temporary refresh
failure, and recovery after a failed SecureStore deletion. The latter retains
`auth-logout-error` and the same retry action. Isolated in-memory checks validate
JavaScript ordering; they do not verify native storage, focus/navigation or server
revocation. No service test runner or fake production session is introduced.

## Error notifications

Query and mutation cache failures and imperative auth lifecycle failures call
`reportErrorAlert` from `src/lib/error-alerts.ts`. It preserves auth error
translation and ignores cancellations and stale-session work. The shared
`showAlert` queue coalesces duplicate notifications and retains them until the
root `AlertHost` can present them after launch.

Best-effort logout revocation is deliberately excluded after successful local
cleanup. Local deletion failures still use the account mutation's ordinary
inline error/retry and shared alert path.

Feedback uses Expo UI's native iOS Alert and Android AlertDialog with an OK
action. Alerts remain until dismissed; there is no timed toast overlay. Keep
persistent failure context and retry controls on the affected screen. See the
[alert skill](../.agents/skills/foodiya-ui-alert/SKILL.md) for native composition.
