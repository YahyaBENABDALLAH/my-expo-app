# Likan Expo app

An iOS and Android application built with Expo SDK 57, Expo Router and native
Expo UI.

## Get started

Use Node 22.18 or newer and the committed npm lockfile.

```sh
npm ci
npm start
```

Set `EXPO_PUBLIC_API_URL` in `.env.local` and restart Metro after changing it.
Use `npx expo install <package>` for SDK-compatible dependencies.
Run `npm run typecheck` and `npm run lint` before finishing a change.

## Find the guidance

- [Documentation index](docs/index.md): setup, architecture, UI, releases and reports.
- [Development](docs/development.md): commands, Storybook, guest browsing and environment.
- [Architecture](docs/architecture.md): routes, features, services and shared boundaries.
- [Native UI](docs/ui.md): component selection and canonical skill links.
- [Documentation ownership](docs/documentation.md): where to maintain each kind of guidance.
- [Agent entry point](AGENTS.md): project rules and skill routing.

Component contracts live in their existing `.agents/skills/foodiya-ui-*` skills,
with detailed references only where needed. Source folders hold code; avoid
reintroducing per-component READMEs.
