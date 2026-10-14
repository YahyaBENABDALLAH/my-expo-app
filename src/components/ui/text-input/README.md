# Text input

`UniversalTextInput` hosts the field at an RN boundary; `UniversalTextInputContent` composes inside an existing Host. Both keep the universal Expo UI input props, label, helperText, status, optional palette, leading/trailing icons and accessible trailing action.

The Host supplies native typography and tint. The wrapper adds the shared text, surface, border, muted and validation colors. Explicit native color props and palette overrides remain supported. Disabled content dims while the surface stays intact; read-only editing and a separate icon action remain independent.

There is no width-measurement state, delayed first render, focus-border state, calculated text height or forced remount. Native layout handles width; focus guards only suppress duplicate/initial native notifications. Observable values and input refs retain external reset, selection and keyboard behavior.

On iOS, both SecureField and TextField use `textFieldStyle('plain')`. Vertical padding is no longer added to the editable text. The surface has a 48-point minimum height, matching the eye button’s 48 × 48 native tap area; content can grow for larger fonts or multiline text. Caller height, width, padding and rounded-border overrides remain available. The iOS adapter applies its sizing before surface paint and inset stroke so the whole native surface keeps the supplied dimensions. Android uses its native minimum-size modifier and field weight.

Icons retain 20 × 20 frames. Right actions require an accessibility label and suppress disabled actions. Password toggling changes the native display mode and icon while retaining the observable value and shared surface geometry.

[Native stories](../../../../.rnstorybook/stories/expo-ui/text-input.stories.tsx) cover editing, read-only/disabled, themes, custom geometry and passwords. PasswordVisibility, PasswordVisibilityLargeText, PasswordVisibilityEmpty, PasswordVisibilityDisabled and PasswordVisibilityLight expose native layout status and toggle counts. Their measurement exists only in the story fixture. The [Maestro flow](../../../../.maestro/storybook/text-input-icons.yaml) asserts stable height, value visibility and disabled suppression.

JS tests cover value/field retention, explicit overrides, focus guards, immediate rendering, resizing and native module resolution. On the iPhone 18 Pro simulator running iOS 27, registration inputs retained their visible surface height when hiding/showing empty and filled values, and the filled value survived repeated toggles. Full Storybook/large-text execution is blocked by the installed duplicate `react-native-safe-area-context` inside Storybook (RNCSafeAreaProvider registration error); Android native checks remain pending. These manual checks are not automated screenshot comparison.

Context7 guidance was checked against [SDK 57 TextInput](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/textinput/) and installed Expo UI 57.0.21 native implementations.
