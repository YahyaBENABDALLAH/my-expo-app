---
name: foodiya-ui-aurora-background
description: 'Use or maintain the Foodiya Skia aurora artwork, theme colors, reduced motion and lifecycle behavior.'
---

# Aurora background

Export: `AuroraBackground`. Implementation: `aurora-background.tsx`.

The full-screen Skia background used by the launch screen and dedicated previews. An optional
`colorScheme` overrides its Host/device appearance; `animate` defaults to true.
Routed pages use opaque theme backgrounds to prevent text showing through transitions.
Android advances the shader at 30 updates per second, preserving its motion speed
while reducing full-screen redraws during navigation and scrolling. iOS follows
the display refresh rate. Static mode remains available with `animate={false}`.
The shader consumes the selected theme's background, raised surface, primary
and secondary tokens. Optional `hue` supports the interactive canvas page.
UX Template uses a flat grayscale background in both appearances: accent
intensity is zero and the animation clock stays paused.

The decorative wrapper and canvas ignore touches and are hidden from accessibility.
Resolution follows actual native layout, including narrow previews. A UI-thread
shared value starts at a safe 1 × 1 resolution until layout arrives; there is no
window-dimension subscription or React sizing state. Equal size reports skip the
shared-value write, and invalid reports retain the last valid geometry.
The UI-thread
clock pauses for explicit static mode, inactive/background app state and live
Reduce Motion changes. It freezes its current frame and resumes without a jump.
The first frame after resuming resets the draw timestamp so paused time cannot
advance the artwork. Keep this specialized rendering boundary separate from ordinary Expo UI layout.

See [shared motion](../../../docs/shared-skia-motion.md) for verification limits.

`Pages/Skia background` provides Light, Dark and Static composition
stories with page content, native buttons, press counts and pause/resume.
Check native touch delivery manually in light, dark and static compositions.
Automated suites have been removed; existing test IDs remain for future tests.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../../../docs/ui.md).

Follow the [implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Local filenames in
this guide refer to [src/components/ui/aurora-background/](../../../src/components/ui/aurora-background/).
