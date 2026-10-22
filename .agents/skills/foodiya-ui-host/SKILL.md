---
name: foodiya-ui-host
description: 'Choose and configure Foodiya UniversalHost boundaries, content sizing, theme and live layout direction.'
---

# Native Host and shared types

Exports: `UniversalHost`, `useHostColorScheme`,
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

Existing composition story: theme.stories.tsx (retired fixture).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../../../docs/ui.md).

Follow the [implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Local filenames in
this guide refer to [src/components/ui/host/](../../../src/components/ui/host/).
