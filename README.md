# Expo mobile starter

An iOS and Android bootstrap application built with Expo SDK 57, Expo Router and native
Expo UI.

Home, native component showcase, authentication, Account and Settings form the
starting point. UX Template and Instagram themes are included. All installed
packages are retained for future features.

## Get started

Use Node 22.18 or newer and the committed npm lockfile.

```sh
npm ci
npm start
```

Copy `.env.example` to `.env.local` and select `APP_BRAND` and `APP_VARIANT`.
The local default is the unlinked `template` brand. Use `APP_BRAND=likan` with an
existing Likan development build. Set `EXPO_PUBLIC_API_URL` for the real backend.
Restart Metro after changing brand or variant selection. See
[brand configuration](docs/development.md#brand-and-environment-configuration).
Use `npx expo install <package>` for SDK-compatible dependencies.
Run `npm run typecheck` and `npm run lint` before finishing a change.

## Find the guidance

- [Documentation index](docs/index.md): setup, architecture, UI, releases and reports.
- [Development](docs/development.md): commands, retained component fixtures and environment.
- [Architecture](docs/architecture.md): routes, features, services and shared boundaries.
- [Native UI](docs/ui.md): component selection and canonical skill links.
- [Documentation ownership](docs/documentation.md): where to maintain each kind of guidance.
- [Agent entry point](AGENTS.md): project rules and skill routing.

Component contracts live in their existing `.agents/skills/foodiya-ui-*` skills,
with detailed references only where needed. Source folders hold code; avoid
reintroducing per-component READMEs.
