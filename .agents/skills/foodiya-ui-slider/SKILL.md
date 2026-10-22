---
name: foodiya-ui-slider
description: 'Use or maintain Foodiya native sliders, controlled ranges, steps and disabled callbacks.'
---

# Slider

`slider.tsx` uses the universal Expo UI control and guards disabled callbacks. Expo handles ranges, steps, native drag feedback and selectors. Colors inherit the Host. Supported iOS sliders retain native glass feedback during interaction; Android uses Material.

Import from `@components/ui` and compose inside `UniversalHost`. The Host uses the shared light/dark scheme and theme tint; Host seedColor overrides remain available; use native modifiers only where exposed by the component API. No custom glass layer or Android glass imitation is added.

Native story: [expo-ui/slider.stories.tsx](../../../.rnstorybook/stories/components/slider.stories.tsx). Light/dark and interaction fixtures remain available. JS checks cover public behavior and native module resolution; device appearance, glass and touch behavior still need iOS/Android verification.

See [native control themes](../../../docs/control-theme.md) and [UI guide](../../../docs/ui.md).

Follow the [implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Local filenames in
this guide refer to [src/components/ui/slider/](../../../src/components/ui/slider/).
