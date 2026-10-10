# Aurora background

Export: `AuroraBackground`. Implementation: `aurora-background.tsx`.

The root's default full-screen Skia background for all routed pages. An optional
`colorScheme` overrides its Host/device appearance; `animate` defaults to true.
The shader consumes the selected theme's background, raised surface, primary
and secondary tokens. Optional `hue` supports the interactive canvas page.

The decorative wrapper and canvas ignore touches and are hidden from accessibility.
Resolution follows actual native layout, including narrow previews. A UI-thread
clock pauses for explicit static mode, inactive/background app state and live
Reduce Motion changes. It freezes its current frame and resumes without a jump.
Keep this specialized rendering boundary separate from ordinary Expo UI layout.

See [shared motion](../../../../docs/shared-skia-motion.md) for verification limits.

`Pages/Skia background` provides Light, Dark, Static and NarrowPhone composition
stories with page content, native buttons, press counts and pause/resume.
`.maestro/storybook/aurora-background.yaml` covers native touch delivery in light,
dark and static compositions; it still requires a connected development build.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
