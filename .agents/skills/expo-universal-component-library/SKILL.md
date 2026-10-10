---
name: expo-universal-component-library
description: Build and maintain this project's universal Expo UI component library, theme tokens, documentation, native Storybook stories, and meaningful component tests. Use when adding or changing reusable UI components or their stories and theme.
---

# Universal Expo UI component library

Apply the sibling [mobile UI requirements](../expo-mobile-ui-only/SKILL.md): iOS and Android only, Expo UI controls, simple implementations, performance before decoration. Universal means a shared native API here; do not add web tooling.

## Choose and document a component

1. Read the installed Expo and `@expo/ui` versions. Follow `AGENTS.md` for versioned documentation.
2. Read [the component catalog](references/components.md) to find every universal component, its official documentation, local wrapper, story coverage, and useful test scenarios. Read only the relevant component's API page and installed types before writing code.
3. Reuse `src/components/ui/` wrappers. Add a wrapper only when it supplies project behavior, theme, or a necessary platform adaptation; do not wrap exports merely to rename them.
4. Prefer root imports from `@expo/ui`. Isolate necessary SwiftUI/Compose implementations in platform files outside `src/app/`. Preserve a common public contract.
5. When changing a component, update its catalog entry with supported props, limitations, theme roles, story file, and behavioral verification. Refresh the inventory after SDK/package upgrades.
6. Ordinary layout uses Expo UI `Row`, `Column` and `Spacer`; RN geometry is reserved for a documented infrastructure or specialized rendering boundary. Use a content component within an existing Host and a standalone hosted wrapper only when embedding in RN.

## Theme and Storybook contract

- Follow [theme-token guidance](references/theme.md). Use existing semantic tokens, preserve native control geometry and feedback, and document differences between iOS and Android.
- Require a semantic variant at every project button call. `UniversalButton` and `UniversalButtonContent` support `primary`, `secondary`, `link`, `success`, `warning` and `destructive`; never provide a fallback variant or revive legacy size/rounded props. Use native icon/navigation adapters for their specialized native controls.
- Let content inherit its owning `UniversalHost` color scheme through `useHostColorScheme`, with an explicit component override when requested. Deterministic light/dark stories must not silently read the device theme.
- Loading uses native `LoadingIndicator` platform adapters, `LoadingContent` inside a Host and `LoadingScreen` at a route/Suspense boundary. Exercise disabled, offline, initial failure, empty success, cached refresh and refresh failure in composition stories.
- Every new or changed reusable component must have a discoverable native Storybook story. Infrastructure and compound slots may use a focused composition story rather than standalone wrappers.
- Follow [native stories and testing](references/storybook-testing.md): deterministic fixtures, explicit state, stable selectors, meaningful interaction assertions, and native verification.
- Keep stories and development tooling out of production imports. Inspect the existing Metro/Storybook setup before changing bundle selection.
- Do not claim a story proves device behavior or that a screenshot is an automated regression test without a comparison mechanism.

## Completion

Run lint and typecheck. Regenerate Storybook registration when stories change. Run affected behavioral checks when available and report unverified native cases. For a documentation-only change, validate the skill and its local references; a catalog entry is not a completed story or test.
