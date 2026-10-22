---
name: foodiya-ui-error-toast
description: 'Use or maintain Foodiya ErrorToast and its shared toast-host integration for transient failures.'
---

# Error toast compatibility

`ErrorToast` renders the shared [Toast](../foodiya-ui-toast/SKILL.md) with `variant="error"`.
`ErrorToastHost` aliases `ToastHost`; mount only one notification host in the root.
Existing error-only consumers and `reportErrorToast` keep working with the shared
queue. New code should use `Toast`, `ToastHost` and `showToast` for error, success
and warning feedback.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../../../docs/ui.md).

Follow the [implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Local filenames in
this guide refer to [src/components/ui/error-toast/](../../../src/components/ui/error-toast/).
