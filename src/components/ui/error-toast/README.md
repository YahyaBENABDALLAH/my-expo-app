# Error toast

Exports: `ErrorToast`, `ErrorToastHost` and toast types.

`error-toast-host.tsx` subscribes to the shared toast store.
`error-toast.ios.tsx` and `error-toast.android.tsx` render the native
presentation; `error-toast.types.ts` holds their contract.

Mount the host once in the root composition. Keep persistent failure and retry
context in the screen's loading/query composition.

Existing composition story: [error-toast.stories.tsx](../../../../.rnstorybook/stories/expo-ui/error-toast.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
