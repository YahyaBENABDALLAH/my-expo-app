# Native control theme coverage

All audited controls now resolve colors from `src/constants/colors.ts` through
their owning `UniversalHost`. Import controls through `@components/ui` so app
screens and native Storybook use the same platform adapters. No packages or
native project files were changed.

| Control          | Android token mappings                                                                                | iOS token mappings                                                                |
| ---------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| SegmentedControl | Selected/unselected surface, content, border and disabled state roles                                 | Tint and foreground                                                               |
| Picker           | Read-only field text/surface/indicator, disabled field, menu surface, selected option and option text | Tint, foreground and disabled foreground                                          |
| Checkbox         | Checked/unchecked/checkmark/disabled colors and label                                                 | Native toggle tint and label                                                      |
| Slider           | Thumb, active/inactive track and tick colors                                                          | Native active tint                                                                |
| List / ListItem  | List background, row surface, headline/supporting/accessory roles, refresh spinner/surface            | List background, row surface, separator, text/supporting/accessory roles and tint |
| FieldGroup       | Form background, grouped row surfaces and default section headers                                     | Form background, row surfaces/separators, headers/footers and tint                |
| Collapsible      | Expanded/collapsed surface, heading and animated disclosure icon                                      | Expanded/collapsed background, heading and disclosure tint                        |

The `control*` roles derive from existing semantic roles instead of duplicating
brand colors. Explicit native modifiers and Android ListItem color overrides
remain available. Host `seedColor` continues to seed native defaults; direct app
token mappings take priority over generated colors.

Expo SDK 57 does not expose every native color. SwiftUI owns the segmented
selected surface, slider thumb/inactive track, native menu presentation and
disabled control treatments. Compose Slider exposes active colors but no
disabled color props. These details remain platform styled; a custom painted
replacement was not introduced.

Compound options and slots preserve their public APIs, including string/number
picker values and conditional fragments. Android picker anchors now receive
the supplied testID, and their displayed labels follow controlled selection
changes through native observable state. List rows retain actual native test
selectors. Native expand/collapse animations remain in place.

Existing light/dark, disabled and interaction stories now use the production
adapters. Theme Tokens includes representative controls. Picker includes reset;
FieldGroup exposes visible state for its switches and checkbox.

Validation includes lint, typecheck, regenerated Storybook registration, native
Metro resolution checks and JS render contract checks for theme switching
without losing state, disabled suppression, compound slots, selection, disclosure
and refresh completion. These checks mock native views and do not establish
native color rendering or accessibility. No device was connected during this
change; Maestro flows and visual inspection remain pending on iOS/Android.

API references: [SDK 57 universal UI](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/),
[Compose SegmentedButton](https://docs.expo.dev/versions/v57.0.0/sdk/ui/jetpack-compose/segmentedbutton/),
[Compose dropdown](https://docs.expo.dev/versions/v57.0.0/sdk/ui/jetpack-compose/exposeddropdownmenubox/),
[SwiftUI modifiers](https://docs.expo.dev/versions/v57.0.0/sdk/ui/swift-ui/modifiers/).
