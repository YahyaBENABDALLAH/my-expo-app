# Slider

Export: `Slider`.

The iOS/Android files apply the owning Host's control tokens to native sliders.
`slider.d.ts` declares the shared contract. The caller owns the value.
The showcase's `TokenColors` story demonstrates these tokens; its seed-color
control is disabled because Host seed color does not override slider colors.

Preserve native drag/step behavior and disabled suppression. SwiftUI owns thumb
appearance; the installed Android API does not expose disabled slider colors.
See [control theme coverage](../../../../docs/control-theme.md).

Existing composition story: [slider.stories.tsx](../../../../.rnstorybook/stories/expo-ui/slider.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
