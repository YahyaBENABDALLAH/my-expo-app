# Component skills

Use this index to select only the component families involved in the change.
The 40 skills below cover 34 shared UI families and six native primitives exported
without local wrappers. **Authored: buttons.** The remaining 39 skills have valid
discovery metadata and an empty instruction body. Platform adapters, content/standalone variants, compound
slots, and private helpers belong to their family's skill. The text skill covers
both the native `Text` export and the project's text wrappers.

The skills stay directly under `.agents/skills/` for consistent discovery, with
`foodiya-ui-` as their shared prefix. Categories below organize the catalog without
adding nested skill roots or changing the application component folders.

Read the relevant authored skill when available. For empty reservations, use the
current component source and README,
[implementation pattern](implementation-pattern.md), and
[component-library skill](../../expo-universal-component-library/SKILL.md).
An empty skill is not evidence that a component has a story or passing tests.
Feature-local fragments follow their feature's implementation pattern; this
catalog covers the shared library, including its internal native helpers and
existing lazy map entry point.

## Layout and native composition

| Component or family                       | Skill                                                                                   | Source / current guidance                                                                   |
| ----------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Column                                    | [foodiya-ui-column](../../foodiya-ui-column/SKILL.md)                                   | [Public native export](../../../../src/components/ui/index.ts)                              |
| Row                                       | [foodiya-ui-row](../../foodiya-ui-row/SKILL.md)                                         | [Public native export](../../../../src/components/ui/index.ts)                              |
| Spacer                                    | [foodiya-ui-spacer](../../foodiya-ui-spacer/SKILL.md)                                   | [Public native export](../../../../src/components/ui/index.ts)                              |
| ScrollView                                | [foodiya-ui-scroll-view](../../foodiya-ui-scroll-view/SKILL.md)                         | [Public native export](../../../../src/components/ui/index.ts)                              |
| RNHostView                                | [foodiya-ui-rn-host-view](../../foodiya-ui-rn-host-view/SKILL.md)                       | [Public native export](../../../../src/components/ui/index.ts)                              |
| Host                                      | [foodiya-ui-host](../../foodiya-ui-host/SKILL.md)                                       | [host/](../../../../src/components/ui/host/README.md)                                       |
| Native layout helpers                     | [foodiya-ui-native](../../foodiya-ui-native/SKILL.md)                                   | [native/](../../../../src/components/ui/native/README.md)                                   |
| Page frames, header, sections, and motion | [foodiya-ui-page](../../foodiya-ui-page/SKILL.md)                                       | [page/](../../../../src/components/ui/page/README.md)                                       |
| Refreshable scroll view                   | [foodiya-ui-refreshable-scroll-view](../../foodiya-ui-refreshable-scroll-view/SKILL.md) | [refreshable-scroll-view/](../../../../src/components/ui/refreshable-scroll-view/README.md) |

## Text, icons, and collections

| Component or family | Skill                                                           | Source / current guidance                                           |
| ------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------- |
| Text                | [foodiya-ui-text](../../foodiya-ui-text/SKILL.md)               | [text/](../../../../src/components/ui/text/README.md)               |
| Icon                | [foodiya-ui-icon](../../foodiya-ui-icon/SKILL.md)               | [Public native export](../../../../src/components/ui/index.ts)      |
| List                | [foodiya-ui-list](../../foodiya-ui-list/SKILL.md)               | [list/](../../../../src/components/ui/list/README.md)               |
| List item           | [foodiya-ui-list-item](../../foodiya-ui-list-item/SKILL.md)     | [list-item/](../../../../src/components/ui/list-item/README.md)     |
| Collapsible         | [foodiya-ui-collapsible](../../foodiya-ui-collapsible/SKILL.md) | [collapsible/](../../../../src/components/ui/collapsible/README.md) |

## Controls and forms

| Component or family    | Skill                                                                       | Source / current guidance                                                       |
| ---------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Button                 | [foodiya-ui-button (authored)](../../foodiya-ui-button/SKILL.md)            | [button/](../../../../src/components/ui/button/README.md)                       |
| Checkbox               | [foodiya-ui-checkbox](../../foodiya-ui-checkbox/SKILL.md)                   | [checkbox/](../../../../src/components/ui/checkbox/README.md)                   |
| Switch                 | [foodiya-ui-switch](../../foodiya-ui-switch/SKILL.md)                       | [switch/](../../../../src/components/ui/switch/README.md)                       |
| Slider                 | [foodiya-ui-slider](../../foodiya-ui-slider/SKILL.md)                       | [slider/](../../../../src/components/ui/slider/README.md)                       |
| Picker                 | [foodiya-ui-picker](../../foodiya-ui-picker/SKILL.md)                       | [picker/](../../../../src/components/ui/picker/README.md)                       |
| Segmented control      | [foodiya-ui-segmented-control](../../foodiya-ui-segmented-control/SKILL.md) | [segmented-control/](../../../../src/components/ui/segmented-control/README.md) |
| Text input             | [foodiya-ui-text-input](../../foodiya-ui-text-input/SKILL.md)               | [text-input/](../../../../src/components/ui/text-input/README.md)               |
| Field group            | [foodiya-ui-field-group](../../foodiya-ui-field-group/SKILL.md)             | [field-group/](../../../../src/components/ui/field-group/README.md)             |
| Form fields and submit | [foodiya-ui-form](../../foodiya-ui-form/SKILL.md)                           | [form/](../../../../src/components/ui/form/README.md)                           |

