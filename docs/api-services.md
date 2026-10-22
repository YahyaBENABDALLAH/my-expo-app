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
