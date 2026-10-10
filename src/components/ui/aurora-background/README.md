# Aurora background

Export: `AuroraBackground`. Implementation: `aurora-background.tsx`.

Skia artwork for native compositions. An optional `colorScheme` overrides its
Host/device appearance. Keep this specialized rendering boundary separate from
ordinary Expo UI layout.

See [shared motion](../../../../docs/shared-skia-motion.md) for verification limits.

There is no dedicated story. Inspect this artwork through the native launch
composition; the related motion guide records verification limits.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
