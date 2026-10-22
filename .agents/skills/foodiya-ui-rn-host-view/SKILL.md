---
name: foodiya-ui-rn-host-view
description: "Use Foodiya's public native RNHostView export when composing rn host view content and boundaries."
---

# RNHostView

Use RNHostView only for an existing React Native or specialized artwork boundary inside native content. Entering its RN subtree breaks immediate native ownership: use standalone controls or one UniversalHost for a group. Give the bridge a real width; percentage widths can collapse under intrinsic measurement.

Follow the [mobile UI requirements](../expo-mobile-ui-only/SKILL.md) and
[component library](../expo-universal-component-library/SKILL.md).
The [public exports](../../../src/components/ui/index.ts) and installed
[Expo UI source](../../../node_modules/@expo/ui/src/universal/) define the contract.
