---
name: foodiya-ui-text-input
description: Compose or maintain Foodiya TextInput fields with controlled strings, initial values, resets, native refs, validation colors, password visibility, named icon actions, keyboard hints and multiline editing. Use for the input contract and in-app showcase; use the form skill for React Hook Form binding and submission.
---

# Foodiya text inputs

Use the public `TextInput` from `@components/ui` for ordinary fields. Follow
[Foodiya implementation](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Keep validation,
submission, search requests and persistence in the owning feature.

## Choose the field and read its actual contract

| Need                                              | Use                                                                         |
| ------------------------------------------------- | --------------------------------------------------------------------------- |
| Local search, draft or standalone editable value  | `TextInput`, a string `value`, and `onChangeText`                           |
| Native editing with only an initial seed          | `TextInput` with optional `defaultValue`, no `value`                        |
| React Hook Form binding and translated validation | `FormTextInput`; read the [form skill](../foodiya-ui-form/SKILL.md)         |
| OTP verification, focus coordination or resend    | Existing [OtpBottomSheet](../foodiya-ui-otp-bottom-sheet/SKILL.md) workflow |

Read the [wrapper and exported types](../../../src/components/ui/text-input/text-input.tsx)
before selecting props. Its `TextInputProps` extends Expo's props with the
important exception that **`value` is a normal string**. The wrapper owns the
native observable; do not pass `useNativeState` as the public field's value.
There are no `NativeField`, `UniversalTextInput` or input-content variants.

Keep this family to four files: `text-input.tsx` owns the public props, value
synchronization, focus and composition; `text-input-native.ios.tsx` and
`text-input-native.android.tsx` own native field appearance, flexible sizing and
the trailing icon button; `text-input-native.d.ts` supplies their private shared
contract. Keep these small native pieces together instead of adding separate
modifier, icon-button or types files.

Use the existing Host from `PageScreen`, `AuthScreenFrame` or native composition.
At an RN boundary, supply `UniversalHost` explicitly. The field does not create
a Host. Arrange native siblings with `Column`/`Row`, and use content buttons with
an explicit semantic variant. See the [Host](../foodiya-ui-host/SKILL.md) and
[button](../foodiya-ui-button/SKILL.md) skills.

This contract was checked with Expo SDK 57 and `@expo/ui` 57.0.21. Before changing
Expo/React Native usage, follow `AGENTS.md`'s installed-version documentation
lookup. Compare the [SDK 57 TextInput reference](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/textinput/)
with the [installed types and native adapters](../../../node_modules/@expo/ui/src/universal/TextInput/).
The upstream examples use observable values; adapt them to this wrapper's string API.

## Keep editing ownership stable

- For controlled editing, keep `value` a string from the first render, reflect
  `onChangeText` into its owning state, and reset with `setValue('')` or the form's
  reset operation. External updates synchronize the native value without keying
  or recreating the wrapper. Do not alternate between `undefined` and a string.
- For uncontrolled editing, omit `value`. `defaultValue` seeds the first native
  value; changing it later, including a translation change, does not overwrite
  edits. Observe `onChangeText` or read the text from `onSubmitEditing`; there is
  no `ref.getValue()` API.
- Do not change keys for a reset, theme/language change, validation status or
  password reveal. Preserve draft, cursor and focus where the native API allows.
  Avoid formatting every keystroke when it needlessly moves selection; keep
  parsing/validation at the feature's existing boundary.
- Keep state close to the section/workflow that owns it. Do not make every
  keystroke update unrelated showcase sections or initiate an unguarded request.
  Reuse existing debounce/query policy when implementing real search.

Read [composition examples](references/composition.md) for controlled strings,
native refs, uncontrolled editing and password/icon composition.

## Use the supported props and callback shapes

| Props                                                                        | Project behavior                                                                                                                                 |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `label`, `placeholder`, `helperText`                                         | Translated visible text; helper/label nodes render only when nonempty.                                                                           |
| `status`                                                                     | `default`, `error`, `success` or `warning`; visual feedback only, not a validator.                                                               |
| `disabled`                                                                   | Forces editing off, dims text/icons, and suppresses the trailing action.                                                                         |
| `readOnly`, `editable`                                                       | Stop editing independently of the trailing icon action. An explicit `editable` wins over `readOnly`; `disabled` still forces it off.             |
| `leftIcon`, `rightIcon`                                                      | Native leading/trailing slots, mirrored in RTL; choose names with `Icon.select`.                                                                 |
| `onRightIconPress`, `rightIconAccessibilityLabel`                            | A separate named trailing action; without a callback, the icon is decorative. A callback alone renders no action unless `rightIcon` is supplied. |
| `keyboardType`, `inputMode`, `returnKeyType`, `enterKeyHint`, `autoComplete` | Native input hints. Explicit `keyboardType` and `returnKeyType` take precedence over their aliases.                                              |
| `multiline`, `numberOfLines`, `rows`, `maxLength`                            | Native text growth/line reservation and length cap; `numberOfLines` wins over `rows`.                                                            |
| `secureTextEntry`, `autoCorrect`, `autoCapitalize`                           | Native secure-entry and typing behavior. Keep secure fields single-line.                                                                         |
| `ref`, focus/selection props, `style`, `textStyle`, `modifiers`              | Supported native mechanisms with the limits below.                                                                                               |
| `colorScheme`, `palette`                                                     | Explicit project color overrides; normal content inherits its Host.                                                                              |

These callbacks differ from RN event objects:

```ts
onChangeText(text: string): void;
onSubmitEditing(text: string): void;
onFocus(): void;
onBlur(): void;
onSelectionChange(selection: { start: number; end: number }): void;
onContentSizeChange(size: { width: number; height: number }): void;
```

Do not read `event.nativeEvent.text`, spread React Native `TextInputProps` into
this field, or invent `onChange`, `onEndEditing`, `blurOnSubmit`, `submitBehavior`
or `loading` props. Select only props present in the installed public types.
`onSubmitEditing` does not submit a form or focus the next field automatically;
wire that behavior in the consumer.

## Preserve native refs, passwords and keyboard limits

Use `useRef<TextInputRef>(null)` for `focus()`, `blur()`, `clear()`, `isFocused()`
and asynchronous `setSelection(start, end)`. Prefer updating controlled state
for clearing a controlled field; use `clear()` for an uncontrolled field. Do not
cast to an RN input ref or use private native methods. The wrapper filters
Compose's initial unfocused notification and repeated focus transitions.

For password visibility, keep one wrapper and string state; toggle
`secureTextEntry`, the named eye icon and its translated accessibility label.
Select symbols with `Icon.select` in the consuming component. The native value
and public ref stay coordinated, but iOS switches between native
TextField/SecureField internally: check focus
and keyboard behavior on device rather than promising identical selection.
For actual form passwords, prefer `FormTextInput`'s existing password options.
Do not echo a hidden password in helper text, debug counters or logs.

On iOS, secure entry ignores selection, select-all, selection callbacks and
multiline/line-count behavior. Ordinary iOS selection APIs require iOS 18+.
Android maps selection to its native field. `selection` itself remains an Expo
observable even though the public text `value` is a string; use it only when the
feature actually needs observable selection. `selectTextOnFocus` overwrites the
range when focus is gained.

Keyboard hints do not validate email or parse numbers. Keep decimal input a
string while editing and validate/normalize in the owning form. Some keyboards
have no return action; provide a reachable alternative for continuing or
blurring. Reuse page/auth keyboard infrastructure; do not fix heights around the
software keyboard or add autofocus to a gallery merely to demonstrate focus.

## Apply theme, geometry and accessibility deliberately

Defaults use the owning Host's text, surface, muted, border, tint and status
tokens. Focus changes the border; semantic error/success/warning colors take
priority. Disabled text/icons dim while the surface remains intact. Read-only
content keeps its ordinary appearance and independent icon action.

The wrapper's `style` applies to the outer field **Row**, with `width` also
constraining its enclosing label/field/helper Column. `textStyle` styles the
editable text; `modifiers` reach the inner native input. They do not style the
whole compound control interchangeably. Explicit border/background/text colors
can override focus or status styling. Supply a complete palette only when an
existing feature owns that semantic palette.

The surface has a 48-point/dp minimum unless a height is explicitly supplied.
iOS uses plain TextField/SecureField styling; both platforms keep a flexible
editable area beside a fixed 48-point/dp trailing action. Preserve the existing
[native adapters](../../../src/components/ui/text-input/).
Avoid clipping large text with a fixed height or replacing native hit areas.
`onContentSizeChange` reports the inner native view's geometry, not the full
label/helper wrapper or a pure text-content height. Do not add measurement or
delayed mounts for ordinary fields.

Translate labels, helpers and action names in English, French and Arabic. A
visible label is a separate native Text node, not proof of a screen-reader label
association; check VoiceOver/TalkBack naming and focus. Add accessibility support
through the shared adapters if needed rather than passing unsupported props.
Use logical leading/trailing icons and keep native text direction unless the
content has a specific directional requirement. Keep errors understandable in
text as well as color, allow helpers to wrap, and check large text and RTL.

## Showcase and verification

Open **UI showcase → Text input**, route `/ui-component/input`. The
[showcase screen](../../../src/features/ui-showcase/input-screen.tsx) covers
controlled updates/reset and focus, uncontrolled ref clearing, all four feedback
states, secure visibility, disabled/read-only icon actions, and email/decimal/
multiline editing. Demo data stays local. Respect requests to use in-app examples
without adding tests or Storybook.

On available native iOS/Android devices, check edits and external reset without
remounts, keyboard return/focus, clear, secure reveal, disabled suppression and
read-only actions. Check helper wrapping, semantic colors, cursor/selection,
large text, Arabic/RTL and keyboard reachability. Include form-reset/error focus
when the form adapter is involved. Do not claim native verification from types
or showcase registration.

Run `npm run typecheck` and `npm run lint`, check edited-file formatting, and
validate changed skill metadata and local links. Report native checks separately
from static validation; historical stories or removed suites do not verify the
current implementation.
