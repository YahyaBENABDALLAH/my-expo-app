# Refreshable scroll view

Exports: `RefreshableScrollView` and `RefreshableScrollViewProps`.

The iOS adapter uses SwiftUI refreshable; Android uses Compose PullToRefreshBox.
The declaration and shared props stay beside both implementations.

Compose inside a Host. With no callback or a disabled scroll view, it renders
ordinary scrolling. An async `onRefresh` owns work and error feedback; the
wrapper waits for settlement, releases the indicator on failure and coalesces
pending gestures.

See [API refresh guidance](../../../../docs/api-services.md). Native gestures,
indicator placement and short-content behavior require device verification.

Existing composition story: [page-screen.stories.tsx](../../../../.rnstorybook/stories/pages/page-screen.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
