# Text-input composition

The [skill](../SKILL.md) owns the public contract. Compose these examples inside
`PageScreen`, `AuthScreenFrame` or an existing `UniversalHost`. At an RN boundary,
create one Host for the native group; none of the examples needs a nested Host.

## Controlled value, external reset and native focus

The field receives a string, and `onChangeText` updates its owner. Reset changes
that state without a key or ref clear. Focus/blur remain native ref operations.
The keyboard-submit callback receives a string directly.

```tsx
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Column,
  TextInput,
  UniversalButtonContent,
  UniversalTextContent,
  nativeFillWidth,
  type TextInputRef,
} from '@components/ui';
import { spacing } from '@/constants/layout';

export function DraftField() {
  const { t } = useTranslation();
  const inputRef = useRef<TextInputRef>(null);
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);

  return (
    <Column spacing={spacing.lg} modifiers={nativeFillWidth}>
      <TextInput
        ref={inputRef}
        label={t('showcase.draft')}
        value={value}
        onChangeText={setValue}
        onSubmitEditing={setSubmitted}
        returnKeyType="done"
        testID="recipe-draft"
      />
      <UniversalTextContent>
        {submitted === null
          ? t('showcase.inputGallery.notSubmitted')
          : t('showcase.inputGallery.submittedValue', { value: submitted })}
      </UniversalTextContent>
      <UniversalButtonContent
        variant="secondary"
        label={t('showcase.inputGallery.reset')}
        onPress={() => {
          setValue('');
          setSubmitted(null);
        }}
      />
      <UniversalButtonContent
        variant="tertiary"
        label={t('showcase.inputGallery.focus')}
        onPress={() => inputRef.current?.focus()}
      />
    </Column>
  );
}
```

For uncontrolled editing, omit `value` and use a `defaultValue` seed. Observe
`onSubmitEditing` when only the final text is needed; `inputRef.current?.clear()`
can clear the native field. Changing `defaultValue` after mounting is not a reset.
Use the [showcase's uncontrolled example](../../../../src/features/ui-showcase/input-screen.tsx)
for the complete composition.

## Named trailing icon with secure visibility

Reuse the exported native icon choices and keep the same public input mounted.
The accessibility label names the action that the next tap performs. Keep a
hidden password out of visible draft previews.

```tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, authInputIcons } from '@components/ui';

export function DemoPasswordField() {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [shown, setShown] = useState(false);

  return (
    <TextInput
      label={t('auth.password')}
      value={value}
      onChangeText={setValue}
      secureTextEntry={!shown}
      autoCapitalize="none"
      autoCorrect={false}
      autoComplete="off"
      leftIcon={authInputIcons.password}
      rightIcon={shown ? authInputIcons.hidePassword : authInputIcons.showPassword}
      rightIconAccessibilityLabel={t(shown ? 'auth.hidePassword' : 'auth.showPassword')}
      onRightIconPress={() => setShown((current) => !current)}
      testID="demo-password"
    />
  );
}
```

This gallery example disables autofill for sample text. In a real login or
registration workflow, select the appropriate `current-password` or
`new-password` hint through the existing form adapter. Do not add a second
visibility implementation to a screen already using `FormTextInput`.

For a clear-search action, supply a native clear icon, a translated
`rightIconAccessibilityLabel`, and `onRightIconPress={() => setQuery('')}`.
Set `disabled` when the entire control must be unavailable. `readOnly` or
`editable={false}` leaves a separate trailing icon available; choose a meaningful
action for that mode rather than assuming it is disabled too.

## Feedback, keyboard hints and multiline editing

- `status="error"` colors the border/helper but does not validate the text or
  block editing. Keep actual validation in the feature or form schema.
- For email, use `keyboardType="email-address"`, `autoCapitalize="none"` and
  `autoCorrect={false}`. An appropriate `autoComplete` is a separate autofill
  decision. A `returnKeyType="next"` label needs an explicit callback such as
  `onSubmitEditing={() => notesRef.current?.focus()}`.
- For decimals, keep the raw string and use `keyboardType="decimal-pad"`.
  Parsing, localized separators and numeric validation belong to the existing
  domain/form boundary, not a keyboard filter.
- Use `multiline` with `numberOfLines={4}` to reserve four native lines; omit the
  line count for natural growth. `maxLength` limits native input. Keep captions
  honest about any displayed JavaScript string length, especially for emoji and
  combining characters. Provide a reachable native blur/continue action when
  the keyboard has no return action.

For React Hook Form, use
`<FormTextInput control={form.control} name="email" label={t('auth.email')} />`
and the [form skill](../../foodiya-ui-form/SKILL.md). Do not also pass `value`,
`onChangeText`, `onBlur`, `ref` or visual `status`; the adapter owns those props
and derives translated validation feedback from the form.
