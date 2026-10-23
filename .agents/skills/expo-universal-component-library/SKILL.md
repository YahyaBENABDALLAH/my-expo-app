---
name: expo-universal-component-library
description: Build and maintain this project's native Expo UI component library, theme tokens, component contracts, examples and stable selectors. Use when changing reusable UI components, their native adapters, stories or theme.
---

# Universal Expo UI component library

Apply the sibling [mobile UI requirements](../expo-mobile-ui-only/SKILL.md): iOS and Android only, Expo UI controls, simple implementations, performance before decoration. Universal means a shared native API here; do not add web tooling.

## Choose and document a component

1. Read the installed Expo and `@expo/ui` versions. Follow `AGENTS.md` for versioned documentation.
2. Read [the component catalog](references/components.md) to find every universal component, its official documentation, local wrapper, story coverage, and useful test scenarios. Read only the relevant component's API page and installed types before writing code.
3. Reuse `src/components/ui/` wrappers. Keep each component family's implementation, platform adapters, types and private helpers in its existing folder. Maintain its contract in the matching component skill. Use the root public barrel; avoid additional folder levels and barrels. Add a wrapper only when it supplies project behavior, theme, or a necessary platform adaptation; do not wrap exports merely to rename them.
4. Prefer root imports from `@expo/ui`. Isolate necessary SwiftUI/Compose implementations in platform files outside `src/app/`. Preserve a common public contract.
5. When changing a component, update its catalog entry and matching skill with supported props, limitations, theme roles, current story paths, and verification. Refresh the inventory after SDK/package upgrades.
6. Ordinary layout uses Expo UI `Row`, `Column` and `Spacer`; RN geometry is reserved for a documented infrastructure or specialized rendering boundary. Use a content component within an existing Host and a standalone hosted wrapper only when embedding in RN.

## Theme and Storybook contract

- Follow [theme-token guidance](references/theme.md) and [palette ownership](references/theme-palettes.md). Use existing semantic tokens, preserve native control geometry and feedback, and document differences between iOS and Android.
- Require a semantic variant at every project button call. Follow [the button skill](../foodiya-ui-button/SKILL.md) for current variants, props, Host ownership and composition examples; never provide a fallback variant or revive legacy size/rounded props. Use native icon/navigation adapters for their specialized native controls.
- Let content inherit its owning `UniversalHost` color scheme through `useHostColorScheme`, with an explicit component override when requested. Deterministic light/dark stories must not silently read the device theme.
- Loading uses native `LoadingIndicator` platform adapters, `LoadingContent` inside a Host and `LoadingScreen` at a route/Suspense boundary. Exercise disabled, offline, initial failure, empty success, cached refresh and refresh failure in composition stories.
- Every new or changed reusable component must have a discoverable native Storybook story. Infrastructure and compound slots may use a focused composition story rather than standalone wrappers.
- Follow [native stories and verification](references/storybook-testing.md): deterministic fixtures, explicit state, stable actionable selectors and manual native verification. Automated suites are absent; do not add a runner or restore old test commands unless requested.
- Keep Storybook imports in `.rnstorybook/` and `src/features/storybook/`. The catalog flag owns links and protected route access; it does not strip showcase code. Use the documented `npm run storybook` opt-in for retained fixtures. Inspect both release graphs before claiming tooling exclusion.
- Follow the [adapter responsibilities and upgrade checklist](../../../docs/ui.md#adapter-responsibilities-and-upgrade-review) when changing Expo UI/Router versions. Review the intentional pins together, reproduce the original native width case, and verify both platform adapters on matching builds. Wrappers need a concrete project responsibility or demonstrated upstream gap; direct primitive exports stay direct.
- Do not claim a story proves device behavior or that a screenshot is an automated regression test without a comparison mechanism.

## Completion

Run `npm run check` for typecheck, lint and maintained-file formatting. Regenerate
Storybook registration when stories change. Follow the current preview workflow
and report unverified native cases; fixture registration does not prove a runnable
preview or native interaction. For a documentation-only change, validate the skill
and its local references.
