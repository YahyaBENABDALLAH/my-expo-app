---
name: foodiya-ui-list-item
description: 'Compose Foodiya native list rows using headline, supporting text and accessory slots.'
---

# List item

Import `ListItem` and `ListItemProps` from `@components/ui`. Keep this family in
two files: `list-item.tsx` directly re-exports Expo UI, while
`list-item.android.tsx` adds the actual Android row `testID` missing in the
installed universal implementation. Metro selects the Android override. Shared
types come directly from Expo UI; no declaration or appearance helpers are needed.

Keep `Leading`, `Supporting` and `Trailing` slots attached to the original native
markers. Caller props, colors and modifier order pass through; the Android test
selector is appended after caller modifiers. Native row colors and
supporting/accessory typography inherit the Host.

Registration uses a verification information row in
[register-screen.tsx](../../../src/features/auth/screens/register-screen.tsx).
The [list showcase](../../../src/features/ui-showcase/list-screen.tsx) also uses
the same component. Settings uses its own `SettingsRow` composition.

Import from `@components/ui` and compose inside `UniversalHost`. The Host uses the shared light/dark scheme and theme tint; Host seedColor overrides remain available; use native modifiers only where exposed by the component API. No custom glass layer or Android glass imitation is added.

Native story: [list.stories.tsx](../../../.rnstorybook/stories/components/list.stories.tsx).
Default and compound-slot fixtures retain controls for appearance, row actions
and refresh. Run lint and typecheck; regenerate registration when stories change.
Check native row selectors, slots, appearance and touch behavior on iOS/Android.

See [native control themes](../../../docs/control-theme.md) and [UI guide](../../../docs/ui.md).

Follow the [implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Local filenames in
this guide refer to [src/components/ui/list-item/](../../../src/components/ui/list-item/).
