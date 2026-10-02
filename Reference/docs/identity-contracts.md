# Foodiya.Identity contracts

`types/auth.types.ts` and `types/problem.types.ts` mirror the named TypeScript
schemas supplied for Foodiya.Identity on 2026-09-11. DTO names use PascalCase;
JSON properties retain the supplied camelCase spelling, optionality, and nullability.

- `TokenResponse` is shared by Google and refresh, and by `AuthFlowResponse.loginResponse`.
- Login can return a pending `AuthFlowResponse`; confirmation uses `/api/auth/register/confirm`.
- Refresh uses `/api/auth/token/refresh` with only `{ refreshToken }`.
- Current identity uses `/api/users/me` and returns `CurrentIdentityResponse`.
- Reset uses `ResetPasswordRequest.newPassword` and returns no content.
- Unnamed bodies in the supplied contract stay inline in the API signatures;
  their C# DTO names have not been provided.

The supplied schema calls the flow DTO `AuthFlowResponse`, while the accompanying
summary calls it `AuthenticationFlowResponse`. This client follows the schema's
spelling. The backend's exported OpenAPI schema should settle the canonical name.

`types/auth-session.types.ts` contains frontend-only display and persisted-session
models. These preserve existing local storage and recipe/profile consumers; they
are not Identity response DTOs. Session normalization is the explicit boundary
between `TokenResponse` and those local models. Form schemas use `Pick`/`Omit` of
request DTOs for their editable fields.

## Preventing drift

These contracts currently match a supplied snapshot; they are not generated.
When the backend OpenAPI artifact is available, generate the TypeScript contracts
from it and check regeneration in CI. Preserve backend schema names and resolve
any duplicate names in the backend schema instead of adding frontend aliases.

## Remaining integration details

- Forgot-password returns only `{ message }`, while reset requires `challengeId`.
  The delivery mechanism for that ID (for example, an email link) was not supplied.
- The new resend, recovery, reset, and Google API functions are typed transport
  methods; the corresponding screen/provider integrations remain separate work.
- DTO string-length/format comments describe server validation. TypeScript types
  do not enforce those rules at runtime; form validation still needs alignment.

## Session lifecycle

- Global auth context exposes only status, user and session actions. Auth route
  operations, errors and OTP challenge state live in `features/auth/auth-flow.context.tsx`.
- `auth.lifecycle.ts` owns establishment/navigation, startup restoration and logout.
  `auth.session.ts` owns storage, change notifications and common cache/navigation cleanup.
- Login, registration confirmation and Google exchange use the same establishment path.
- Refresh has a 10-second timeout and one in-flight rotation per session generation.
  Late 401s retry with the already rotated access token instead of rotating again.
- Explicit invalid-session codes clear the session. Network errors, timeouts and
  server failures preserve it. Only `INVALID_CREDENTIALS` labels credentials incorrect.
- Logout attempts server revocation and always clears locally, even if offline.
  An offline logout cannot confirm remote revocation; its failure is reported.
- Session generations and serialized storage prevent older requests/writes from
  restoring or invalidating a newer account. Replacement tokens are written together;
  failure to save a successful rotation clears the consumed pair to prevent replay.
- Startup refreshes expired access tokens. Temporary failures retain cached identity
  without changing the saved expiry; rejected sessions are removed.
- `npm run test:auth` exercises production session modules and Axios interceptors with
  mocked native storage and network transport. Device UI and live backend verification
  are separate from these tests.
