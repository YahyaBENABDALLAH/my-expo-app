# Toast

Exports: `Toast`, `ToastHost`, `ToastProps` and `ToastVariant` from `@components/ui`.
Mount `ToastHost` once above navigation. Queue notifications with
`showToast` from `@/lib/toasts`:

```tsx
showToast({ variant: 'success', message: t('recipe.saved') });
showToast({ variant: 'warning', message: t('recipe.unsavedChanges') });
showToast({ variant: 'error', message: t('recipe.saveFailed') });
```

Message keys above are illustrative; use the calling feature's real translations.
`variant` and `message` are required. An optional `title` overrides the localized
default heading. `Toast` also accepts `onDismiss` and `colorScheme` for direct
composition. Mount a new keyed instance for each notification.

All variants share a rounded card, heading, wrapping text and native close control
(44pt iOS, 48dp Android). Error uses a red alert badge, success a green checkmark,
and warning an amber alert triangle. Colors come from `surfaceRaised`, `text`,
`muted`, the variant's semantic accent/container and the iOS `shadow` token.
Appearance and layout direction inherit from the owning Host. Android uses a
Compose Surface with rounded elevation; iOS uses a SwiftUI background and shadow.

The shared queue retains notifications before mounting and across navigation,
coalesces duplicate variant/message/title combinations and ignores stale dismissals.
`reportErrorToast` retains API error translation and cancellation/session filters
and feeds the same queue. `ErrorToast`/`ErrorToastHost` remain compatibility exports.

The lifetime hook dismisses after six seconds, respects Android's recommended
accessibility timeout and announces/holds the heading and message while
VoiceOver/TalkBack is enabled. Persistent failure and retry controls stay on screens.

Native Storybook: [toast.stories.tsx](../../../../.rnstorybook/stories/expo-ui/toast.stories.tsx).
Stories cover all variants in light/dark, custom headings, long/multiline and
right-to-left messages, dismissal and reopening. The existing
`.maestro/storybook/error-toast.yaml` exercises all three variants. Native colors,
layout, font scaling, keyboard overlays and assistive technology require a device.
