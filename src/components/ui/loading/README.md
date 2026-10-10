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

Queries and retry work remain in the feature; these components present them.

Existing composition story: [loading-state.stories.tsx](../../../../.rnstorybook/stories/expo-ui/loading-state.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
