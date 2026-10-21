# Storybook selectors

Open a story under **Components** or **Forms**. Existing native test IDs keep
their `expo-ui-` prefixes; Storybook links use `components-` or `forms-`.

| Story                             | Main selectors                                                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Button / Primary                  | `expo-ui-button`, `expo-ui-button-presses`                                                              |
| Button / Interaction              | `button-count`, `button-disabled`, `button-reset`, `button-press-count`                                 |
| Text Input / Empty                | `expo-ui-text-input`                                                                                    |
| Text Input / Controlled           | `expo-ui-text-input-set-value`, `expo-ui-text-input-reset`, `expo-ui-text-input-description`            |
| Text Input / Imperative Actions   | `expo-ui-text-input-focus`, `expo-ui-text-input-blur`, `expo-ui-text-input-clear`                       |
| Text Input / Clickable Right Icon | `expo-ui-text-input-right-icon`, `expo-ui-text-input-press-count`, `expo-ui-text-input-toggle-disabled` |
| Text Input / Password Visibility  | `expo-ui-text-input-right-icon`, `password-visibility-state`                                            |
| Bottom Sheet                      | `expo-ui-bottom-sheet-open`, `expo-ui-bottom-sheet-close`, `expo-ui-bottom-sheet-state`                 |
| Switch                            | `expo-ui-switch`, `expo-ui-switch-value`, `expo-ui-switch-reset`                                        |
| Checkbox                          | `expo-ui-checkbox`, `expo-ui-checkbox-value`                                                            |
| Picker                            | `expo-ui-picker`, `expo-ui-picker-value`, `expo-ui-picker-reset`                                        |
| List                              | `expo-ui-list-row-2`, `expo-ui-list-status`                                                             |
| Skeleton                          | `skeleton-toggle-animation`, `skeleton-animation-state`                                                 |
| Skeleton / Card                   | `skeleton-card`, `skeleton-card-avatar`, `skeleton-card-image`                                          |
| Loading State                     | `loading-demo-title`, `loading-demo-content`, `loading-demo-complete`, `query-error`                    |
| Toast                             | `toast-story-show`, `toast-story-state`, `toast-dismiss`                                                |
| Login Form                        | `native-form-login`, `native-form-password`, `native-form-submit`, `native-form-submit-status`          |
| OTP                               | `otp-demo-open`, `otp-sheet-input`, `otp-sheet-verify`, `otp-sheet-resend`                              |

Input validation errors append `-error`; hints append `-helper`. Closed sheets
have no visible content selector. Native selector exposure must be verified on
each platform. See the maintained `.maestro/components/` and `.maestro/forms/`
flows for complete interaction sequences.

Text exposes named typography and semantic tone stories. Button exposes Primary,
Secondary, Tertiary, Link, Success, Warning, Destructive, Info and Glass, each using
the existing `expo-ui-button` and `expo-ui-button-presses` selectors. Toast exposes
Error, Success, Warning and Info with the same show/dismiss selectors. Use Controls
to change theme and appearance within any variant.
