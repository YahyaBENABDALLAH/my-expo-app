# Map experience

Export: `MapExperience`. Implementation: `index.tsx`.

A specialized native map boundary with Expo UI captions. Its existing route
loads `@components/ui/map-experience` lazily; the folder entry point preserves
that path. Keep the map out of the main UI barrel so unrelated screens do not
load it through that entry point.

The map owns native map/safe-area presentation. Cartes uses `PageFrame`'s
`headerOverlay` so the map reaches the top behind the blurred header and shared
animated wave. Native map controls still receive device safe-area padding.
Keep route composition in
`src/app/(tabs)/maps.tsx` and workflow state in feature modules. Native map
rendering and gestures require a running app.

[Back to the UI guide](../README.md).
