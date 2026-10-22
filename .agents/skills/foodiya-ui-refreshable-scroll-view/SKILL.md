---
name: foodiya-ui-refreshable-scroll-view
description: 'Use or maintain Foodiya native scroll refresh, request coalescing and refresh completion behavior.'
---

# Refreshable scroll view

Exports: `RefreshableScrollView` and `RefreshableScrollViewProps`.

The iOS adapter uses SwiftUI refreshable; Android uses Compose PullToRefreshBox.
The declaration and shared props stay beside both implementations.

Compose inside a Host. With no callback or a disabled scroll view, it renders
ordinary scrolling. An async `onRefresh` owns work and error feedback; the
wrapper waits for settlement, releases the indicator on failure and coalesces
pending gestures.

`use-pending-refresh.ts` shares only promise coordination and error completion.
Android supplies its existing spinner state setter; iOS adds no JS spinner state.
Both retain their native indicator colors and the disabled/hidden interaction
guard. Tests cover callback changes during a pending request, duplicate gestures,
success, rejection, recovery and retained content.

See [API refresh guidance](../../../docs/api-services.md). Native gestures,
indicator placement and short-content behavior require device verification.

Existing composition story: page-screen.stories.tsx (retired fixture).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../../../docs/ui.md).

Follow the [implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Local filenames in
this guide refer to [src/components/ui/refreshable-scroll-view/](../../../src/components/ui/refreshable-scroll-view/).
