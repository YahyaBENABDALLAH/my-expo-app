# Native component catalog

Use [the UI guide](../../../../docs/ui.md) for public imports and native composition.
Read only the matching family skill for the current contract. Source and installed
types define supported props; dated history is in [the archived catalog](../../../../docs/archive/ui-library-history.md).

| Family                  | Contract and usage                                         | Source                                                                                                                 |
| ----------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| appearance              | [Skill](../../foodiya-ui-appearance/SKILL.md)              | [Shared control](../../../../src/components/ui/appearance/) and [Settings pickers](../../../../src/features/settings/) |
| auth                    | [Skill](../../foodiya-ui-auth/SKILL.md)                    | [Shared UI](../../../../src/components/ui/auth/) and [Login preferences](../../../../src/features/auth/)               |
| bottom-sheet            | [Skill](../../foodiya-ui-bottom-sheet/SKILL.md)            | [Implementation](../../../../src/components/ui/bottom-sheet/)                                                          |
| button                  | [Skill](../../foodiya-ui-button/SKILL.md)                  | [Implementation](../../../../src/components/ui/button/)                                                                |
| checkbox                | [Skill](../../foodiya-ui-checkbox/SKILL.md)                | [Implementation](../../../../src/components/ui/checkbox/)                                                              |
| collapsible             | [Skill](../../foodiya-ui-collapsible/SKILL.md)             | [Implementation](../../../../src/components/ui/collapsible/)                                                           |
| field-group             | [Skill](../../foodiya-ui-field-group/SKILL.md)             | [Implementation](../../../../src/components/ui/field-group/)                                                           |
| floating-action         | [Skill](../../foodiya-ui-floating-action/SKILL.md)         | [Implementation](../../../../src/components/ui/floating-action/)                                                       |
| form                    | [Skill](../../foodiya-ui-form/SKILL.md)                    | [Implementation](../../../../src/components/ui/form/)                                                                  |
| host                    | [Skill](../../foodiya-ui-host/SKILL.md)                    | [Implementation](../../../../src/components/ui/host/)                                                                  |
| launch-screen           | [Skill](../../foodiya-ui-launch-screen/SKILL.md)           | [Implementation](../../../../src/components/ui/launch-screen/)                                                         |
| list                    | [Skill](../../foodiya-ui-list/SKILL.md)                    | [Implementation](../../../../src/components/ui/list/)                                                                  |
| list-item               | [Skill](../../foodiya-ui-list-item/SKILL.md)               | [Implementation](../../../../src/components/ui/list-item/)                                                             |
| loading                 | [Skill](../../foodiya-ui-loading/SKILL.md)                 | [Implementation](../../../../src/components/ui/loading/)                                                               |
| native                  | [Skill](../../foodiya-ui-native/SKILL.md)                  | [Implementation](../../../../src/components/ui/native/)                                                                |
| otp-bottom-sheet        | [Skill](../../foodiya-ui-otp-bottom-sheet/SKILL.md)        | [Implementation](../../../../src/components/ui/otp-bottom-sheet/)                                                      |
| page                    | [Skill](../../foodiya-ui-page/SKILL.md)                    | [Implementation](../../../../src/components/ui/page/)                                                                  |
| picker                  | [Skill](../../foodiya-ui-picker/SKILL.md)                  | [Implementation](../../../../src/components/ui/picker/)                                                                |
| refreshable-scroll-view | [Skill](../../foodiya-ui-refreshable-scroll-view/SKILL.md) | [Implementation](../../../../src/components/ui/refreshable-scroll-view/)                                               |
| segmented-control       | [Skill](../../foodiya-ui-segmented-control/SKILL.md)       | [Implementation](../../../../src/components/ui/segmented-control/)                                                     |
| skeleton                | [Skill](../../foodiya-ui-skeleton/SKILL.md)                | [Implementation](../../../../src/components/ui/skeleton/)                                                              |
| slider                  | [Skill](../../foodiya-ui-slider/SKILL.md)                  | [Implementation](../../../../src/components/ui/slider/)                                                                |
| switch                  | [Skill](../../foodiya-ui-switch/SKILL.md)                  | [Implementation](../../../../src/components/ui/switch/)                                                                |
| text                    | [Skill](../../foodiya-ui-text/SKILL.md)                    | [Implementation](../../../../src/components/ui/text/)                                                                  |
| text-input              | [Skill](../../foodiya-ui-text-input/SKILL.md)              | [Implementation](../../../../src/components/ui/text-input/)                                                            |
| alert                   | [Skill](../../foodiya-ui-alert/SKILL.md)                   | [Implementation](../../../../src/components/ui/alert/)                                                                 |

## Direct native exports

Column, Row, Spacer, ScrollView, RNHostView and Icon are public exports with
their own small skills in the [component index](../../foodiya-implementation/references/component-skills.md).
Do not introduce wrappers solely to rename them.

## Native stories and verification

Current stories are in [Components](../../../../.rnstorybook/stories/components/)
and [Forms](../../../../.rnstorybook/stories/forms/). Use the nearest existing
composition when a family has no standalone story. Follow
[the Storybook workflow](storybook-testing.md); automated suites and Maestro
flows have been removed. A source link or story is not evidence of native verification.
