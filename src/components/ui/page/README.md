# Page layout and motion

Exports: `PageScreen`, `PageFrame`, `PageHeader` and `PageMotionOverlay`.

`page-screen.tsx` composes scrolling content, actions and an appearance footer.
`page-frame.tsx` handles title/content/footer safe-area boundaries.
`page-header.tsx` uses the private `page-back-button.*` adapters.
`page-motion-overlay.tsx` contains shared passive Skia artwork.

Ordinary pages place appearance controls after scroll content. Specialized
map/canvas pages use the frame's hosted footer. Keep system insets outside
keyboard padding and preserve the existing tab-bar inset ownership.

Page actions accept stable `testID` values independent of translated labels.
Motion follows focus/activity/reduced-motion guards and ignores touches.
See [shared motion](../../../../docs/shared-skia-motion.md).

Existing composition story: [page-screen.stories.tsx](../../../../.rnstorybook/stories/pages/page-screen.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