## Feedback and overlays

| Component or family                | Skill                                                             | Source / current guidance                                             |
| ---------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------- |
| Bottom sheet                       | [foodiya-ui-bottom-sheet](../../foodiya-ui-bottom-sheet/SKILL.md) | [bottom-sheet/](../../../../src/components/ui/bottom-sheet/README.md) |
| Loading, query content, and errors | [foodiya-ui-loading](../../foodiya-ui-loading/SKILL.md)           | [loading/](../../../../src/components/ui/loading/README.md)           |
| Skeleton                           | [foodiya-ui-skeleton](../../foodiya-ui-skeleton/SKILL.md)         | [skeleton/](../../../../src/components/ui/skeleton/README.md)         |
| Toast                              | [foodiya-ui-toast](../../foodiya-ui-toast/SKILL.md)               | [toast/](../../../../src/components/ui/toast/README.md)               |
| Error toast                        | [foodiya-ui-error-toast](../../foodiya-ui-error-toast/SKILL.md)   | [error-toast/](../../../../src/components/ui/error-toast/README.md)   |

## App compositions

| Component or family              | Skill                                                                       | Source / current guidance                                                       |
| -------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Appearance and language controls | [foodiya-ui-appearance](../../foodiya-ui-appearance/SKILL.md)               | [appearance/](../../../../src/components/ui/appearance/README.md)               |
| Auth frame and controls          | [foodiya-ui-auth](../../foodiya-ui-auth/SKILL.md)                           | [auth/](../../../../src/components/ui/auth/README.md)                           |
| Aurora background                | [foodiya-ui-aurora-background](../../foodiya-ui-aurora-background/SKILL.md) | [aurora-background/](../../../../src/components/ui/aurora-background/README.md) |
| Floating action                  | [foodiya-ui-floating-action](../../foodiya-ui-floating-action/SKILL.md)     | [floating-action/](../../../../src/components/ui/floating-action/README.md)     |
| Home recipe and catalog cards    | [foodiya-ui-home-recipe-card](../../foodiya-ui-home-recipe-card/SKILL.md)   | [home-recipe-card/](../../../../src/components/ui/home-recipe-card/README.md)   |
| Launch screen                    | [foodiya-ui-launch-screen](../../foodiya-ui-launch-screen/SKILL.md)         | [launch-screen/](../../../../src/components/ui/launch-screen/README.md)         |
| Map experience                   | [foodiya-ui-map-experience](../../foodiya-ui-map-experience/SKILL.md)       | [map-experience/](../../../../src/components/ui/map-experience/README.md)       |
| Navigation presentation          | [foodiya-ui-navigation](../../foodiya-ui-navigation/SKILL.md)               | [navigation/](../../../../src/components/ui/navigation/README.md)               |
| Onboarding page and pager        | [foodiya-ui-onboarding](../../foodiya-ui-onboarding/SKILL.md)               | [onboarding/](../../../../src/components/ui/onboarding/README.md)               |
| OTP bottom sheet                 | [foodiya-ui-otp-bottom-sheet](../../foodiya-ui-otp-bottom-sheet/SKILL.md)   | [otp-bottom-sheet/](../../../../src/components/ui/otp-bottom-sheet/README.md)   |
| Recipe card                      | [foodiya-ui-recipe-card](../../foodiya-ui-recipe-card/SKILL.md)             | [recipe-card/](../../../../src/components/ui/recipe-card/README.md)             |
| Recipe stepper                   | [foodiya-ui-recipe-stepper](../../foodiya-ui-recipe-stepper/SKILL.md)       | [recipe-stepper/](../../../../src/components/ui/recipe-stepper/README.md)       |

## Extend a component skill later

Fill only the requested skill's body with component-specific decisions that are
not already covered by the shared pattern: public props and controlled state,
Host ownership, native differences, semantic theme roles, accessibility,
composition constraints, and relevant story/test paths. Keep detailed examples in
references only when useful. Change its description to describe the authored
capability and remove the empty-status wording when instructions exist. Do not
copy the shared implementation pattern into every component skill.

When a new shared component family is added, add a matching
`foodiya-ui-<family>/SKILL.md` and a row here. Keep skill folder and frontmatter
names identical. Reuse the existing native primitive skills for direct exports;
a reserved skill does not require a new production wrapper.
