# Component skills

Use this index to select only the component families involved in the change.
The 33 skills below cover 27 shared UI families and six native primitives.
Each family skill owns its current component contract. Short guidance stays in
SKILL.md; the longer page and button guides use linked references. Read only
the relevant family and shared rules. Source folders contain code, not duplicate
READMEs. The text skill covers native Text and the project text wrappers.

## Layout and native composition

| Component or family                       | Skill                                                                                   | Source / current guidance                                                          |
| ----------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Column                                    | [foodiya-ui-column](../../foodiya-ui-column/SKILL.md)                                   | [Public native export](../../../../src/components/ui/index.ts)                     |
| Row                                       | [foodiya-ui-row](../../foodiya-ui-row/SKILL.md)                                         | [Public native export](../../../../src/components/ui/index.ts)                     |
| Spacer                                    | [foodiya-ui-spacer](../../foodiya-ui-spacer/SKILL.md)                                   | [Public native export](../../../../src/components/ui/index.ts)                     |
| ScrollView                                | [foodiya-ui-scroll-view](../../foodiya-ui-scroll-view/SKILL.md)                         | [Public native export](../../../../src/components/ui/index.ts)                     |
| RNHostView                                | [foodiya-ui-rn-host-view](../../foodiya-ui-rn-host-view/SKILL.md)                       | [Public native export](../../../../src/components/ui/index.ts)                     |
| Host                                      | [foodiya-ui-host](../../foodiya-ui-host/SKILL.md)                                       | [host/](../../../../src/components/ui/host/)                                       |
| Native layout helpers                     | [foodiya-ui-native](../../foodiya-ui-native/SKILL.md)                                   | [native/](../../../../src/components/ui/native/)                                   |
| Page frames, header, sections, and motion | [foodiya-ui-page](../../foodiya-ui-page/SKILL.md)                                       | [page/](../../../../src/components/ui/page/)                                       |
| Refreshable scroll view                   | [foodiya-ui-refreshable-scroll-view](../../foodiya-ui-refreshable-scroll-view/SKILL.md) | [refreshable-scroll-view/](../../../../src/components/ui/refreshable-scroll-view/) |

## Text, icons, and collections

| Component or family | Skill                                                           | Source / current guidance                                      |
| ------------------- | --------------------------------------------------------------- | -------------------------------------------------------------- |
| Text                | [foodiya-ui-text](../../foodiya-ui-text/SKILL.md)               | [text/](../../../../src/components/ui/text/)                   |
| Icon                | [foodiya-ui-icon](../../foodiya-ui-icon/SKILL.md)               | [Public native export](../../../../src/components/ui/index.ts) |
| List                | [foodiya-ui-list](../../foodiya-ui-list/SKILL.md)               | [list/](../../../../src/components/ui/list/)                   |
| List item           | [foodiya-ui-list-item](../../foodiya-ui-list-item/SKILL.md)     | [list-item/](../../../../src/components/ui/list-item/)         |
| Collapsible         | [foodiya-ui-collapsible](../../foodiya-ui-collapsible/SKILL.md) | [collapsible/](../../../../src/components/ui/collapsible/)     |

## Controls and forms

| Component or family    | Skill                                                                       | Source / current guidance                                              |
| ---------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Button                 | [foodiya-ui-button (authored)](../../foodiya-ui-button/SKILL.md)            | [button/](../../../../src/components/ui/button/)                       |
| Checkbox               | [foodiya-ui-checkbox](../../foodiya-ui-checkbox/SKILL.md)                   | [checkbox/](../../../../src/components/ui/checkbox/)                   |
| Switch                 | [foodiya-ui-switch](../../foodiya-ui-switch/SKILL.md)                       | [switch/](../../../../src/components/ui/switch/)                       |
| Slider                 | [foodiya-ui-slider](../../foodiya-ui-slider/SKILL.md)                       | [slider/](../../../../src/components/ui/slider/)                       |
| Picker                 | [foodiya-ui-picker](../../foodiya-ui-picker/SKILL.md)                       | [picker/](../../../../src/components/ui/picker/)                       |
| Segmented control      | [foodiya-ui-segmented-control](../../foodiya-ui-segmented-control/SKILL.md) | [segmented-control/](../../../../src/components/ui/segmented-control/) |
| Text input             | [foodiya-ui-text-input](../../foodiya-ui-text-input/SKILL.md)               | [text-input/](../../../../src/components/ui/text-input/)               |
| Field group            | [foodiya-ui-field-group](../../foodiya-ui-field-group/SKILL.md)             | [field-group/](../../../../src/components/ui/field-group/)             |
| Form fields and submit | [foodiya-ui-form](../../foodiya-ui-form/SKILL.md)                           | [form/](../../../../src/components/ui/form/)                           |

## Feedback and overlays

| Component or family                | Skill                                                             | Source / current guidance                                    |
| ---------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------ |
| Bottom sheet                       | [foodiya-ui-bottom-sheet](../../foodiya-ui-bottom-sheet/SKILL.md) | [bottom-sheet/](../../../../src/components/ui/bottom-sheet/) |
| Loading, query content, and errors | [foodiya-ui-loading](../../foodiya-ui-loading/SKILL.md)           | [loading/](../../../../src/components/ui/loading/)           |
| Skeleton                           | [foodiya-ui-skeleton](../../foodiya-ui-skeleton/SKILL.md)         | [skeleton/](../../../../src/components/ui/skeleton/)         |
| Toast                              | [foodiya-ui-toast](../../foodiya-ui-toast/SKILL.md)               | [toast/](../../../../src/components/ui/toast/)               |
| Error toast                        | [foodiya-ui-error-toast](../../foodiya-ui-error-toast/SKILL.md)   | [error-toast/](../../../../src/components/ui/error-toast/)   |

## App compositions

| Component or family              | Skill                                                                     | Source / current guidance                                            |
| -------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Appearance and language controls | [foodiya-ui-appearance](../../foodiya-ui-appearance/SKILL.md)             | [appearance/](../../../../src/components/ui/appearance/)             |
| Auth frame and controls          | [foodiya-ui-auth](../../foodiya-ui-auth/SKILL.md)                         | [auth/](../../../../src/components/ui/auth/)                         |
| Floating action                  | [foodiya-ui-floating-action](../../foodiya-ui-floating-action/SKILL.md)   | [floating-action/](../../../../src/components/ui/floating-action/)   |
| Launch screen                    | [foodiya-ui-launch-screen](../../foodiya-ui-launch-screen/SKILL.md)       | [launch-screen/](../../../../src/components/ui/launch-screen/)       |
| OTP bottom sheet                 | [foodiya-ui-otp-bottom-sheet](../../foodiya-ui-otp-bottom-sheet/SKILL.md) | [otp-bottom-sheet/](../../../../src/components/ui/otp-bottom-sheet/) |

## Maintain the component contract

Update the existing family skill for prop, Host, theme or native behavior changes.
Keep source and current story links accurate. Link shared rules rather than
copying them. A new component family needs one matching skill and index row;
a new API mode or state does not need another skill.
