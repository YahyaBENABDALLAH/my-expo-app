# Native Host and shared types

Exports: `UniversalHost`, `useHostColorScheme`, `useHostButtonPalette`,
`useHostLayoutDirection` and `UniversalThemeProps`.

`universal-host.tsx` provides native hosting and inherited appearance/direction.
`types.ts` holds the small shared theme contract.

The private sizing helper keeps the defaults explicit: a supplied viewport height
fills the viewport, inline content matches both axes, and ordinary content
matches vertical size. An explicit `matchContents` prop takes precedence.

Use a Host at a React Native/native boundary. Compose its ordinary content in
Expo UI Row/Column; direct siblings in a Host can overlap. Content components
inherit the owning Host's scheme unless explicitly overridden. Avoid nested
Hosts for ordinary native composition.

Existing composition story: [theme.stories.tsx](../../../../.rnstorybook/stories/expo-ui/theme.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
