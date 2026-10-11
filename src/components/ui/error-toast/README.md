# Error toast compatibility

`ErrorToast` renders the shared [Toast](../toast/README.md) with `variant="error"`.
`ErrorToastHost` aliases `ToastHost`; mount only one notification host in the root.
Existing error-only consumers and `reportErrorToast` keep working with the shared
queue. New code should use `Toast`, `ToastHost` and `showToast` for error, success
and warning feedback.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
