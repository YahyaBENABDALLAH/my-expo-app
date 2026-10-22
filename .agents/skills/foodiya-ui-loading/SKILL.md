---
name: foodiya-ui-loading
description: 'Compose Foodiya loading, query content and error states while preserving cached content and retry context.'
---

# Loading, query states and recovery

Exports: `LoadingContent`, `LoadingScreen`, `QueryContent`, `ContentQuery`
and `ScreenError`.

`loading-state.tsx` composes native progress and text. `loading-indicator.*`
keeps the iOS/Android progress adapters private to this family.
`query-content.tsx` chooses a state; `screen-error.tsx` presents route recovery.

Use `LoadingContent` inside a Host and `LoadingScreen` at a route/Suspense
boundary. A disabled query waits for a prerequisite; an offline paused query
waits for connectivity. Neither is active loading. Keep cached content during
refresh, show persistent errors with retry, and show empty content only after
successful data resolution.

Resolved content/empty selection uses a private presentation helper. It does not
change the native tree, cached-content behavior, status messages, or retry guards.
Verify these state combinations manually; automated suites have been removed.

Queries and retry work remain in the feature; these components present them.

The initial-error fixture exports `ErrorState` (display name Error), avoiding a
built-in name collision. Its existing selector is `expo-ui-loading-state--error-state`.

Existing composition story: [loading-state.stories.tsx](../../../.rnstorybook/stories/components/loading-state.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../../../docs/ui.md).

Follow the [implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Local filenames in
this guide refer to [src/components/ui/loading/](../../../src/components/ui/loading/).
