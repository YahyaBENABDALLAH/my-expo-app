---
name: foodiya-ui-navigation
description: 'Use or maintain Foodiya native navigation presentation, dock geometry, insets and tab actions.'
---

# Navigation presentation

Exports: `ReferenceNavigationBar` and navigation tab types.

`reference-navigation-bar.tsx` composes the dock and raised floating action.
`navigation-tab.*` owns destination controls;
`navigation-glass-surface.*` owns passive dock artwork: native glass on iOS and
static tonal gradients on Android. Android avoids blurring an already smooth
gradient. The production Android tab bar also keeps its floating action artwork
static to leave the frame budget for navigation; native press feedback and haptics
still run.
Each adapter's types stay here.

The borderless dock has 20-point rounded top corners and fills the screen width
and bottom edge. The glass and native tab feedback clip to those corners while
the raised action remains outside the clip. Its glass continues
under the bottom safe area; side insets apply only to destination controls.
The 84-point touch frame overlaps the page by 28 points through a negative top
margin, so layout reserves only the 56-point dock plus the system bottom inset.
There is no extra bottom padding: on a device reporting 34 points for the home
indicator, the reserved dock height is 90 points. Keep the actual device inset
instead of capping it, so the tab buttons stay above system gestures.
The transparent frame uses `box-none`: page controls beside the raised action
remain reachable, and the complete action stays inside its parent's touch bounds.

`navigation-tab-icons.ts` is the common symbol/size mapping through Expo UI
`Icon.select`. Both controls render root Icon with the same native modifiers;
the selected Home glyph remains filled on iOS and unchanged on Android.
Native tab feedback, selected semantics and touch geometry stay in the adapters.

Keep route selection and tab action workflow in `src/features/pages/`.
This family renders the supplied state and callbacks.

See [navbar verification](../../../docs/navbar-wave-verification.md) for
safe-area geometry, native glass differences and touch verification limits.

Existing composition story: reference-navigation.stories.tsx (retired fixture).
`PageOverlap` shows page content at the dock edge and an observable page control
beside the raised action. Check both hit areas manually; automated flows have been
removed and existing test IDs are retained for future tests.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../../../docs/ui.md).

Follow the [implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Local filenames in
this guide refer to [src/components/ui/navigation/](../../../src/components/ui/navigation/).
