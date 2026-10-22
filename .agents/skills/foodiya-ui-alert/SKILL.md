---
name: foodiya-ui-alert
description: Use or maintain Foodiya native Expo UI alerts, queued feedback, acknowledgment and error reporting on iOS and Android.
---

# Native alerts

Import `Alert`, `AlertHost` and their public types from `@components/ui`.
Follow [Foodiya implementation](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md).

## Native presentation

The [shared implementation](../../../src/components/ui/alert/alert.tsx) owns the
localized headings, Host and queue subscription. The
[iOS adapter](../../../src/components/ui/alert/native-alert.ios.tsx) uses Expo UI
SwiftUI `Alert`; the
[Android adapter](../../../src/components/ui/alert/native-alert.android.tsx) uses
Compose `AlertDialog`. The fourth file is their private native declaration.
Use native styling and accessibility; do not restore custom toast cards, icons,
automatic timeouts or announcement hooks.

Mount `AlertHost` once above navigation, after the launch screen. Call
`showAlert` from [the shared queue](../../../src/lib/alerts.ts):

```tsx
showAlert({ variant: 'success', message: t('recipe.saved') });
showAlert({ variant: 'error', message: t('recipe.saveFailed') });
```

The keys above are illustrative; use actual feature translations. `variant`
and `message` are required. Variants are `error`, `success`, `warning` and
`info`; they select a localized default heading. Optional `title` overrides it.
Native dialog appearance remains platform-owned.

Alerts require acknowledgment with the localized OK action. Android also
handles back/outside dismissal. The queue retains pre-mount/navigation feedback,
coalesces identical notifications and ignores stale dismissals. Do not add
automatic dismissal timers.

For local presentation, mount `Alert` only while visible and supply `onDismiss`.
It owns a tiny absolute Host; `colorScheme` is optional. iOS needs the existing
mounted `Alert.Trigger` anchor for programmatic presentation. Keep the native
message and OK selectors `app-alert-message` and `app-alert-dismiss`.

## Error integration and verification

[reportErrorAlert](../../../src/lib/error-alerts.ts) preserves auth error
translation and cancellation/session filters. Query/mutation caches and
imperative auth lifecycle work share it. Keep persistent error/retry content
on screens; notification presentation does not replace recovery.

The [native stories](../../../.rnstorybook/stories/components/alert.stories.tsx)
cover error, success, warning and info headings, dismissal and reopening.
Check iOS/Android OK actions, queued alerts, Android back/outside dismissal,
long text, large text, screen readers, RTL and light/dark appearance on devices.
Run lint, typecheck, formatting and Storybook generation after story changes;
report native checks separately.

Checked against installed `@expo/ui` 57.0.21 and SDK 57:
[SwiftUI Alert](https://docs.expo.dev/versions/v57.0.0/sdk/ui/swift-ui/alert/) and
[Compose AlertDialog](https://docs.expo.dev/versions/v57.0.0/sdk/ui/jetpack-compose/alertdialog/).
