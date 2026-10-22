---
name: foodiya-implementation
description: Implement or change features in this Foodiya repository using its existing routes, feature workflows, services, native UI, and localization boundaries. Use for application implementation patterns and component-skill selection; SDK upgrades and EAS delivery use the Expo skills.
---

# Foodiya implementation

Use this project's existing architecture for the requested behavior. Resolve
`src/`, `docs/`, and command paths below from the repository root. Read
[AGENTS.md](../../../AGENTS.md) and the affected code before editing; the installed
packages and current source determine available APIs.

## Select only the guidance the change needs

| Work                                                    | Read                                                                                                                            |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Expo SDK, native API, or package setup                  | [Expo overview](../expo-overview/SKILL.md), then its relevant leaf skill; verify the installed SDK's documentation              |
| Feature, screen, or workflow implementation             | [Implementation pattern](references/implementation-pattern.md)                                                                  |
| Shared UI, theme, or native Storybook                   | [Mobile UI requirements](../expo-mobile-ui-only/SKILL.md) and [component library](../expo-universal-component-library/SKILL.md) |
| Find a component's skill and source                     | The relevant row in [component skills](references/component-skills.md)                                                          |
| Backend entity, response validation, query, or mutation | [API services](../expo-api-services/SKILL.md)                                                                                   |

Read the relevant component skill, such as [buttons](../foodiya-ui-button/SKILL.md),
when its family is involved. Each skill owns its component guidance; longer
contracts use linked references. Use [the documentation index](../../../docs/index.md)
for project guides. Do not duplicate this material in source-folder READMEs.

## Implementation contract

- Keep routes thin, feature workflows separate from presentation, and transport
  separate from React and cache effects. Follow the responsibility table in the
  implementation reference; create only the layers the change actually needs.
- Reuse the public `@components/ui` API in screens. Inside UI implementations,
  import concrete sibling files to avoid public-barrel cycles. Keep feature-only
  fragments with their feature and shared components in their existing families.
- Build for iOS and Android with the project's Expo UI controls. Preserve existing
  Host ownership, semantic theme, language, direction, safe-area, and accessibility
  behavior. Check both native adapters when the shared contract changes.
- Use existing query/mutation factories, form adapters, and providers. Preserve
  cancellation, session ownership, duplicate-submit guards, and cache maintenance.
  The API skill owns their detailed implementation rules.
- Extend the current pattern without reorganizing unrelated features or adding
  generic repositories, extra barrels, or new libraries just to fit an example.

## Verify and finish

Run `npm run typecheck` and `npm run lint` for this checkout, which uses
`package-lock.json`. Recheck the lockfile if the package manager changes. Format
the edited files with the installed Prettier. Read `package.json` before selecting
additional checks; some older documentation names scripts that no longer exist.

Run affected behavioral tests when behavior changes. Update native stories for
reusable UI changes and run `npm run storybook:generate` when story files change.
Document relevant public API or placement changes in the existing guides. Report
the checks actually run and any native behavior that still needs device testing.
