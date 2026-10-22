---
name: foodiya-ui-loading
description: 'Compose Foodiya loading, query content and error states while preserving cached content and retry context.'
---

# Loading, query states and recovery

Exports: `LoadingContent`, `LoadingScreen`, `QueryContent`, `ContentQuery`
and `ScreenError`.

Keep this family in four files. `loading-state.tsx` owns all public components,
the `ContentQuery` type and the private resolved-content helper.
`loading-indicator.ios.tsx` renders native SwiftUI progress;
`loading-indicator.android.tsx` renders native Compose circular progress.
`loading-indicator.d.ts` supplies their shared private props and signature.
Extend these existing owners when adding a loading or recovery presentation.

`LoadingContent` is used by session restoration, OTP requests and the button
showcase. `QueryContent` has the native state fixtures below. `LoadingScreen`
and `ScreenError` remain available for route/Suspense and route-error consumers.

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
